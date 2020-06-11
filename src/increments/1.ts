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
*/

const lp = new glp.Problem();
lp.setProbName("Meal Planning");
lp.setObjDir(glp.MAX);

for (let day of days) {
    for (let recipe of recipes) {
        for (let slot of recipe.allowedSlots) {
            newVariable(
                `Ate ${recipe.name} for ${day} ${slot}`,
                {type: "eaten", day, slot, recipe},
                {
                    min: 0,
                    max: 1,
                    allowDecimal: false
                },
                recipe.rating
            )
        }
    }
}

time(() => loadProblem(lp))
time(() => {
    lp.simplexSync({});
    lp.intoptSync({});
})

printTable(lp);
lp.delete();

