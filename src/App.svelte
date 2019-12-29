<script>
  import { sv } from "./example";
</script>

<div>x: {$sv.x}</div>
<div>y: {$sv.y}</div>
<div>a: {$sv.a}</div>
<div>z: {$sv.z}</div>

<div>
  <button on:click={() => (sv.x += 1)}>Increment X</button>
  <button on:click={() => (sv.y += 1)}>Increment Y</button>
</div>
