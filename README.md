# svue

Svue is a small (~2kb) library bringing Vue-style reactive stores with data and computed properties into Svelte.

The concise format leverages Svelte’s built-in store capabilities, allowing you to create structures like:

```javascript
export const sv = new Svue({
  data() {
    return {
      x: 2,
      y: 3
    }
  },
  computed: {
    z(x, y) {
      return x + y;
    },
  }
});
```

You can then bring these simple reactive stores into your Svelte components:

```html
<script>
  import { sv } from "./example.js";
</script>

<div>x: {$sv.x}</div>
<div>y: {$sv.y}</div>
<div>z (x + y): {$sv.z}</div>

<div>
  <button on:click={() => ($sv.x += 1)}>Increment X</button>
  <button on:click={() => ($sv.y += 1)}>Increment Y</button>
</div>
```

You can also mess around with the Svue store in plain JavaScript:

```javascript
sv.x = 10;
sv.y = 15;
console.log(sv.z); // logs 25
sv.y = 0;
console.log(sv.z); // logs 10
```

# Installation

Install simply with:

```bash
npm install svue
```

Then in a JavaScript file you can create a new store with:

```javascript
import { Svue } from 'svue';

export const store = new Svue({
  data() {
    return {
      ...
    }
  },
  computed: {
    ...
  }
```

And use the store in your Svelte component, using the traditional `$`-prefix:

```html
<script>
  import {store} from './store.js';
</script>

<div>$store.x</div>
```

# Example

Clone this repository and run:

```bash
npm install
npm run dev
```

Browse to the files `src/App.svelte` and `src/example.js` in this repository. Navigate your browser to port 8080 and open up the console. Following the code should give an example of how Svue works in practice.

# Guide

Svue leverages Svelte’s `writable` and `derived` wrappers from `svelte/store`, providing a more convenient syntax for declaring complex webs of dependencies.

You initialize a Svue object with a JavaScript object that currently supports two properties, `data()` and `computed`.

The `data()` property is a function that returns the initial data for the Svue store. We treat `data()` as a function so that objects/arrays are returned fresh each time.

```javascript
const car = new Svue({
  data() {
    return {
      make: "Nissan",
      model: "Rogue",
      year: 2015,
    }
  }
});
```

The `computed` property is an object that is used to return derived values based on the store’s properties. Each field of `computed` is a function that returns a value based on parameters.

For example, we can extend our Svue store in the previous example to auto-calculate a car’s name based on its make and model.

```javascript
const car = new Svue({
  data() {
    return {
      make: "Nissan",
      model: "Rogue",
      year: 2015,
    }
  },
  computed: {
    name(make, model) {
      return `${make} ${model}`;
    }
  },
});
```

Here, `name(make, model) { ... }` means we are creating a new derived property on the Svue store called `name` that depends on the `make` and `model` properties. Any time the `make` or `model` change, the `name` will auto-update.

Computed properties can also depend on each other. Let’s extend our example to have a `nameWithYear` field that depends on `name` and `year`:

```javascript
const car = new Svue({
  data() {
    return {
      make: "Nissan",
      model: "Rogue",
      year: 2015,
    }
  },
  computed: {
    nameWithYear(name, year) {
      return `${name} (${year})`;
    },
    name(make, model) {
      return `${make} ${model}`;
    }
  },
});
```

Notice how the order of computed properties does not matter, even though `nameWithYear` depends on `name` which comes after it.

Under the hood, this is all implemented as `writable` (data) and `derived` (computed) objects from `svelte/store`. Getter and setter methods are instantiated dynamically allowing simple JavaScript interaction with Svue stores. The entire Svue store has a subscription function per the Svelte store contract, allowing it to be used in any Svelte component prefixed with `$` (see examples above).

# License

[MIT](https://github.com/freedmand/svue/blob/master/LICENSE)
