import glp from "GLPK";
import {Day, Recipe, Meal} from "./data";

export function loadProblem(lp: glp.Problem): void {
    loadStruct(lp);
    loadAux(lp);
    loadConstraints(lp);
}

type BaseVariable = {
    idx: number,
    name: string,
    min?: number,
    max?: number,
}

export type Constraint = BaseVariable & {
    sumComponents: [number, Variable][]
}

export type Variable = BaseVariable & {
    reward: number;
    kind?: glp.VARIABLE_KIND,
    meta: Meta
}

type Meta = {
    type: "eaten" | "portions",
    day: Day,
    meal: Meal,
    recipe: Recipe
}

type MetaInput = {
    type?: "eaten" | "portions",
    day: Day,
    meal: Meal,
    recipe: Recipe
}

let varIdx = 1;
let constIdx = 1;

export function nextVariableIdx(): number {
    const tmp = varIdx;
    varIdx++;
    return tmp;
}

export function nextConstraintIdx(): number {
    const tmp = constIdx;
    constIdx++;
    return tmp;
}

export const variables: Variable[] = [];
export const constraints: Constraint[] = [];

export function newVariable(name: string, meta: MetaInput, bounds: { min?: number, max?: number, allowDecimal: boolean }, reward: number = 0): Variable {
    const type: "eaten" | "portions" = meta.type ? meta.type : "eaten";
    const actualMeta: Meta = {
        type,
        day: meta.day,
        meal: meta.meal,
        recipe: meta.recipe
    }
    const variable: Variable = {
        idx: nextVariableIdx(),
        name,
        kind: bounds.allowDecimal ? glp.CV : glp.IV,
        min: bounds.min,
        max: bounds.max,
        reward: reward,
        meta: actualMeta
    };
    variables.push(variable);
    return variable;
}

export function newConstraint(name: string, bounds: { min?: number, max?: number }, coefficientGenerator: (meta: Variable["meta"]) => number | undefined): Constraint;

export function newConstraint(name: string, bounds: { min?: number, max?: number }, sumComponents: [number, Variable][]): Constraint;

export function newConstraint(name: string, bounds: {min?:number, max?:number}, arg3: [number, Variable][] | ((meta: Variable["meta"]) => number | undefined)): Constraint {
    if(arg3 instanceof Function) {
        const constraint: Constraint = {
            idx: nextConstraintIdx(),
            name,
            min: bounds.min,
            max: bounds.max,
            sumComponents: variables
                .map(variable => [arg3(variable.meta), variable] as [number, Variable])
                .filter(([a,_]) => !!a)
        }
        constraints.push(constraint);
        return constraint;
    } else {
        const constraint: Constraint = {
            idx: nextConstraintIdx(),
            name,
            min: bounds.min,
            max: bounds.max,
            sumComponents: arg3
        }
        constraints.push(constraint);
        return constraint;
    }
}

function loadAux(lp: glp.Problem) {
    if(constraints.length === 0) return;
    lp.addRows(constraints.length);
    constraints.forEach(({idx, max, min, name}) => {
        lp.setRowName(idx, name);
        if (min === undefined) {
            if (max === undefined) {
                lp.setRowBnds(idx, glp.FR, 0, 0);
            } else {
                lp.setRowBnds(idx, glp.UP, 0, max);
            }
        } else {
            if (max === undefined) {
                lp.setRowBnds(idx, glp.LO, min, 0);
            } else {
                if (min === max) {
                    lp.setRowBnds(idx, glp.FX, min, max);
                } else {
                    lp.setRowBnds(idx, glp.DB, min, max);
                }
            }
        }
    })
}

function loadStruct(lp: glp.Problem) {
    if(variables.length === 0) return;
    lp.addCols(variables.length);
    variables.forEach(({idx, kind, max, min, name, reward}) => {
        lp.setColName(idx, name);
        lp.setObjCoef(idx, reward);
        if (kind !== undefined) {
            lp.setColKind(idx, kind);
        }
        if (min === undefined) {
            if (max === undefined) {
                lp.setColBnds(idx, glp.BV, 0, 0);
            } else {
                lp.setColBnds(idx, glp.UP, 0, max);
            }
        } else {
            if (max === undefined) {
                lp.setColBnds(idx, glp.LO, min, 0);
            } else {
                if (min === max) {
                    lp.setColBnds(idx, glp.FX, min, max);
                } else {
                    lp.setColBnds(idx, glp.DB, min, max);
                }
            }
        }
    })
}

export function loadConstraints(lp: glp.Problem): void {
    const matrixEntries: { struct: number; aux: number; coeff: number }[] = constraints.flatMap(aux => aux.sumComponents.map(([coeff, struct]) => ({
        aux: aux.idx,
        struct: struct.idx,
        coeff
    })));

    const arraySize = matrixEntries.length + 1;
    const structArray = new Int32Array(arraySize);
    const auxArray = new Int32Array(arraySize);
    const coefficientsArray = new Float64Array(arraySize);

    matrixEntries.forEach(({struct, aux, coeff}, idx) => {
        structArray[idx + 1] = struct;
        auxArray[idx + 1] = aux;
        coefficientsArray[idx + 1] = coeff;
    })

    lp.loadMatrix(arraySize - 1, auxArray, structArray, coefficientsArray);
}

export function product<A extends any[], B extends any[]>(collection1: A, collection2: B, collection3?: undefined): Array<[A[number], B[number]]>;
export function product<A extends any[], B extends any[], C extends any[]>(collection1: A, collection2: B, collection3: C): Array<[A[number], B[number], C[number]]>;
export function product<A extends any[], B extends any[], C extends any[] | undefined>(collection1: A, collection2: B, collection3: C): any {
    if (collection3 !== undefined) {
        let output: Array<[any, any, any]> = [];
        for(let a of collection1) {
            for (let b of collection2) {
                for(let c of collection3 as any[]) {
                    output.push([a, b, c]);
                }
            }
        }
        return output;
    } else {
        let output: Array<[any, any]> = [];
        for(let a of collection1) {
            for (let b of collection2) {
                output.push([a, b]);
            }
        }
        return output;
    }
}