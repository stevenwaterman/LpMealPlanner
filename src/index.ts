import glp, {FBINGO, FBRANCH, FCUTGEN, FHEUR, FPREPRO, FSELECT, MSG_ALL, MSG_DBG, MSG_OFF, Tree} from "GLPK";
import {loadProblem, newConstraint, newVariable} from "./util";
import {time} from "./timer";

const lp = new glp.Problem();
lp.setProbName("Meal Planning");
glp.termOutput(true);

const a = newVariable("a", {} as any, {min: 0, max: 10, allowDecimal: false}, 2);
const b = newVariable("b", {} as any, {min: 4, max: 20, allowDecimal: false}, 3);
const c = newVariable("c", {} as any, {min: -10, max: 15, allowDecimal: false}, -1);
const d = newVariable("d", {} as any, {min: 0, max: 2, allowDecimal: true}, 2);
const e = newVariable("e", {} as any, {min: -5, max: 5, allowDecimal: true}, 1.5);

newConstraint("1", {min: 35, max: 45}, [
    [3, a],
    [-1, d],
    [4, e]
])

newConstraint("2", {min: -40, max: -35}, [
    [1, a],
    [-5, b],
    [0.5, c],
    [2, d]
]);

newConstraint("3", {min: 2, max: 4}, [
    [1, d],
    [1, e]
])

newConstraint("4", {min: 0, max: 25}, [
    [2, b],
    [1, c],
    [0.1, d],
    [-3, e]
])

lp.setObjDir(glp.MAX);

time(() => loadProblem(lp))
time(() => {
    console.log("a", lp.getColPrim(a.idx));
    console.log("b", lp.getColPrim(b.idx));
    console.log("c", lp.getColPrim(c.idx));
    console.log("d", lp.getColPrim(d.idx));
    console.log("e", lp.getColPrim(e.idx));

    console.log("objective", lp.getObjVal());
    console.log()
    console.log();

    for(let i = 0; i < 10; i++){
        // @ts-ignore
        lp.simplexSync({msgLev: MSG_OFF, outFrq: 1, itLim: 1});
        console.log("a", lp.getColPrim(a.idx));
        console.log("b", lp.getColPrim(b.idx));
        console.log("c", lp.getColPrim(c.idx));
        console.log("d", lp.getColPrim(d.idx));
        console.log("e", lp.getColPrim(e.idx));

        console.log("objective", lp.getObjVal());
        console.log()
        console.log()
    }


    function callback(tree: Tree){
        console.log("a", lp.mipColVal(a.idx));
        console.log("b", lp.mipColVal(b.idx));
        console.log("c", lp.mipColVal(c.idx));
        console.log("d", lp.mipColVal(d.idx));
        console.log("e", lp.mipColVal(e.idx));

        console.log("objective", lp.mipObjVal());
        console.log()
        console.log()
    }
    lp.intopt({cbFunc: callback, cbReasons: glp.FBINGO + glp.FHEUR + glp.FCUTGEN + glp.FBRANCH + glp.FSELECT + FPREPRO, msgLev: MSG_DBG}, function(err, ret){
        if (err)
            console.log(err);
        else
            console.log("objective: " + lp.mipObjVal())
        lp.delete();
    });
})


