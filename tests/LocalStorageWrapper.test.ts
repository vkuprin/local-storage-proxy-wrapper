import { describe, it, expect, beforeEach, jest } from '@jest/globals';
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

    it('should get a value', () => {
        window.localStorage.setItem('test', 'test');
        expect(wrapper.get(window.localStorage, 'test')).toBe('test');
    });

    it('should set multiple values', () => {
        wrapper.setMultiple({ test: 'test', test2: 'test2' });
        expect(window.localStorage.getItem('test')).toBe('test');
        expect(window.localStorage.getItem('test2')).toBe('test2');
    });

    it('should get multiple values', () => {
        window.localStorage.setItem('test', 'test');
        window.localStorage.setItem('test2', 'test2');
        expect(wrapper.getMultiple(['test', 'test2'])).toEqual({ test: 'test', test2: 'test2' });
    });

    it('should remove multiple values', () => {
        window.localStorage.setItem('test', 'test');
        window.localStorage.setItem('test2', 'test2');
        wrapper.removeMultiple(['test', 'test2']);
        expect(window.localStorage.getItem('test')).toBeNull();
        expect(window.localStorage.getItem('test2')).toBeNull();
    });

    it('should add a change listener', () => {
        const listener = jest.fn();
        wrapper.addChangeListener('test', listener);
        wrapper.set(window.localStorage, 'test', 'test');
        expect(listener).toHaveBeenCalled();
    })

    it('should add a global change listener', () => {
        const listener = jest.fn();
        wrapper.addGlobalChangeListener(listener);
        wrapper.set(window.localStorage, 'test', 'test');
        expect(listener).toHaveBeenCalled();
    });

    it('should clear change listeners', () => {
        const listener = jest.fn();
        wrapper.addChangeListener('test', listener);
        wrapper.clearChangeListeners('test');
        wrapper.set(window.localStorage, 'test', 'test');
        expect(listener).not.toHaveBeenCalled();
    });

    it('should clear global change listeners', () => {
        const listener = jest.fn();
        wrapper.addGlobalChangeListener(listener);
        wrapper.clearGlobalChangeListeners();
        wrapper.set(window.localStorage, 'test', 'test');
        expect(listener).not.toHaveBeenCalled();
    });
});
