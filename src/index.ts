import glp from "GLPK";
import {AuxVariableDefinition, Constraint, loadProblem, StructVariableDefinition} from "./util";
import {Day, days, maxTime, meals, nutritionRequirements, previousDay, Recipe, recipes, Slot, slots} from "./data";
import {table} from "table";

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

type UnlockedAuxDef = AuxVariableDefinition & {
    day: Day,
    slot: Slot,
    recipe: Recipe
}

type RecipeInSlotStructDef = StructVariableDefinition & {
    _brand: "RecipeInSlotStructDef",
    recipe: Recipe,
    day: Day,
    slot: Slot
}

type LockStructDef = StructVariableDefinition & {
    _brand: "LockStructDef",
    day: Day,
    slot: Slot,
    recipe: Recipe
}

const mealSlotAuxDefs: MealSlotAuxDef[] = [];
const dailyRecipeAuxDefs: DailyRecipeAuxDef[] = [];
const maxTimeAuxDefs: MaxTimeAuxDef[] = [];
const dailyCaloriesDefs: DailyCaloriesDef[] = [];
const unlockedAuxDefs: UnlockedAuxDef[] = [];

const recipeStructDefs: RecipeInSlotStructDef[] = [];
const lockStructDefs: LockStructDef[] = []
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
            recipeStructDefs.push({
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

            if (day !== "MON") {
                lockStructDefs.push({
                    _brand: "LockStructDef",
                    day,
                    recipe,
                    slot,
                    idx: structDefIdx,
                    name: `Unlocked ability to have ${recipe.name} on ${day} ${slot}`,
                    objectiveCoef: -1,
                    min: 0,
                    max: 1,
                    kind: glp.BV
                });

                unlockedAuxDefs.push({
                    day,
                    idx: auxDefIdx,
                    name: `Illegal lock setup on ${day} ${slot} (${recipe.name})`,
                    recipe,
                    slot,
                    max: 1
                })


                // Subtract 2 if unlocked
                constraints.push({
                    structIdx: structDefIdx,
                    auxIdx: auxDefIdx,
                    coeff: -1
                });

                // Add 1 if we had it today
                constraints.push({
                    structIdx: structDefIdx - 1,
                    auxIdx: auxDefIdx,
                    coeff: 1
                })

                // Add 1 if we had it yesterday
                slots.forEach(slot => {
                    const yesterday = previousDay(day);
                    if (yesterday !== undefined) {
                        const yesterdayStruct: RecipeInSlotStructDef | undefined = recipeStructDefs.find(def => def.day === yesterday && def.slot === slot && def.recipe === recipe);
                        if (yesterdayStruct !== undefined) {
                            constraints.push({
                                structIdx: yesterdayStruct.idx,
                                auxIdx: auxDefIdx,
                                coeff: 1
                            })
                        }
                    }
                })

                auxDefIdx++;
                structDefIdx++;
            }


        }
    })
})

loadProblem(lp, [...recipeStructDefs, ...lockStructDefs], [...mealSlotAuxDefs, ...dailyRecipeAuxDefs, ...maxTimeAuxDefs, ...dailyCaloriesDefs, weeklyCaloriesDef, ...unlockedAuxDefs], constraints);

lp.simplexSync({});
lp.intoptSync({});

const tableData: string[][] = [
    ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", ""],
    ["Breakfast", "", "", "", "", "", "", "", ""],
    ["Lunch", "", "", "", "", "", "", "", ""],
    ["Starter", "", "", "", "", "", "", "", ""],
    ["Dinner", "", "", "", "", "", "", "", ""],
    ["Dessert", "", "", "", "", "", "", "", ""],
    ["Calories", "", "", "", "", "", "", "", ""],
    ["Time Spent", "", "", "", "", "", "", "", ""]
]
slots.forEach((slot, yIdx) => {
    days.forEach((day, xIdx) => {
        const foundDef = recipeStructDefs
            .filter(def => def.slot === slot && def.day === day)
            .find(def => lp.mipColVal(def.idx) === 1)
        if (foundDef !== undefined) {
            tableData[yIdx + 1][xIdx + 1] = foundDef.recipe.name
        }
    })
});
dailyCaloriesDefs.forEach(def => {
    const cal = lp.mipRowVal(def.idx);
    const idx = days.indexOf(def.day) + 1;
    tableData[6][idx] = cal.toString();
})
tableData[6][8] = `Average: ${(lp.mipRowVal(weeklyCaloriesDef.idx)/7).toFixed()}`;

maxTimeAuxDefs.forEach(def => {
    const time = lp.mipRowVal(def.idx);
    const idx = days.indexOf(def.day) + 1;
    tableData[7][idx] = time.toString();
})
console.log(table(tableData));
console.log();
console.log(`Objective: ${lp.mipObjVal()}`);
console.log("Iterations: ", lp.getItCnt());

console.log("status:", lp.mipStatus());
// console.log("feasible:", lp.mipStatus() == glp.FEAS);
// console.log("optimal:", lp.mipStatus() == glp.OPT);
lp.delete();

