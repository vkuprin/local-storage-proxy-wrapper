export type ListenerValue = string | number | boolean | object | Array<string | number | boolean | object>;

export type ChangeListener = (newValue: ListenerValue, oldValue: ListenerValue, key: string) => void;

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

  getHistory(key: string): ListenerValue[] {
    if (!this.history[key]) {
      return [];
    }
    return this.history[key];
  }

  clearHistory(key: string): void {
    if (this.history[key]) {
      this.history[key] = [];
    }
  }

  private async checkMemoryLimit(target: Storage): Promise<boolean> {
    try {
      const testKey = "__test__";
      target.setItem(testKey, "test");
      target.removeItem(testKey);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(new Error("Storage memory limit reached"));
    }
  }

  get(target: Storage, key: string, async: boolean = false): Promise<ListenerValue | null> {
    if (async) {
      return this.getAsync(target, key);
    } else {
      return Promise.resolve(this.getSync(target, key));
    }
  }

  private getSync(target: Storage, key: string): ListenerValue | null {
    try {
      return target.getItem(key);
    } catch (e) {
      throw new Error(`Error getting value for key ${key} from storage`);
    }
  }

  private async getAsync(target: Storage, key: string): Promise<ListenerValue | null> {
    try {
      return Promise.resolve(target.getItem(key));
    } catch (e) {
      return Promise.reject(new Error(`Error getting value for key ${key} from storage`));
    }
  }

  set(target: Storage, key: string, value: ListenerValue, async: boolean = false): Promise<boolean> {
    if (async) {
      return this.setAsync(target, key, value);
    } else {
      return Promise.resolve(this.setSync(target, key, value));
    }
  }

  private setSync(target: Storage, key: string, value: ListenerValue): boolean {
    try {
      const oldValue: ListenerValue = target.getItem(key) ?? "";
      target.setItem(key, value as string);
      this.notifyListeners(value, oldValue, key);
      return true;
    } catch (e) {
      throw new Error(`Error setting value for key ${key} in storage`);
    }
  }

  private async setAsync(target: Storage, key: string, value: ListenerValue): Promise<boolean> {
    try {
      const oldValue: ListenerValue = target.getItem(key) ?? "";
      target.setItem(key, value as string);
      this.notifyListeners(value, oldValue, key);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(new Error(`Error setting value for key ${key} in storage`));
    }
  }

  async setWithMemoryCheck(
    target: Storage,
    key: string,
    value: ListenerValue,
    async: boolean = false,
  ): Promise<boolean> {
    try {
      await this.checkMemoryLimit(target);
      return await this.set(target, key, value, async);
    } catch (e) {
      console.warn(`Memory limit reached. Keeping previous state for key ${key}`);
      return Promise.resolve(false);
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

  addGlobalChangeListener(listener: ChangeListener): void {
    this.globalChangeListeners.push(listener);
  }

  clearGlobalChangeListeners(): void {
    this.globalChangeListeners = [];
  }

  async setMultiple(data: { [key: string]: ListenerValue }, async: boolean = false): Promise<void> {
    const promises = Object.keys(data).map((key) =>
      this.setWithMemoryCheck(window.localStorage, key, data[key], async),
    );
    await Promise.all(promises);
    return undefined;
  }

  async getMultiple(keys: string[], async: boolean = false): Promise<{ [key: string]: ListenerValue | null }> {
    const promises = keys.map((key) => this.get(window.localStorage, key, async));
    const results = await Promise.all(promises);
    const result: { [key_2: string]: ListenerValue | null } = {};
    results.forEach((value, index) => {
      result[keys[index]] = value;
    });
    return result;
  }

  async removeMultiple(keys: string[], async: boolean = false): Promise<void> {
    const promises = keys.map((key) => (async ? this.removeAsync(key) : Promise.resolve(this.removeSync(key))));
    await Promise.all(promises);
    return undefined;
  }

  private removeSync(key: string): void {
    window.localStorage.removeItem(key);
  }

  private async removeAsync(key: string): Promise<void> {
    return new Promise((resolve) => {
      window.localStorage.removeItem(key);
      resolve();
    });
  }
}

const checkWindow = () => (typeof window === "undefined" ? {} : localStorage);

class LocalStorageProxyHandler implements ProxyHandler<Storage> {
  private wrapper: LocalStorageWrapper;

  constructor(wrapper: LocalStorageWrapper) {
    this.wrapper = wrapper;
  }

  get(target: Storage, p: string | symbol, receiver: any): any {
    if (typeof p === "string") {
      return this.wrapper.get(target, p);
    }
    return Reflect.get(target, p, receiver);
  }

  set(target: Storage, p: string | symbol, value: any, receiver: any): boolean {
    if (typeof p === "string") {
      this.wrapper.set(target, p, value);
      return true;
    }
    return Reflect.set(target, p, value, receiver);
  }
}

export const localStorageProxy: {} = new Proxy(checkWindow(), new LocalStorageProxyHandler(new LocalStorageWrapper()));
