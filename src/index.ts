import glp from "GLPK";
import {loadProblem, newConstraint, newVariable,} from "./util";
import {days, slots} from "./data";
import {printTable} from "./print";
import {calories, maxTime, mealRequired, recipes} from "./inputs";

/*
Versions:

1. Eaten variable per day x slot x recipe, bound 0..1, with objective value
- should show many meals being eaten per slot (bad)

2. Only allow 1 meal per slot
- should show avocado toast for breakfast and lunch each day (bad)

3. Only allow recipe once per day
- should show same thing being eaten each day

4. Max time
- should show lots of high calorie desserts

5. Daily calories
- should show lack of variation

6. Weekly calories
- should show more variation, but low-calorie recipes not chosen very often

7. Portions
- low-calorie recipes chosen more often

 */

const lp = new glp.Problem();
lp.setProbName("Meal Planning");
lp.setObjDir(glp.MAX);

for (let day of days) {
    for (let recipe of recipes) {
        for (let slot of recipe.allowedSlots) {
            const portions = newVariable(
                `Portions of ${recipe.name} for ${day} ${slot}`,
                {type: "portions", day, slot, recipe},
                {
                    min: 0,
                    max: recipe.portions.max,
                    allowDecimal: recipe.portions.allowDecimal
                }
            )

            const eaten = newVariable(
                `Ate ${recipe.name} for ${day} ${slot}`,
                {type: "eaten", day, slot, recipe},
                {
                    min: 0,
                    max: 1,
                    allowDecimal: false
                },
                recipe.rating
            )

            // Portions > 0 iff eaten === 1
            newConstraint(
                `${eaten.name} only if portions >= 0`,
                {min: 0},
                [
                    [1000, portions],
                    [-1, eaten]
                ]
            )
            newConstraint(
                `${portions.name} only if eaten == 1`,
                {min: 0},
                [
                    [-1, portions],
                    [1000, eaten]
                ]
            )

            newConstraint(
                `At least ${recipe.portions.min} portions of ${recipe.name} for ${day} ${slot}`,
                {min: 0},
                [
                    [1, portions],
                    [-recipe.portions.min, eaten]
                ]
            )
        }
    }
}

for (let day of days) {
    for(let slot of slots) {
        newConstraint(
            `Number of recipes for ${day} ${slot}`,
            {
                min: mealRequired[day][slot] ? 1 : 0,
                max: 1
            },
            meta => {
                if (meta.type === "eaten" && meta.day === day && meta.slot === slot) return 1;
            }
        )
    }
}

for (let day of days) {
    for (let recipe of recipes) {
        newConstraint(
            `Number of ${recipe} eaten on ${day}`,
            { max: 1 },
            meta => {
                if (meta.type === "eaten" && meta.day === day && meta.recipe === recipe) return 1;
            }
        )
    }
}

for (let day of days) {
    newConstraint(
        `Calories on ${day}`,
        {
            min: calories.day.min,
            max: calories.day.max
        },
        meta => {
            if (meta.type === "portions" && day === meta.day) return meta.recipe.calories;
        }
    )
}

newConstraint(
    "Total Weekly Calories",
    {
        min: calories.week.min,
        max: calories.week.max
    },
    meta => {
        if (meta.type === "portions") return meta.recipe.calories;
    }
)

for (let day of days) {
    newConstraint(
        `Time spent on ${day}`,
        { max: maxTime[day] },
        meta => {
            if (meta.type === "eaten" && day === meta.day) return meta.recipe.time;
        }
    )
}


const t1 = new Date();
loadProblem(lp);
const t2 = new Date();

const t3 = new Date();
lp.simplexSync({});
lp.intoptSync({});
const t4 = new Date();

console.log("Time to load problem:", t2.getTime() - t1.getTime());
console.log("Time to solve problem", t4.getTime() - t3.getTime());

printTable(lp);
lp.delete();

