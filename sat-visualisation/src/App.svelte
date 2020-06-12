<script>
    let a = false;
    let b = false;
    let c = false;
    let d = false;
    let e = false;

    // true if a c d
    // true if b c

    $: clause1 = a || b || e;
    $: clause2 = !a || c || e;
    $: clause3 = b || !c || d;
    $: clause4 = !e || !d;
    $: clause5 = !a || !b;
    $: clause6 = a || !e;
    $: clause7 = !b || c || e;

    $: allClauses = clause1 && clause2 && clause3 && clause4 && clause5 && clause6 && clause7;
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
</style>

<div class="col">
    <div class="row">
        <div class="col">
            <div class="light" class:lit={a}></div>
            <button on:click="{() => {a = !a}}">a</button>
        </div>

        <div class="col">
            <div class="light" class:lit={b}></div>
            <button on:click="{() => {b = !b}}">b</button>
        </div>

        <div class="col">
            <div class="light" class:lit={c}></div>
            <button on:click="{() => {c = !c}}">c</button>
        </div>

        <div class="col">
            <div class="light" class:lit={d}></div>
            <button on:click="{() => {d = !d}}">d</button>
        </div>

        <div class="col">
            <div class="light" class:lit={e}></div>
            <button on:click="{() => {e = !e}}">e</button>
        </div>
    </div>

    <div class="col" style="align-items: flex-end; margin-top: 12px;">
        <div class="row">
            <div>a || b || e</div>
            <div class="light" class:lit={clause1}></div>
        </div>

        <div class="row">
            <div>!a || c || e</div>
            <div class="light" class:lit={clause2}></div>
        </div>

        <div class="row">
            <div>b || !c || d</div>
            <div class="light" class:lit={clause3}></div>
        </div>

        <div class="row">
            <div>!e || !d</div>
            <div class="light" class:lit={clause4}></div>
        </div>

        <div class="row">
            <div>!a || !b</div>
            <div class="light" class:lit={clause5}></div>
        </div>

        <div class="row">
            <div>a || !e</div>
            <div class="light" class:lit={clause6}></div>
        </div>

        <div class="row">
            <div>!b || c || e</div>
            <div class="light" class:lit={clause7}></div>
        </div>

        <div class="row" style="margin-top: 12px">
            <div>All True</div>
            <div class="light" class:lit={allClauses}></div>
        </div>
    </div>
</div>




