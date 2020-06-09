import {DB, FR, FX, LO, Problem, UP, VARIABLE_KIND} from "GLPK";

export type Constraint = {
    structIdx: number;
    auxIdx: number;
    coeff: number;
}

export function loadProblem(lp: Problem, structDefs: StructVariableDefinition[], auxDefs: AuxVariableDefinition[], constraints: Constraint[]): void {
    loadStruct(lp, structDefs);
    loadAux(lp, auxDefs);
    loadConstraints(lp, constraints);
}

export function loadConstraints(lp: Problem, constraints: Constraint[]): void {
    const arraySize = constraints.length + 1;

    const structArray = new Int32Array(arraySize);
    const auxArray = new Int32Array(arraySize);
    const coefficientsArray = new Float64Array(arraySize);

    constraints.forEach(({structIdx, auxIdx, coeff}, idx) => {
        structArray[idx + 1] = structIdx;
        auxArray[idx + 1] = auxIdx;
        coefficientsArray[idx + 1] = coeff;
    })

    lp.loadMatrix(arraySize - 1, auxArray, structArray, coefficientsArray);
}

export type AuxVariableDefinition = {
    idx: number,
    name: string,
    min?: number,
    max?: number
}

function loadAux(lp: Problem, defs: AuxVariableDefinition[]) {
    lp.addRows(defs.length);
    defs.forEach(({idx, max, min, name}) => {
        lp.setRowName(idx, name);
        if (min === undefined) {
            if (max === undefined) {
                lp.setRowBnds(idx, FR, 0, 0);
            } else {
                lp.setRowBnds(idx, UP, 0, max);
            }
        } else {
            if (max === undefined) {
                lp.setRowBnds(idx, LO, min, 0);
            } else {
                if (min === max) {
                    lp.setRowBnds(idx, FX, min, max);
                } else {
                    lp.setRowBnds(idx, DB, min, max);
                }
            }
        }
    })
}

export type StructVariableDefinition = AuxVariableDefinition & {
    objectiveCoef: number;
    kind?: VARIABLE_KIND
}

function loadStruct(lp: Problem, defs: StructVariableDefinition[]) {
    lp.addCols(defs.length);
    defs.forEach(({idx, kind, max, min, name, objectiveCoef}) => {
        lp.setColName(idx, name);
        lp.setObjCoef(idx, objectiveCoef);
        if (kind !== undefined) {
            lp.setColKind(idx, kind);
        }
        if (min === undefined) {
            if (max === undefined) {
                lp.setColBnds(idx, FR, 0, 0);
            } else {
                lp.setColBnds(idx, UP, 0, max);
            }
        } else {
            if (max === undefined) {
                lp.setColBnds(idx, LO, min, 0);
            } else {
                if (min === max) {
                    lp.setColBnds(idx, FX, min, max);
                } else {
                    lp.setColBnds(idx, DB, min, max);
                }
            }
        }
    })
}