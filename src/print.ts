import {days, slots} from "./data";
import {Constraint, constraints, Variable, variables} from "./util";
import {table} from "table";
import {Problem} from "GLPK";

export function printTable(lp: Problem) {
    const tableData: string[][] = [
        ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", ""],
        ["Breakfast", "", "", "", "", "", "", "", ""],
        ["Lunch", "", "", "", "", "", "", "", ""],
        ["Starter", "", "", "", "", "", "", "", ""],
        ["Dinner", "", "", "", "", "", "", "", ""],
        ["Dessert", "", "", "", "", "", "", "", "Average"],
        ["Calories", "", "", "", "", "", "", "", ""],
        ["Time Spent", "", "", "", "", "", "", "", ""]
    ]
    slots.forEach((slot, yIdx) => {
        days.forEach((day, xIdx) => {
            const relevant: Variable[] = variables.filter(variable => variable.name.match(new RegExp(`Portions of .* for ${day} ${slot}`)));
            const foundVariable = relevant.find(variable => lp.mipColVal(variable.idx) > 0);
            if (foundVariable !== undefined) {
                tableData[yIdx + 1][xIdx + 1] = `${lp.mipColVal(foundVariable.idx).toFixed(2)} ${foundVariable.meta.recipe.name.slice(0, 15)}`
            }
        })
    });

    days.forEach((day, xIdx) => {
        const constraint: Constraint | undefined = constraints.find(constraint => constraint.name.match(new RegExp(`Calories on ${day}`)));
        if (constraint === undefined) throw new Error(`Could not find calories constraint for ${day}`);
        tableData[6][xIdx + 1] = lp.mipRowVal(constraint.idx).toFixed(0);
    })

    const weeklyCalsConstraint: Constraint | undefined = constraints.find(constraint => constraint.name === "Total Weekly Calories");
    if (weeklyCalsConstraint === undefined) throw new Error(`Could not find weekly calories constraint`);
    tableData[6][8] = (lp.mipRowVal(weeklyCalsConstraint.idx) / 7).toFixed(0);

    days.forEach((day, xIdx) => {
        const constraint: Constraint | undefined = constraints.find(constraint => constraint.name.match(new RegExp(`Time spent on ${day}`)));
        if (constraint === undefined) throw new Error(`Could not find time constraint for ${day}`);
        tableData[7][xIdx + 1] = lp.mipRowVal(constraint.idx).toFixed(0);
    })

    console.log();
    console.log(table(tableData));
    console.log(`Objective: ${lp.mipObjVal()}`);
    console.log("Iterations: ", lp.getItCnt());
    console.log("status:", lp.mipStatus());
}