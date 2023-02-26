import { describe, it, expect, beforeEach } from '@jest/globals';
import { LocalStorageWrapper } from "../index";


describe('LocalStorageWrapper', () => {
    let storage: Storage;
    let wrapper: LocalStorageWrapper;

    beforeEach(() => {
        storage = window.localStorage;
        wrapper = new LocalStorageWrapper();
    });

    it('should set a value', () => {
        wrapper.set(window.localStorage, 'test', 'test');
        expect(window.localStorage.getItem('test')).toBe('test');
    });
});
