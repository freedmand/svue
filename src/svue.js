import { writable, get, derived } from 'svelte/store';

// From https://stackoverflow.com/a/9924463
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null) return [];
  return result;
}

export class Svue {
  constructor(structure) {
    this.data = {};
    this.writables = {};
    this.subscribeId = 0;
    this.subscribers = {};
    if (structure.data != null) this.initData(structure.data);
    if (structure.computed != null) this.initComputed(structure.computed);
  }

  subscribe(fn) {
    fn(this);
    const subscribeId = this.subscribeId++;
    this.subscribers[subscribeId] = fn;
    return () => { // unsubscribe function
      delete this.subscribers[subscribeId];
    };
  }

  pingSubscriptions() {
    Object.keys(this.subscribers).forEach(subscriber => {
      this.subscribers[subscriber](this);
    });
  }

  initData(data) {
    const destructured = data();
    Object.keys(destructured).forEach(key => {
      const w = writable(destructured[key]);
      this.writables[key] = w;
      Object.defineProperty(this, key, {
        get() {
          return get(w);
        },
        set(newValue) {
          w.set(newValue);
          this.pingSubscriptions();
        }
      })
    });
  }

  initComputed(computed) {
    const keys = Object.keys(computed);
    while (true) {
      if (keys.length == 0) break;

      let matched = false;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const args = getParamNames(computed[key]);
        if (!args.every(arg => this.writables[arg] != null)) continue;
        matched = true;
        const d = derived(args.map(a => this.writables[a]), args => computed[key](...args));
        this.writables[key] = d;
        Object.defineProperty(this, key, {
          get() {
            return get(d);
          }
        });
        keys.splice(i, 1);
        i--;
      }
      if (!matched) throw new Error("INVALID COMPUTED");
    }
  }

  set(key, value) {
    if (this.data[key] == null) {
      throw new Error(`Invalid key: ${key}`);
    }
    this.data[key].set(value);
    this.pingSubscriptions();
  }

  get(key) {
    return get(this.data[key]);
  }
}
