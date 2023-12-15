export type ListenerValue =
  string | number | boolean | object |
  Array<string | number | boolean | object>;

export type ChangeListener = (
  newValue: ListenerValue,
  oldValue: ListenerValue,
  key: string
) => void;

export class LocalStorageWrapper {
  private changeListeners: { [key: string]: ChangeListener[] } = {};

  private globalChangeListeners: ChangeListener[] = [];

  private history: { [key: string]: any } = {};

  private readonly historySize: number;

  constructor(historySize: number = 1) {
    this.historySize = historySize;
  }

  private notifyListeners(newValue: ListenerValue, oldValue: ListenerValue, key: string): void {
    if (!this.history[key]) {
      this.history[key] = [];
    }
    this.history[key].unshift(oldValue);
    if (this.history[key].length > this.historySize) {
      this.history[key].pop();
    }
    if (this.changeListeners[key]) {
      for (const listener of this.changeListeners[key]) {
        listener(newValue, oldValue, key);
      }
    }

    if (this.globalChangeListeners.length > 0) {
      for (const listener of this.globalChangeListeners) {
        listener(newValue, oldValue, key);
      }
    }
  }

  /*
    * Returns the history of changes for a given key
    * depends on the historySize passed to the constructor
    * @param key name The key to get the history for
  */
  getHistory(key: string): ListenerValue[] {
    if (!this.history[key]) {
      return [];
    }
    return this.history[key];
  }

  /*
    * Clears the history for a given key
    * @param key name The key to clear the history for
  */
  clearHistory(key: string): void {
    if (this.history[key]) {
      this.history[key] = [];
    }
  }

  /*
    * Gets the value for a given key from the storage
    * @param key name The key to get the value for
    * @param storage The storage to get the value from
  */
  get(target: Storage, key: string) {
    try {
      return target[key];
    } catch (e) {
      throw new Error(`Error getting value for key ${key} from storage`);
    }
  }

  /*
    * Sets the value for a given key in the storage
    * @param target The storage to set the value in
    * @param key name The key to set the value for
    * @param value The value to set
  */
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

  /*
    * Adds a change listener for a given key to
    * observe changes in the storage for old and new values
    * @param key name The key to add the listener for
    * @param listener The listener to add
  */
  addChangeListener(key: string, listener: ChangeListener): void {
    if (!this.changeListeners[key]) {
      this.changeListeners[key] = [];
    }
    this.changeListeners[key].push(listener);
  }

  /*
    * Removes a change listener for a given key
    * @param key name The key to remove the listener for
  */
  clearChangeListeners(key: string): void {
    if (this.changeListeners[key]) {
      this.changeListeners[key] = [];
    }
  }

  /*
    * Listen to all changes in the storage for all keys
    * @param listener The listener to add
    * @param storage The storage to listen to
  */
  addGlobalChangeListener(listener: ChangeListener): void {
    this.globalChangeListeners.push(listener);
  }

  /*
    * Removes a global change listener
    * @param listener The listener to remove
  */
  clearGlobalChangeListeners(): void {
    this.globalChangeListeners = [];
  }

  /*
    * Sets multiple values in the storage at once
    * @param values The values to set in the object format { key: value }
  */
  setMultiple(data: { [key: string]: ListenerValue }): void {
    for (const key of Object.keys(data)) {
      const oldValue = window.localStorage.getItem(key);
      window.localStorage.setItem(key, String(data[key]));
      const safeOldValue = oldValue !== null ? oldValue : '';
      this.notifyListeners(data[key], safeOldValue, key);
    }
  }

  /*
    * Gets multiple values in the storage at once
    * @param keys The keys to get the values for in the array format [key1, key2]
  */
  getMultiple(keys: string[]): { [key: string]: ListenerValue } {
    const result: { [key: string]: ListenerValue } = {};
    for (const key of keys) {
      const item = window.localStorage.getItem(key);
      result[key] = item !== null ? item : '';
    }
    return result;
  }

  /*
    * Removes multiple values in the storage at once
    * @param keys The keys to remove the values for in the array format [key1, key2]
  */
  removeMultiple(keys: string[]): void {
    for (const key of keys) {
      const oldValue = window.localStorage.getItem(key);
      window.localStorage.removeItem(key);
    }
  }
}

const checkWindow = () => (typeof window === 'undefined' ? {} : localStorage);

export const localStorageProxy: Storage = <Storage>new Proxy(checkWindow(), new LocalStorageWrapper());
