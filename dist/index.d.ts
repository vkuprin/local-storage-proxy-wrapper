type ChangeListener = (newValue: any, oldValue: any, key: string) => void;
export declare class LocalStorageWrapper {
    private changeListeners;
    get(target: Storage, key: string): any;
    set(target: Storage, key: string, value: any): boolean;
    addChangeListener(key: string, listener: ChangeListener): void;
    clearChangeListeners(key: string): void;
}
export declare const localStorageProxy: object;
export {};
