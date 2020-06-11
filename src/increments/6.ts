import glp from "GLPK";
import {loadProblem, newConstraint, newVariable,} from "../util";
import {days, slots} from "../data";
import {printTable} from "../print";
import {caloriesMax, caloriesMin, maxTime, mealRequired, recipes} from "../inputs";
import {time} from "../timer";

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
- should struggle to reach high calorie counts

6. Portions
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
    for (let slot of slots) {
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
            {max: 1},
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
            min: caloriesMin,
            max: caloriesMax
        },
        meta => {
            if (meta.type === "portions" && day === meta.day) return meta.recipe.calories;
        }
    )
}

for (let day of days) {
    newConstraint(
        `Time spent on ${day}`,
        {max: maxTime[day]},
        meta => {
            if (meta.type === "eaten" && day === meta.day) return meta.recipe.time;
        }
    )
}


time(() => loadProblem(lp))
time(() => {
    lp.simplexSync({});
    lp.intoptSync({});
})

printTable(lp);
lp.delete();

