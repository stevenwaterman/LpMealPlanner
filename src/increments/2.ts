import glp from "GLPK";
import {loadProblem, newConstraint, newVariable, product,} from "../util";
import {days, meals} from "../data";
import {printTable} from "../print";
import {recipes} from "../inputs";
import {time} from "../timer";

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

product(days, meals)
    .forEach(([day, meal]) =>
        newConstraint(
            `Number of recipes for ${day} ${meal}`,
            {
                min: 1,
                max: 1
            },
            meta => {
                if (meta.day === day && meta.meal === meal) return 1;
            }
        ))

product(days, recipes)
    .forEach(([day, recipe]) =>
        newConstraint(
            `Number of ${recipe} eaten on ${day}`,
            {
                min: 0,
                max: 1
            },
            meta => {
                if (meta.day === day && meta.recipe === recipe) return 1;
            }
        ))

lp.setObjDir(glp.MAX);

time(() => loadProblem(lp))
time(() => {
    lp.simplexSync({});
    lp.intoptSync({});
})

printTable(lp);
lp.delete();

