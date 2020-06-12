<script>
    import {tweened} from "svelte/motion";
    import {cubicInOut} from "svelte/easing";

    let a = tweened(0, {duration: 1000, easing: cubicInOut});
    let b = tweened(0, {duration: 1000, easing: cubicInOut});
    let c = tweened(0, {duration: 1000, easing: cubicInOut});
    let d = tweened(0, {duration: 1000, easing: cubicInOut});
    let e = tweened(0, {duration: 1000, easing: cubicInOut});

    const matrix = [
        [3, 0, 0, -1, 4],
        [1, -5, 0.5, 2, 0],
        [0, 0, 0, 1, 1],
        [0, 2, 1, 0.1, -3]
    ]

    const objective = [2, 3, -1, 2, 1.5];

    $: values = [$a, $b, $c, $d, $e];
    $: rowValues = matrix.map(row => row.map((coeff, idx) => coeff * values[idx]).reduce((a, b) => a + b, 0));
    $: objectiveValue = objective.map((coeff, idx) => coeff * values[idx]).reduce((a, b) => a + b, 0);
    $: mins = [35, -40, 2, 0];
    $: maxs = [45, -35, 4, 25];

    const lpSolutions = [
        [0, 6, -10, 0, -5],
        [0, 6, -10, 0, -0.666666666666667],
        [9.150943396226417, 7.830188679245284, -10, 0, 1.8867924528301891],
        [9.145985401459853, 7.864233576642336, -10, 0.0875912408759129, 1.9124087591240881],
        [9.058394160583942, 8.465693430656934, -10, 1.6350364963503652, 2.3649635036496344],
        [9.666666666666666, 8.733333333333333, -10, 2, 2],
        [10, 8.8, -10, 2, 1.75],
        [10, 9.8, -10, 2, 1.75],
        [10, 9.8, -10, 2, 2],
        [10, 10, -8, 2, 2]
    ]
    let solutionCount = 0;
    function stepSolution() {
        const newSolution = lpSolutions[solutionCount];
        solutionCount++;
        a.set(newSolution[0]);
        b.set(newSolution[1]);
        c.set(newSolution[2]);
        d.set(newSolution[3]);
        e.set(newSolution[4]);
    }
</script>

<style>
    .light {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid black;
        background-color: grey;
        margin: 4px;
    }

    .lit {
        background-color: orange;
    }

    .col {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    input {
        height: 20px;
        margin-top: 40px;
        margin-bottom: 40px;
        width: 100px;
    }

    .verticalSlider {
        transform: rotate(270deg);
    }

    .grid {
        display: grid;
        grid-template-columns: 100px 1fr 1fr 1fr 1fr 1fr 80px 80px 80px;
        grid-template-rows: auto repeat(10, 80px);
        justify-items: center;
        grid-gap: 12px;
        width: 800px;
        margin: auto;
    }
</style>

<button on:click={stepSolution}>Step</button>
<div class="grid">

    <div class="col" style="grid-column: 1; grid-row: 1">
        Variables
    </div>

    {#each matrix as _, yIdx}
        <div class="col" style={`grid-column: 1; grid-row: ${yIdx + 2}`}>
            Constraint {yIdx + 1}
        </div>
    {/each}

    <div class="col" style="grid-column: 1; grid-row: 6">
        Objective
    </div>

    <div style="grid-column: 7; grid-row: 1; margin-top: auto">Min</div>
    <div style="grid-column: 8; grid-row: 1; margin-top: auto">Total</div>
    <div style="grid-column: 9; grid-row: 1; margin-top: auto">Max</div>


    <div class="col" style="grid-column: 2; grid-row: 1; height: 150px; justify-content: flex-end">
        <div style={`background-color: grey; width: 50px; height: ${100*($a/10)}px`}></div>
        <div style="margin-top: 4px">a</div>
        <div style="margin-bottom: 20px; font-size: 18pt">{parseFloat($a.toFixed(3))}</div>
    </div>

    <div class="col" style="grid-column: 3; grid-row: 1; height: 150px; justify-content: flex-end">
        <div style={`background-color: grey; width: 50px; height: ${100*(($b-4)/16)}px`}></div>
        <div style="margin-top: 4px">b</div>
        <div style="margin-bottom: 20px; font-size: 18pt">{parseFloat($b.toFixed(3))}</div>
    </div>

    <div class="col" style="grid-column: 4; grid-row: 1; height: 150px; justify-content: flex-end">
        <div style={`background-color: grey; width: 50px; height: ${100*(($c+10)/25)}px`}></div>
        <div style="margin-top: 4px">c</div>
        <div style="margin-bottom: 20px; font-size: 18pt">{parseFloat($c.toFixed(3))}</div>
    </div>

    <div class="col" style="grid-column: 5; grid-row: 1; height: 150px; justify-content: flex-end">
        <div style={`background-color: grey; width: 50px; height: ${100*($d/2)}px`}></div>
        <div style="margin-top: 4px">d</div>
        <div style="margin-bottom: 20px; font-size: 18pt">{parseFloat($d.toFixed(3))}</div>
    </div>

    <div class="col" style="grid-column: 6; grid-row: 1; height: 150px; justify-content: flex-end">
        <div style={`background-color: grey; width: 50px; height: ${100*(($e+5)/10)}px`}></div>
        <div style="margin-top: 4px">e</div>
        <div style="margin-bottom: 20px; font-size: 18pt">{parseFloat($e.toFixed(3))}</div>
    </div>

    {#each matrix as row, yIdx}
        {#each row as coeff, xIdx}
            {#if coeff !== 0}
                <div class="col" style={`grid-column: ${xIdx + 2}; grid-row: ${yIdx + 2}`}>
                    <div>×{coeff}</div>
                    <div style="font-size: 18pt">{parseFloat((values[xIdx] * coeff).toFixed(2))}</div>
                </div>
            {/if}
        {/each}
    {/each}

    {#each objective as coeff, xIdx}
        {#if coeff !== 0}
            <div class="col" style={`grid-column: ${xIdx + 2}; grid-row: ${6}`}>
                <div>×{coeff}</div>
                <div style="font-size: 18pt">{parseFloat((values[xIdx] * coeff).toFixed(2))}</div>
            </div>
        {/if}
    {/each}

    {#each mins as min, yIdx}
        <div class="col" style={`grid-column: 7; grid-row: ${yIdx+2}`}>
            <div>{min}</div>
            <div class="light" class:lit={rowValues[yIdx] >= min}></div>
        </div>
    {/each}

    {#each matrix as row, yIdx}
        <div class="col" style={`grid-column: 8; grid-row: ${yIdx+2}; font-size: 18pt`}>
            {parseFloat(rowValues[yIdx].toFixed(2))}
        </div>
    {/each}

    <div class="col" style={`grid-column: 8; grid-row: 6; font-size: 18pt`}>
        {parseFloat(objectiveValue.toFixed(2))}
    </div>

    {#each maxs as max, yIdx}
        <div class="col" style={`grid-column: 9; grid-row: ${yIdx+2}`}>
            <div>{max}</div>
            <div class="light" class:lit={rowValues[yIdx] <= max}></div>
        </div>
    {/each}

</div>




