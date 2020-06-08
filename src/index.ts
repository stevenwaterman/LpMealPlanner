import glp, {BV} from "GLPK";
import {AuxVariableDefinition, loadAux, loadMatrix, loadStruct, StructVariableDefinition} from "./util";
import {meals, recipes} from "./data";

const lp = new glp.Problem();
lp.setProbName("sample");
lp.setObjDir(glp.MAX);
glp.termOutput(true);
lp.scaleSync(glp.SF_AUTO);

const recipeStruct: StructVariableDefinition[] = recipes.flatMap(recipe => meals.map(meal => ({
    name: `${recipe.name} for ${meal.day} ${meal.slot}`,
    kind: BV,
    objectiveCoef: 0
})));
loadStruct(lp, recipeStruct);

const mealAux: AuxVariableDefinition[] = meals.map(meal => ({
    name: `${meal.day} ${meal.slot}`,
    min: 1,
    max: 1
}));
loadAux(lp, mealAux);

const matrixRows: number[][] = meals.map((row, rowIdx) => recipeStruct.map((_, colIdx) => (colIdx % meals.length) === rowIdx ? 1 : 0));
loadMatrix(lp, matrixRows);

//solve simplex asynchronously
lp.simplexSync({
    presolve: glp.OFF
});
lp.intoptSync(null);

recipeStruct.forEach(({name}, idx) => {
    console.log(name, lp.getColPrim(idx + 1));
});
mealAux.forEach(({name}, idx) => {
    console.log(name, lp.getRowPrim(idx + 1));
})
console.log(`Objective: ${lp.getObjVal()}`);
console.log("Iterations: ", lp.getItCnt());

console.log("status:", lp.mipStatus());
console.log("feasible:", lp.mipStatus() == glp.FEAS);
console.log("optimal:", lp.mipStatus() == glp.OPT);
lp.delete();

