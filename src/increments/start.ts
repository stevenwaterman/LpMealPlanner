import glp from "GLPK";
import {loadProblem, newVariable, product,} from "../util";
import {printTable} from "../print";
import {time} from "../timer";
import {days, meals} from "../data";
import {recipes} from "../inputs";

const lp = new glp.Problem();
lp.setProbName("Meal Planning");



time(() => loadProblem(lp))
time(() => {
    lp.simplexSync({});
    lp.intoptSync({});
})

printTable(lp);
lp.delete();

