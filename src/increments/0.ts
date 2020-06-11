import glp from "GLPK";
import {loadProblem, newConstraint, newVariable,} from "../util";
import {days, slots} from "../data";
import {printTable} from "../print";
import {caloriesMax, caloriesMin, maxTime, mealRequired, recipes} from "../inputs";
import {time} from "../timer";

const lp = new glp.Problem();
lp.setProbName("Meal Planning");


// Set up LP here


time(() => loadProblem(lp))
time(() => {
    lp.simplexSync({});
    lp.intoptSync({});
})

printTable(lp);
lp.delete();

