export type ListenerValue = string | number | boolean | object | Array<string | number | boolean | object>;

export type ChangeListener = (
    newValue: ListenerValue,
    oldValue: ListenerValue,
    key: string
) => void;

export class LocalStorageWrapper {
  private changeListeners: { [key: string]: ChangeListener[] } = {};

  private notifyListeners(newValue: ListenerValue, oldValue: ListenerValue, key: string): void {
    if (this.changeListeners[key]) {
      for (const listener of this.changeListeners[key]) {
        listener(newValue, oldValue, key);
      }
    }
  }

  get(target: Storage, key: string) {
    try {
      return target[key];
    } catch (e) {
      throw new Error(`Error getting value for key ${key} from storage`);
    }
  }

  set(target: Storage, key: string, value: ListenerValue): boolean {
    try {
      const oldValue = target[key];
      target[key] = value;
      this.notifyListeners(value, oldValue, key);
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

export const localStorageProxy: Storage = <Storage> new Proxy(checkWindow(), new LocalStorageWrapper());