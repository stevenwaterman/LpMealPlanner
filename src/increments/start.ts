import glp from "GLPK";
import {loadProblem} from "../util";
import {printTable} from "../print";
import {time} from "../timer";

const lp = new glp.Problem();
lp.setProbName("Meal Planning");



time(() => loadProblem(lp))
time(() => {
    lp.simplexSync({});
    lp.intoptSync({});
})

printTable(lp);
lp.delete();

