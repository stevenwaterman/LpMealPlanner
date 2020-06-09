import glp from "GLPK";
import {AuxVariableDefinition, Constraint, loadProblem, StructVariableDefinition} from "./util";
import {Day, days, maxTime, meals, nutritionRequirements, Recipe, recipes, Slot, slots} from "./data";

const lp = new glp.Problem();
lp.setProbName("sample");
lp.setObjDir(glp.MAX);
glp.termOutput(true);
lp.scaleSync(glp.SF_AUTO);

type MealSlotAuxDef = AuxVariableDefinition & {
    _brand: "MealSlotAuxDef",
    day: Day,
    slot: Slot
}

type DailyRecipeAuxDef = AuxVariableDefinition & {
    _brand: "DailyRecipeAuxDef",
    day: Day,
    recipe: Recipe
}

type MaxTimeAuxDef = AuxVariableDefinition & {
    _brand: "MaxTimeAuxDef",
    day: Day
}

type DailyCaloriesDef = AuxVariableDefinition & {
    _brand: "DailyCaloriesDef",
    day: Day
}

type WeeklyCaloriesDef = AuxVariableDefinition & {
    _brand: "WeeklyCaloriesDef"
}

type RecipeInSlotStructDef = StructVariableDefinition & {
    _brand: "RecipeInSlotStructDef",
    recipe: Recipe,
    day: Day,
    slot: Slot
}

const mealSlotAuxDefs: MealSlotAuxDef[] = [];
const dailyRecipeAuxDefs: DailyRecipeAuxDef[] = [];
const maxTimeAuxDefs: MaxTimeAuxDef[] = [];
const dailyCaloriesDefs: DailyCaloriesDef[] = [];

const structDefs: RecipeInSlotStructDef[] = [];
const constraints: Constraint[] = [];

let auxDefIdx = 1;
let structDefIdx = 1;

meals.forEach((meal) => {
    const min = meal.required ? 1 : undefined;
    mealSlotAuxDefs.push({
        _brand: "MealSlotAuxDef",
        idx: auxDefIdx,
        name: `${meal.day} ${meal.slot}`,
        min,
        max: 1,
        day: meal.day,
        slot: meal.slot
    });
    auxDefIdx++;
});

days.forEach(day => {
    recipes.forEach(recipe => {
        dailyRecipeAuxDefs.push({
            _brand: "DailyRecipeAuxDef",
            idx: auxDefIdx,
            name: `${recipe.name} on ${day}`,
            max: 1,
            day,
            recipe
        });
        auxDefIdx++;
    })
})

days.forEach(day => {
    maxTimeAuxDefs.push({
        _brand: "MaxTimeAuxDef",
        idx: auxDefIdx,
        name: `Time spent on ${day}`,
        day,
        max: maxTime[day]
    })
    auxDefIdx++;
})

days.forEach(day => {
    dailyCaloriesDefs.push({
        _brand: "DailyCaloriesDef",
        idx: auxDefIdx,
        name: `Calories eaten on ${day}`,
        day,
        min: nutritionRequirements.calories.day.min,
        max: nutritionRequirements.calories.day.max
    })
    auxDefIdx++;
})

const weeklyCaloriesDef: WeeklyCaloriesDef = {
    _brand: "WeeklyCaloriesDef",
    idx: auxDefIdx,
    name: "Total Calories",
    min: nutritionRequirements.calories.week.min,
    max: nutritionRequirements.calories.week.max
};
auxDefIdx++;

recipes.forEach((recipe) => {
    meals.forEach(({day, slot}) => {
        if (recipe.allowedSlots.includes(slot)) {
            structDefs.push({
                _brand: "RecipeInSlotStructDef",
                idx: structDefIdx,
                name: `${recipe.name} for ${day} ${slot}`,
                kind: glp.BV,
                min: 0,
                max: 1,
                objectiveCoef: recipe.rating,
                recipe,
                day,
                slot
            });

            mealSlotAuxDefs.filter(def => def.day === day && def.slot === slot).forEach(def => {
                constraints.push({
                    structIdx: structDefIdx,
                    auxIdx: def.idx,
                    coeff: 1
                })
            })

            dailyRecipeAuxDefs.filter(def => def.day === day && def.recipe === recipe).forEach(def => {
                constraints.push({
                    structIdx: structDefIdx,
                    auxIdx: def.idx,
                    coeff: 1
                })
            })

            maxTimeAuxDefs.filter(def => def.day === day).forEach(def => {
                constraints.push({
                    structIdx: structDefIdx,
                    auxIdx: def.idx,
                    coeff: recipe.time
                })
            })

            dailyCaloriesDefs.filter(def => def.day === day).forEach(def => {
                constraints.push({
                    structIdx: structDefIdx,
                    auxIdx: def.idx,
                    coeff: recipe.calories
                })
            });

            constraints.push({
                structIdx: structDefIdx,
                auxIdx: weeklyCaloriesDef.idx,
                coeff: recipe.calories
            })

            structDefIdx++;
        }
    })
})

loadProblem(lp, structDefs, [...mealSlotAuxDefs, ...dailyRecipeAuxDefs, ...maxTimeAuxDefs, ...dailyCaloriesDefs, weeklyCaloriesDef], constraints);

lp.simplexSync({});
lp.intoptSync({});

console.log();

let lastDay: Day | null  = null;
structDefs
    .sort((a, b) => slots.indexOf(a.slot) - slots.indexOf(b.slot))
    .sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day))
    .forEach(({name, idx, day}) => {
        if(lastDay === null || lastDay !== day) {
            console.log();
        }
        lastDay = day;

        if (lp.mipColVal(idx) === 1) {
            console.log(name);
        }
    });
console.log();

dailyCaloriesDefs.forEach(def => {
    console.log(`Calories eaten on ${def.day}: ${lp.mipRowVal(def.idx)}`)
});
const calories = lp.mipRowVal(weeklyCaloriesDef.idx);
console.log("Average Calories", calories / 7);
console.log();

maxTimeAuxDefs.forEach(def => {
    console.log(`Time Spent on ${def.day}: ${lp.mipRowVal(def.idx)}`)
})


// mealSlotAuxDefs.forEach(def =>
//     console.log(`${def.name}: expected ${def.min}-${def.max}, was ${lp.mipRowVal(def.idx)}`)
// )
//
// dailyRecipeAuxDefs.forEach(def =>
//     console.log(`${def.name}: expected ${def.min}-${def.max}, was ${lp.mipRowVal(def.idx)}`)
// )

console.log();
console.log(`Objective: ${lp.mipObjVal()}`);
console.log("Iterations: ", lp.getItCnt());

console.log("status:", lp.mipStatus());
// console.log("feasible:", lp.mipStatus() == glp.FEAS);
// console.log("optimal:", lp.mipStatus() == glp.OPT);
lp.delete();

