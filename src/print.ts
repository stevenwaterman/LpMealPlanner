import {days, meals} from "./data";
import {Constraint, constraints, Variable, variables} from "./util";
import {table} from "table";
import {Problem, UNDEF} from "GLPK";

export function printTable(lp: Problem) {
    switch(lp.mipStatus()){
        case UNDEF: {
            console.log("No Solution");
            return;
        }
    }


    const tableData: string[][] = [
        ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        ["Breakfast", "", "", "", "", "", "", ""],
        ["Lunch", "", "", "", "", "", "", ""],
        ["Starter", "", "", "", "", "", "", ""],
        ["Dinner", "", "", "", "", "", "", ""],
        ["Dessert", "", "", "", "", "", "", ""]
    ]

    let hasPortions = false;
    meals.forEach((slot, yIdx) => {
        days.forEach((day, xIdx) => {
            const relevant: Variable[] = variables.filter(variable => variable.name.match(new RegExp(`Portions of .* for ${day} ${slot}`)));
            const nonZero: Variable[] = relevant.filter(variable => lp.mipColVal(variable.idx) > 0.001);
            if(nonZero.length) {
                hasPortions = true;
                tableData[yIdx + 1][xIdx + 1] = nonZero.map(variable => `${parseFloat(lp.mipColVal(variable.idx).toFixed(2))} ${variable.meta.recipe.name.slice(0, 30)}`).join("\n");
            }
        })
    });

    if(!hasPortions) {
        meals.forEach((slot, yIdx) => {
            days.forEach((day, xIdx) => {
                const relevant: Variable[] = variables.filter(variable => variable.name.match(new RegExp(`Ate .* for ${day} ${slot}`)));
                const nonZero: Variable[] = relevant.filter(variable => lp.mipColVal(variable.idx) > 0.001);
                if(nonZero.length) {
                    hasPortions = true;
                    tableData[yIdx + 1][xIdx + 1] = nonZero.map(variable => `${variable.meta.recipe.name.slice(0, 15)}`).join("\n");
                }
            })
        });
    }

    let hasCalories = false;
    const caloriesData = ["Calories", "", "", "", "", "", "", ""]
    days.forEach((day, xIdx) => {
        const constraint: Constraint | undefined = constraints.find(constraint => constraint.name.match(new RegExp(`Calories on ${day}`)));
        if (constraint !== undefined) {
            hasCalories = true;
            caloriesData[xIdx + 1] = lp.mipRowVal(constraint.idx).toFixed(0);
        }
    })

    let hasTime = false;
    const timeData = ["Time", "", "", "", "", "", "", ""]
    days.forEach((day, xIdx) => {
        const constraint: Constraint | undefined = constraints.find(constraint => constraint.name.match(new RegExp(`Time spent on ${day}`)));
        if (constraint !== undefined) {
            hasTime = true;
            timeData[xIdx + 1] = `${lp.mipRowVal(constraint.idx).toFixed(0)} mins`;
        }
    })

    if (hasCalories) tableData.push(caloriesData);
    if (hasTime) tableData.push(timeData);

    console.log();
    console.log(table(tableData));
    console.log(`Objective: ${lp.mipObjVal()}`);
    console.log("Iterations: ", lp.getItCnt());
    console.log("status:", lp.mipStatus());
}