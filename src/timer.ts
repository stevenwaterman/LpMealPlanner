import {performance} from "perf_hooks";

export function time(func: () => void) {
    const t1 = performance.now();
    func();
    const ms = performance.now() - t1;
    console.log(`Time: ${ms.toFixed(3)} ms`);
}