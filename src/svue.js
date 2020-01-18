import { writable, get, derived } from 'svelte/store';

// From https://stackoverflow.com/a/9924463
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
const QUICK_ARROW = /^\s*([a-zA-Z0-9$_]+)\s*=>/;
export function getParamNames(func) {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  const quickMatch = fnStr.match(QUICK_ARROW);
  if (quickMatch != null) return [quickMatch[1]];

  const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null) return [];

  // Personal additions to handle arrow functions
  const arrowIdx = result.indexOf('=>');
  if (arrowIdx != -1) return result.slice(0, arrowIdx);

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
      let w = destructured[key];
      if (w == null || !w.set || !w.subscribe) {
        w = writable(w);
      }
      this.writables[key] = w;
      Object.defineProperty(this, key, {
        get() {
          return get(w);
        },
        set(newValue) {
          w.set(newValue);
        },
      });
      w.subscribe(() => this.pingSubscriptions());
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
        const d = derived(args.map(a => this.writables[a]), (args, setFn) => {
          const result = computed[key].bind(this)(...args);
          if (result && (typeof result.then) == 'function') {
            // Operate asynchronously if the function is a promise
            result.then((x) => setFn(x));
          } else {
            setFn(result);
          }
        });
        this.writables[key] = d;
        Object.defineProperty(this, key, {
          get() {
            return get(d);
          },
        });
        d.subscribe(() => this.pingSubscriptions());
        keys.splice(i, 1);
        i--;
      }
      if (!matched) throw new Error("INVALID COMPUTED");
    }
  }

  set(key, value) {
    if (key instanceof Svue) {
      return; // Already set (may be a bug in Svelte)
    }
    if (this.writables[key] == null) {
      throw new Error(`Invalid key: ${key}`);
    }
    this.writables[key].set(value);
  }

  update(fn) {
    let key = getParamNames(fn);
    if (key.length > 1) throw new Error("Only specify one arg for update");
    key = key[0];
    if (this.writables[key] == null) {
      throw new Error(`Invalid key: ${key}`);
    }
    this.writables[key].update(fn);
  }

  get(key) {
    return get(this.writables[key]);
  }
}
