import glp, {BV} from "GLPK";
import {AuxVariableDefinition, loadAux, loadMatrix, loadStruct, StructVariableDefinition} from "./util";
import {meals, recipes} from "./data";

const lp = new glp.Problem();
lp.setProbName("sample");
lp.setObjDir(glp.MAX);

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
lp.simplex({},function(err){
    if (err){
        console.log(err);
        return;
    }
    const objective = lp.getObjVal();
    recipeStruct.forEach(({name}, idx) => {
        const used = lp.getColPrim(idx + 1);
        if(used === 1) {
            console.log(name);
        }
    })
    console.log(`Objective: ${objective}`);
    console.log("Iterations: ", lp.getItCnt());
    lp.delete();
});
