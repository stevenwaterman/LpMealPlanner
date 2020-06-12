import glp from "GLPK";
import {loadProblem, newVariable, product,} from "../util";
import {printTable} from "../print";
import {time} from "../timer";
import {days, meals} from "../data";
import {recipes} from "../inputs";

const lp = new glp.Problem();
lp.setProbName("Meal Planning");

product(days, meals, recipes)
    .filter(([_, meal, recipe]) => recipe.allowedMeals.includes(meal))
    .forEach(([day, meal, recipe]) =>
        newVariable(
            `Ate ${recipe.name} for ${day} ${meal}`,
            {day, meal, recipe},
            {
                min: 0,
                max: 1,
                allowDecimal: false
            },
            recipe.rating
        )
    )

lp.setObjDir(glp.MAX);

time(() => loadProblem(lp))
time(() => {
    lp.simplexSync({});
    lp.intoptSync({});
})

printTable(lp);
lp.delete();

