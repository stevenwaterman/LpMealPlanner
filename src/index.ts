import glp, {BV} from "GLPK";
import {
    AuxVariableDefinition,
    Constraint,
    loadProblem,
    StructVariableDefinition
} from "./util";
import {Day, days, meals, recipes, Slot, slotRequirements} from "./data";

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

const auxDefs: MealSlotAuxDef[] = [];
const structDefs: StructVariableDefinition[] = [];
const constraints: Constraint[] = [];

meals.forEach((meal, idx) => {
    const required = slotRequirements[meal.slot].required;
    const min = required ? 1 : 0;
    auxDefs.push({
        idx: idx + 1,
        name: `${meal.day} ${meal.slot}`,
        min,
        max: 1,
        _brand: "MealSlotAuxDef",
        day: meal.day,
        slot: meal.slot
    });
})

recipes.forEach((recipe, idx) => {
    days.forEach(day => {
        recipe.allowedMeals.forEach(slot => {
            structDefs.push({
                idx: idx + 1,
                name: `${recipe.name} for ${day} ${slot}`,
                kind: BV,
                objectiveCoef: 0
            });

            auxDefs.filter(def => def.day === day && def.slot === slot).forEach(def => {
                constraints.push({
                    structIdx: idx + 1,
                    auxIdx: def.idx,
                    coeff: 1
                })
            })
        })
    });
})

loadProblem(lp, structDefs, auxDefs, constraints);

lp.simplexSync({
    presolve: glp.OFF
});
lp.intoptSync(null);

console.log();

structDefs.forEach(({name, idx}) => {
    const used = lp.getColPrim(idx);
    if(used === 1){
        console.log(name);
    }
});

console.log();
console.log(`Objective: ${lp.getObjVal()}`);
console.log("Iterations: ", lp.getItCnt());

console.log("status:", lp.mipStatus());
console.log("feasible:", lp.mipStatus() == glp.FEAS);
console.log("optimal:", lp.mipStatus() == glp.OPT);
lp.delete();

