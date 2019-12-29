import { Svue } from './svue';

export const sv = new Svue({
  data() {
    return {
      x: 2,
      y: 3
    }
  },
  computed: {
    a(z, x) {
      return z + x;
    },
    z(x, y) {
      return x + y;
    },
  }
});

sv.x = 6;
console.log(sv.z);
console.log(sv.a);
sv.y = 4;
console.log(sv.z);
console.log(sv.a);
