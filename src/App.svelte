<script>
  import { sv } from "./example";
</script>

<h1>{$sv.greeting}</h1>

<p>Set name:</p>
<div>
  <input type="text" bind:value={$sv.name} />
</div>
<div>
  <button on:click={() => ($sv.name += '!')}>Add exclamation at end</button>
</div>

<div>x: {$sv.x}</div>
<div>y: {$sv.y}</div>
<div>delayed sum: {$sv.delayed}</div>
<div>a: {$sv.a}</div>
<div>z: {$sv.z}</div>

<div>
  <button on:click={() => ($sv.x += 1)}>Increment X</button>
  <button on:click={() => ($sv.y += 1)}>Increment Y</button>
</div>

<div>Tweened value: {$sv.tweened}</div>

<button on:click={() => $sv.update(tweened => tweened + 20)}>
  Increment by 20
</button>
