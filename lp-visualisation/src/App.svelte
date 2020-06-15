<script>
    let a = 0;
    let b = 4;
    let c = 0;
    let d = 0;
    let e = 0;

    const matrix = [
        [3, 0, 0, -1, 4],
        [1, -5, 0.5, 2, 0],
        [0, 0, 0, 1, 1],
        [0, 2, 1, 0.1, -3]
    ]

    const objective = [2, 3, -1, 2, 1.5];

    $: values = [a, b, c, d, e];
    $: rowValues = matrix.map(row => row.map((coeff, idx) => coeff * values[idx]).reduce((a, b) => a + b, 0));
    $: objectiveValue = objective.map((coeff, idx) => coeff * values[idx]).reduce((a, b) => a + b, 0);
    $: mins = [35, -40, 2, 0];
    $: maxs = [45, -35, 4, 25];
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
        grid-template-columns: 120px 1fr 1fr 1fr 1fr 1fr 80px 80px 80px;
        grid-template-rows: auto repeat(10, 80px);
        justify-items: center;
        grid-gap: 12px;
        width: 1000px;
        margin: auto;
    }
</style>

<div class="grid">
    <div class="col" style="grid-column: 1; grid-row: 1; font-size: 16pt">
        Variables
    </div>

    {#each matrix as _, yIdx}
        <div class="col" style={`grid-column: 1; grid-row: ${yIdx + 2}`}>
            Constraint {yIdx + 1}
        </div>
    {/each}

    <div class="col" style="grid-column: 1; grid-row: 6; font-size: 16pt">
        Objective
    </div>

    <div style="grid-column: 7; grid-row: 1; margin-top: auto">Min</div>
    <div style="grid-column: 8; grid-row: 1; margin-top: auto">Total</div>
    <div style="grid-column: 9; grid-row: 1; margin-top: auto">Max</div>


    <div class="col" style="grid-column: 2; grid-row: 1">
        <div>10</div>
        <input class="verticalSlider" type="range" min="0" max="10" bind:value={a}/>
        <div>0</div>
        <div style="margin-top: 4px">a</div>
        <div style="margin-bottom: 20px; font-size: 24pt">{parseFloat(a.toFixed(3))}</div>
    </div>

    <div class="col" style="grid-column: 3; grid-row: 1">
        <div>20</div>
        <input class="verticalSlider" type="range" min="4" max="20" bind:value={b}/>
        <div>4</div>
        <div style="margin-top: 4px">b</div>
        <div style="margin-bottom: 20px; font-size: 24pt">{parseFloat(b.toFixed(3))}</div>
    </div>

    <div class="col" style="grid-column: 4; grid-row: 1">
        <div>15</div>
        <input class="verticalSlider" type="range" min="-10" max="15" bind:value={c}/>
        <div>-10</div>
        <div style="margin-top: 4px">c</div>
        <div style="margin-bottom: 20px; font-size: 24pt">{parseFloat(c.toFixed(3))}</div>
    </div>

    <div class="col" style="grid-column: 5; grid-row: 1">
        <div>2</div>
        <input class="verticalSlider" type="range" min="0" max="2" step="0.001" bind:value={d}/>
        <div>0</div>
        <div style="margin-top: 4px">d</div>
        <div style="margin-bottom: 20px; font-size: 24pt">{parseFloat(d.toFixed(3))}</div>
    </div>

    <div class="col" style="grid-column: 6; grid-row: 1">
        <div>5</div>
        <input class="verticalSlider" type="range" min="-5" max="5" step="0.001" bind:value={e}/>
        <div>-5</div>
        <div style="margin-top: 4px">e</div>
        <div style="margin-bottom: 20px; font-size: 24pt">{parseFloat(e.toFixed(3))}</div>
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
        <div class="col" style={`grid-column: 8; grid-row: ${yIdx+2}; font-size: 24pt`}>
            {parseFloat(rowValues[yIdx].toFixed(2))}
        </div>
    {/each}

    <div class="col" style={`grid-column: 8; grid-row: 6; font-size: 32pt`}>
        {parseFloat(objectiveValue.toFixed(2))}
    </div>

    {#each maxs as max, yIdx}
        <div class="col" style={`grid-column: 9; grid-row: ${yIdx+2}`}>
            <div>{max}</div>
            <div class="light" class:lit={rowValues[yIdx] <= max}></div>
        </div>
    {/each}

    <div style="grid-row: 2; grid-column: 1 / span 9; border: 1px solid black; width: 100%"></div>
    <div style="grid-row: 3; grid-column: 1 / span 9; border: 1px solid black; width: 100%"></div>
    <div style="grid-row: 4; grid-column: 1 / span 9; border: 1px solid black; width: 100%"></div>
    <div style="grid-row: 5; grid-column: 1 / span 9; border: 1px solid black; width: 100%"></div>
    <div style="grid-row: 6; grid-column: 1 / span 9; border: 1px solid black; width: 100%"></div>

</div>




