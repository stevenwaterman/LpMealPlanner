import glp from "GLPK";
import {loadProblem, newConstraint, newVariable, product,} from "../util";
import {days, meals} from "../data";
import {printTable} from "../print";
import {caloriesMax, caloriesMin, maxTime, mealRequired, recipes} from "../inputs";
import {time} from "../timer";

/*
Versions:

1. Set allowed meals

2. Only allow 1 meal per meal
- should show avocado toast for breakfast and lunch each day (bad)

3. Only allow recipe once per day
- should show same thing being eaten each day

4. Max time
- should show lots of high calorie desserts

5. Daily calories
- should struggle to reach high calorie counts
 */

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
                min: mealRequired[day][meal] ? 1 : 0,
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

days.forEach(day =>
    newConstraint(
        `Time spent on ${day}`,
        {max: maxTime[day]},
        meta => {
            if (meta.day === day) return meta.recipe.time;
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
            if (meta.day === day) return meta.recipe.calories;
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

