type ChangeListener = (newValue: any, oldValue: any, key: string) => void;

export class LocalStorageWrapper {
  private changeListeners: { [key: string]: ChangeListener[] } = {};

  get(target: Storage, key: string) {
    return target[key];
  }

  set(target: Storage, key: string, value: any) {
    const oldValue = target[key];
    target[key] = value;
    if (this.changeListeners[key]) {
      for (const listener of this.changeListeners[key]) {
        listener(value, oldValue, key);
      }
    }
    return true;
  }

  addChangeListener(key: string, listener: ChangeListener) {
    if (!this.changeListeners[key]) {
      this.changeListeners[key] = [];
    }
    this.changeListeners[key].push(listener);
  }

  clearChangeListeners(key: string) {
      if (this.changeListeners[key]) {
        this.changeListeners[key] = [];
      }
    }
}

const checkWindow: () => (object) = () => {
  if (typeof window === 'undefined') {
      return {};
  }
  return localStorage;
}

export const localStorageProxy = new Proxy(checkWindow(), new LocalStorageWrapper());

if (!window.Proxy) {
  window.Proxy = ProxyPolyfill;
}