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
    defs.forEach((def, idx) => {
        lp.setRowName(idx + 1, def.name);
        if (def.min === undefined) {
            if (def.max === undefined) {
                lp.setRowBnds(idx + 1, FR, 0, 0);
            } else {
                lp.setRowBnds(idx + 1, UP, 0, def.max);
            }
        } else {
            if (def.max === undefined) {
                lp.setRowBnds(idx + 1, LO, def.min, 0);
            } else {
                if (def.min === def.max) {
                    lp.setRowBnds(idx + 1, FX, def.min, def.max);
                } else {
                    lp.setRowBnds(idx + 1, DB, def.min, def.max);
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
    defs.forEach((def, idx) => {
        lp.setColName(idx + 1, def.name);
        lp.setObjCoef(idx + 1, def.objectiveCoef);
        if (def.kind !== undefined) {
            lp.setColKind(idx + 1, def.kind);
        }
        if (def.min === undefined) {
            if (def.max === undefined) {
                lp.setColBnds(idx + 1, FR, 0, 0);
            } else {
                lp.setColBnds(idx + 1, UP, 0, def.max);
            }
        } else {
            if (def.max === undefined) {
                lp.setColBnds(idx + 1, LO, def.min, 0);
            } else {
                if (def.min === def.max) {
                    lp.setColBnds(idx + 1, FX, def.min, def.max);
                } else {
                    lp.setColBnds(idx + 1, DB, def.min, def.max);
                }
            }
        }
    })
}