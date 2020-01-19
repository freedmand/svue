import { Svue } from './svue';
import { tweened } from 'svelte/motion';

export const sv = new Svue({
  data() {
    return {
      x: 2,
      y: 3,
      k: 7,
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
    delayed(x, y) {
      return new Promise(resolve => {
        setTimeout(() => resolve(x + y), 2000);
      });
    },
    greeting(name) {
      return `Hello ${name}!`;
    }
  },
  watch: {
    z(newZ) {
      console.log('Received a new Z value', newZ, 'k is', this.k);
    }
  }
});

sv.x = 6;
console.log(sv.z);
console.log(sv.a);
sv.y = 4;
console.log(sv.z);
console.log(sv.a);
