import { Svue } from './svue';
import { tweened } from 'svelte/motion';

export const sv = new Svue({
  data() {
    return {
      x: 2,
      y: 3,
      name: 'Bob',
      tweened: tweened(0)
    }
  },
  computed: {
    a(z, x) {
      return z + x;
    },
    z(x, y) {
      return x + y;
    },
    greeting(name) {
      return `Hello ${name}!`;
    }
  }
});

sv.x = 6;
console.log(sv.z);
console.log(sv.a);
sv.y = 4;
console.log(sv.z);
console.log(sv.a);
