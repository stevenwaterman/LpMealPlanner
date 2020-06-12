import glp from "GLPK";
import {loadProblem, newConstraint, newVariable, product} from "./util";
import {printTable} from "./print";
import {time} from "./timer";
import {days, meals} from "./data";
import {caloriesMax, caloriesMin, maxTime, mealRequired, recipes} from "./inputs";

const lp = new glp.Problem();
lp.setProbName("Meal Planning");

product(days, meals, recipes)
    .filter(([_, meal, recipe]) => recipe.allowedMeals.includes(meal))
    .forEach(([day, meal, recipe]) => {
            const eaten = newVariable(
                `Ate ${recipe.name} for ${day} ${meal}`,
                {type: "eaten", day, meal, recipe},
                {
                    min: 0,
                    max: 1,
                    allowDecimal: false
                },
                recipe.rating
            )

            const portions = newVariable(
                `Portions of ${recipe.name} for ${day} ${meal}`,
                {type: "portions", day, meal, recipe},
                {
                    min: 0,
                    max: recipe.portions.max,
                    allowDecimal: recipe.portions.allowDecimal
                }
            )

            newConstraint(
                `if eaten === 1, portions >= min`,
                {min: 0},
                [
                    [-recipe.portions.min, eaten],
                    [1, portions]
                ]
            )

            newConstraint(
                `if portions > 0, eaten === 1`,
                {min: 0},
                [
                    [recipe.portions.max, eaten],
                    [-1, portions]
                ]
            )
        }
    )

product(days, meals)
    .forEach(([day, meal]) =>
        newConstraint(
            `Number of recipes for ${day} ${meal}`,
            {
                min: mealRequired[day][meal] ? 1 : 0,
                max: 1
            },
            meta => {
                if (meta.type === "eaten" && meta.day === day && meta.meal === meal) return 1;
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
                if (meta.type === "eaten" && meta.day === day && meta.recipe === recipe) return 1;
            }
        ))

days.forEach(day =>
    newConstraint(
        `Time spent on ${day}`,
        {max: maxTime[day]},
        meta => {
            if (meta.type === "eaten" && meta.day === day) return meta.recipe.time;
        }
    )
)

days.forEach(day =>
    newConstraint(
        `Calories on ${day}`,
        {
            min: caloriesMin,
            max: caloriesMax
        },
        meta => {
            if (meta.type === "portions" && meta.day === day) return meta.recipe.calories;
        }
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

