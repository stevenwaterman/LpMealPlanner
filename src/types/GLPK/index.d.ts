declare module "GLPK" {
    /* enable/disable flag: enable */
    export const ON: 1;
    /* enable/disable flag: disable */
    export const OFF: 0;
    /* enable/disable flag */
    export type ENABLE_FLAG = typeof ON | typeof OFF;

    /* optimisation direction flag: Minimization */
    export const MIN: 1;
    /* optimisation direction flag: Maximization */
    export const MAX: 2;
    /* optimisation direction flag */
    export type OPTIMISATION_DIRECTION = typeof MIN | typeof MAX;

    /* kind of structural variable: continuous variable */
    export const CV = 1;
    /* kind of structural variable: integer variable */
    export const IV: 2;
    /* kind of structural variable: binary variable */
    export const BV: 3;
    /* kind of structural variable */
    export type VARIABLE_KIND = typeof CV | typeof IV | typeof BV;

    /* type of auxiliary/structural variable: free (unbounded) variable */
    export const FR: 1;
    /* type of auxiliary/structural variable: variable with lower bound */
    export const LO: 2;
    /* type of auxiliary/structural variable: variable with upper bound */
    export const UP: 3;
    /* type of auxiliary/structural variable: double-bounded variable */
    export const DB: 4;
    /* type of auxiliary/structural variable: fixed variable */
    export const FX: 5;
    /* type of auxiliary/structural variable */
    export type VARIABLE_BOUNDS_TYPE = typeof FR | typeof LO | typeof UP | typeof DB | typeof FX;

    /* scaling options: perform geometric mean scaling */
    export const SF_GM: 0x01;
    /* scaling options: perform equilibration scaling */
    export const SF_EQ: 0x10;
    /* scaling options: round scale factors to power of two */
    export const SF_2N: 0x20;
    /* scaling options: skip if problem is well scaled */
    export const SF_SKIP: 0x40;
    /* scaling options: choose scaling options automatically */
    export const SF_AUTO: 0x80;
    /* scaling options */
    export type SCALING_OPTIONS = typeof SF_GM | typeof SF_EQ | typeof SF_2N | typeof SF_SKIP | typeof SF_AUTO;

    /* solution indicator: basic solution */
    export const SOL: 1;
    /* solution indicator: interior-point solution */
    export const IPT: 2;
    /* solution indicator: mixed integer solution */
    export const MIP: 3;
    /* solution indiciator */
    export type SOLUTION_INDICATOR = typeof SOL | typeof IPT | typeof MIP;

    /* message level: no output */
    export const MSG_OFF: 0;
    /* message level: warning and error messages only */
    export const MSG_ERR: 1;
    /* message level: normal output */
    export const MSG_ON: 2;
    /* message level: full output */
    export const MSG_ALL: 3;
    /* message level: debug output */
    export const MSG_DBG: 4;
    /* message level */
    export type MSG_LVL = typeof MSG_OFF | typeof MSG_ERR | typeof MSG_ON | typeof MSG_ALL | typeof MSG_DBG;

    /* simplex method option: use primal simplex */
    export const PRIMAL: 1;
    /* simplex method option: use dual; if it fails, use primal */
    export const DUALP: 2;
    /* simplex method option: use dual simplex */
    export const DUAL: 3;
    /* simplex method option */
    export type SIMPLEX_METHOD = typeof PRIMAL | typeof DUALP | typeof DUAL;

    /* pricing technique: standard (Dantzig's rule) */
    export const PT_STD: 0x11;
    /* pricing technique: projected steepest edge */
    export const PT_PSE: 0x22;
    /* pricing technique */
    export type PRICING = typeof PT_STD | typeof PT_PSE;

    /* ratio test technique: standard (textbook) */
    export const RT_STD: 0x11;
    /* ratio test technique: Harris' two-pass ratio test */
    export const RT_HAR: 0x22;
    /* ratio test technique */
    export type RATIO_TEST = typeof RT_STD | typeof RT_HAR;

    /* reason codes: request for row generation */
    export const IROWGEN: 0x01;
    /* reason codes: better integer solution found */
    export const IBINGO: 0x02;
    /* reason codes: request for heuristic solution */
    export const IHEUR: 0x03;
    /* reason codes: request for cut generation */
    export const ICUTGEN: 0x04;
    /* reason codes: request for branching */
    export const IBRANCH: 0x05;
    /* reason codes: request for subproblem selection */
    export const ISELECT: 0x06;
    /* reason codes: request for preprocessing */
    export const IPREPRO: 0x07;
    /* reason codes */
    export type REASON_CODE = typeof IROWGEN | typeof IBINGO | typeof IHEUR | typeof ICUTGEN | typeof IBRANCH | typeof ISELECT | typeof IPREPRO;

    /* reason codes (float): request for row generation */
    export const FROWGEN: 2;
    /* reason codes (float): better integer solution found */
    export const FBINGO: 4;
    /* reason codes (float): request for heuristic solution */
    export const FHEUR: 8;
    /* reason codes (float): request for cut generation */
    export const FCUTGEN: 16;
    /* reason codes (float): request for branching */
    export const FBRANCH: 32;
    /* reason codes (float): request for subproblem selection */
    export const FSELECT: 64;
    /* reason codes (float): request for preprocessing */
    export const FPREPRO: 128;
    /* reason codes (float) */
    export type REASON_CODE_F = typeof FROWGEN | typeof FBINGO | typeof FHEUR | typeof FCUTGEN | typeof FBRANCH | typeof FSELECT | typeof FPREPRO;

    /* MPS file format: fixed (ancient) */
    export const MPS_DECK: 1;
    /* MPS file format: free (modern) */
    export const MPS_FILE: 2;
    /* MPS file format */
    export type MPS_FILE_FORMAT = typeof MPS_DECK | typeof MPS_FILE;

    export function termOutput(enabled: boolean): void;

    export class Problem {
        readLp(path: string, callback: (err: string | undefined, ret: number) => void): void;

        readLpSync(path: string): void;

        readMps(format: MPS_FILE_FORMAT, arg2: null, path: string, callback: (err: string | undefined, ret: number) => void): void;

        scale(scaling: SCALING_OPTIONS, callback: (err: string | undefined) => void): void;

        scaleSync(scaling: SCALING_OPTIONS): void;

        simplex(option: {
            msgLev?: MSG_LVL;
            meth?: SIMPLEX_METHOD;
            pricing?: PRICING;
            rTest?: RATIO_TEST;
            presolve?: ENABLE_FLAG;
        }, callback: (err: string | undefined, ret: number) => void): void;

        simplexSync(options: {
            msgLev?: MSG_LVL;
            meth?: SIMPLEX_METHOD;
            pricing?: PRICING;
            rTest?: RATIO_TEST;
            presolve?: ENABLE_FLAG;
        }): void;

        getNumInt(): number;

        intopt(options: {
            cbFunc: (tree: Tree) => void;
            cbReasons?: REASON_CODE_F
        }, callback: (err: string | undefined, ret: number) => void): void;

        intoptSync(options: {
            cbFunc: (tree: Tree) => void
        }): void;

        mipObjVal(): number;

        delete(): void;

        interior(arg1: null, callback: (err: string | undefined) => void): void;

        printIpt(path: string, callback: (err: string | undefined) => void): void;

        getObjVal(): number;

        setProbName(name: string): void;

        setObjDir(optimiseFor: OPTIMISATION_DIRECTION): void;

        addRows(count: number): void;

        setRowName(idx: number, name: string): void;

        setRowBnds(idx: number, arg2: VARIABLE_BOUNDS_TYPE, min: number, max: number): void;

        addCols(count: number): void;

        setColName(idx: number, name: string): void;

        setColBnds(idx: number, arg2: VARIABLE_BOUNDS_TYPE, min: number, max: number): void;

        setObjCoef(idx: number, coef: number): void;

        loadMatrix(length: number, ia: Int32Array, ja: Int32Array, ar: Float64Array): void;

        getColPrim(idx: number): number;

        getItCnt(): number;
    }

    export class Mathprog {
        delete(): void;

        getLastError(): string | undefined;

        getLine(): number;

        postsolve(lp: Problem, kind: typeof SOL | typeof MIP, callback: (err: string | undefined, ret: number) => void): void;

        readModel(path: string, arg2: ENABLE_FLAG, callback: (err: string | undefined, ret: number) => void): void;

        generate(arg1: null, callback: (err: string | undefined, ret: number) => void): void;

        buildProb(lp: Problem, callback: (err: string | undefined, ret: number) => void): void;
    }

    export class Tree {
        reason(): REASON_CODE;

        terminate(): void;
    }
}