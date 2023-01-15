type ChangeListener = (newValue: any, oldValue: any, key: string) => void;

export class LocalStorageWrapper {
  private changeListeners: { [key: string]: ChangeListener[] } = {};

  get(target: Storage, key: string) {
    try {
      return target[key];
    } catch (e) {
      throw new Error(`Error getting value for key ${key} from storage`);
    }
  }

  set(target: Storage, key: string, value: any): boolean {
    try {
      const oldValue = target[key];
      target[key] = value;
      if (this.changeListeners[key]) {
        for (const listener of this.changeListeners[key]) {
          listener(value, oldValue, key);
        }
      }
      return true;
    } catch (e) {
        throw new Error(`Error setting value for key ${key} in storage`);
    }
  }

  addChangeListener(key: string, listener: ChangeListener): void {
    if (!this.changeListeners[key]) {
      this.changeListeners[key] = [];
    }
    this.changeListeners[key].push(listener);
  }

  clearChangeListeners(key: string): void {
      if (this.changeListeners[key]) {
        this.changeListeners[key] = [];
      }
    }
}

const checkWindow = () => (typeof window === 'undefined' ? {} : localStorage);

export const localStorageProxy = new Proxy(checkWindow(), new LocalStorageWrapper());