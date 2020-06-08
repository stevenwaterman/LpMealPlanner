import glp from "GLPK";
import {loadAux, loadMatrix, loadStruct} from "./util";

const lp = new glp.Problem();
lp.setProbName("sample");
lp.setObjDir(glp.MAX);

loadStruct(lp, [
    {name: "x1", min: 0, objectiveCoef: 10},
    {name: "x2", min: 0, objectiveCoef: 6},
    {name: "x3", min: 0, objectiveCoef: 4}
]);

loadAux(lp, [
    {name: "p", max: 100},
    {name: "q", max: 600},
    {name: "r", max: 300}
]);

loadMatrix(lp, [
    [1, 1, 1],
    [10, 4, 5],
    [2, 2, 6]
]);

//solve simplex asynchronously
lp.simplex({},function(err){
    if (err){
        console.log(err);
        return;
    }
    const objective = lp.getObjVal();
    const x1 = lp.getColPrim(1);
    const x2 = lp.getColPrim(2);
    const x3 = lp.getColPrim(3);

    console.log(`Objective: ${objective}`, `x1: ${x1}`, `x2: ${x2}`, `x3: ${x3}`);
    console.log("Iterations: ", lp.getItCnt());
    lp.delete();
});
