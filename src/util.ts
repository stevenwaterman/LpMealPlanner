import {DB, FR, FX, LO, Problem, UP, VARIABLE_KIND} from "GLPK";

type Row<T> = T[]
type Matrix<T> = Row<T>[];

export function loadMatrix(lp: Problem, coeffMatrix: Matrix<number>): void {
    const width = coeffMatrix.length
    const arraySize = width * width + 1;
    const rowArray = new Int32Array(arraySize);
    const colArray = new Int32Array(arraySize);
    const coefficientsArray = new Float64Array(arraySize);
    let idx = 1;
    coeffMatrix.forEach((row: Row<number>, rowIdx: number) =>
        row.forEach((coef: number, colIdx: number) => {
            rowArray[idx] = rowIdx + 1;
            colArray[idx] = colIdx + 1;
            coefficientsArray[idx] = coef;
            idx++;
        }))
    lp.loadMatrix(arraySize - 1, rowArray, colArray, coefficientsArray);
}

export type AuxVariableDefinition = {
    name: string,
    min?: number,
    max?: number
}

export function loadAux(lp: Problem, defs: AuxVariableDefinition[]) {
    lp.addRows(defs.length);
    defs.forEach((def, idx) => {
        lp.setRowName(idx + 1, def.name);
        if(def.min === undefined) {
            if(def.max === undefined) {
                lp.setRowBnds(idx + 1, FR, 0, 0);
            } else {
                lp.setRowBnds(idx + 1, UP, 0, def.max);
            }
        } else {
            if(def.max === undefined) {
                lp.setRowBnds(idx + 1, LO, def.min, 0);
            } else {
                if(def.min === def.max) {
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

export function loadStruct(lp: Problem, defs: StructVariableDefinition[]) {
    lp.addCols(defs.length);
    defs.forEach((def, idx) => {
        lp.setColName(idx + 1, def.name);
        lp.setObjCoef(idx + 1, def.objectiveCoef);
        if(def.kind) {
            lp.setColKind(idx + 1, def.kind);
        }
        if(def.min === undefined) {
            if(def.max === undefined) {
                lp.setColBnds(idx + 1, FR, 0, 0);
            } else {
                lp.setColBnds(idx + 1, UP, 0, def.max);
            }
        } else {
            if(def.max === undefined) {
                lp.setColBnds(idx + 1, LO, def.min, 0);
            } else {
                if(def.min === def.max) {
                    lp.setColBnds(idx + 1, FX, def.min, def.max);
                } else {
                    lp.setColBnds(idx + 1, DB, def.min, def.max);
                }
            }
        }
    })
}