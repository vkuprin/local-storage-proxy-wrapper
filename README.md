# Local Storage Proxy (browser / node)

A library which provides assistance in managing the localStorage object and adds the capability to detect modifications to localStorage.

### API Reference
  - [API Reference](#API)
    - [constructor(historySize: number = 1)](#constructorhistorysize-number--1)
    - [getHistory(key: string): ListenerValue[]](#gethistorykey-string-listenervalue)
    - [get(target: Storage, key: string)](#gettarget-storage-key-string)
    - [set(target: Storage, key: string, value: ListenerValue): boolean](#settarget-storage-key-string-value-listenervalue-boolean)
    - [clearHistory(key: string): void](#clearhistorykey-string-void)
    - [addChangeListener(key: string, listener: Listener): void](#addchangelistenerkey-string-listener-changelistener-void)
    - [clearChangeListeners(key: string): void](#clearchangelistenerskey-string-void)
    - [addGlobalChangeListener(listener: GlobalListener): void](#addglobalchangelistenerlistener-changelistener-void)
    - [clearGlobalChangeListeners(): void](#clearglobalchangelisteners-void)
    - [setMultiple(values: { [key: string]: string }): void](#setmultiplevalues--key-string-listenervalue--void)
    - [getMultiple(...keys: string[]): { [key: string]: string }](#getmultiplekeys-string--key-string-listenervalue-)
    - [removeMultiple(...keys: string[]): void](#removemultiplekeys-string-void)

### Installation
To install the library, run the following command:

```bash
npm install local-storage-proxy-wrapper
# or
yarn add local-storage-proxy-wrapper
```

### Purpose
It provides more intuitive way to use localStorage and various functionalities like setting, getting, and deleting values, listening for changes to localStorage, getting the history of previous changes, and getting or setting multiple keys...

### Usage
To use the library, import it into your project:

### Usage with a wrapper ( recommended )

```javascript
import { LocalStorageWrapper, localStorageProxy } from 'local-storage-proxy-wrapper';
```

To <b>set</b> a value, use the following syntax:

```javascript
const store = new LocalStorageWrapper();
// Returns true if successfuly set
store.set(localStorageProxy, 'yourKey', 'yourValue');
```

To <b>get</b> a value, use the following syntax:

```javascript
const store = new LocalStorageWrapper();
// Contains the value of yourKey
store.get(localStorageProxy, 'yourKey');
```

To <b>listen for changes</b> to the localStorage object, use the following syntax:

```javascript
const store = new LocalStorageWrapper();

store.addChangeListener('yourKey', (newValue, oldValue) => {
    console.log('changed', newValue, oldValue);
});

// Will log 'changed yourValueOne undefined'
store.set(localStorageProxy, 'yourKey', 'yourValueOne');

// Will log 'changed yourValueTwo yourValueOne'
store.set(localStorageProxy, 'yourKey', 'yourValueTwo'); 
```

To <b>get the history of a key</b>, use the following syntax:

```javascript
const store = new LocalStorageWrapper(3); // keep track of 3 previous values

store.set(localStorageProxy, 'yourKey', 'yourValueOne');
store.set(localStorageProxy, 'yourKey', 'yourValueTwo');
store.set(localStorageProxy, 'yourKey', 'yourValueThree');

console.log(store.getHistory('yourKey')); // ['yourValueOne', 'yourValueTwo', 'yourValueThree']
```

To <b>listen global changes to all keys</b> in the storage use the following syntax:

```javascript
const store = new LocalStorageWrapper();

store.addGlobalChangeListener((key, newValue, oldValue) => {
    console.log('changed', key, newValue, oldValue);
});
```

To <b>remove a change listener</b>, use the following syntax:

```javascript
const store = new LocalStorageWrapper();

store.clearChangeListeners('yourKey');
```

To <b>get or set multiple keys</b>, use the following syntax:

```javascript
const store = new LocalStorageWrapper();

store.setMultiple({
    keyOne: 'valueOne',
    keyTwo: 'valueTwo',
    keyThree: 'valueThree',
});

store.getMultiple('keyOne', 'keyTwo', 'keyThree'); // { keyOne: 'valueOne', keyTwo: 'valueTwo', keyThree: 'valueThree' }
```

### Direct usage with no wrapper ( not recommended )
```javascript
import { localStorageProxy } from 'local-storage-proxy-wrapper';
```

To <b>set</b> a value, use the following syntax:

```javascript
localStorageProxy.yourKey = 'yourValue';
```

To <b>get</b> a value, use the following syntax:

```javascript
const yourValue = localStorageProxy.yourKey;
```

To <b>delete</b> a value, use the following syntax:

```javascript
delete localStorageProxy.yourKey;
```

### API

#### `constructor(historySize: number = 1)`

Creates an instance of `LocalStorageWrapper`.

##### Parameters

-   `historySize`: The number of previous values that should be stored in the history for each key. Default is `1`.

#### `getHistory(key: string): ListenerValue[]`

Returns the history of changes for a given key, depending on the historySize passed to the constructor.

##### Parameters

-   `key`: The key to get the history for

##### Returns

-   An array of previous values that have been stored for the key.

#### `clearHistory(key: string): void`

Clears the history for a given key

##### Parameters

-   `key`: The key to clear the history for

#### `get(target: Storage, key: string)`

Gets the value for a given key from the storage.

##### Parameters

-   `target`: The storage to get the value from.
-   `key`: The key to get the value for.

##### Returns

-   The value for the given key from the storage.

#### `set(target: Storage, key: string, value: ListenerValue): boolean`

Sets the value for a given key in the storage.

##### Parameters

-   `target`: The storage to set the value in.
-   `key`: The key to set the value for.
-   `value`: The value to set.

##### Returns

-   `true` if the value was set successfully, `false` otherwise.

#### `addChangeListener(key: string, listener: ChangeListener): void`

Adds a change listener for a given key to observe changes in the storage for old and new values.

##### Parameters

-   `key`: The key to add the listener for.
-   `listener`: The listener function to add. The function is called with the new value , old value, and key as arguments.

#### `clearChangeListeners(key: string): void`

Removes all change listeners for a given key.

##### Parameters

-   `key`: The key to remove the listeners for.

#### `addGlobalChangeListener(listener: ChangeListener): void`

Adds a listener that will be called on any change in the storage, regardless of the key that was changed.

##### Parameters

-   `listener`: The listener function to add. The function is called with the new value, old value, and key as arguments.

#### `clearGlobalChangeListeners(): void`

Removes all global change listeners.

##### Parameters

-   `key`: The keys collection to set the values for.
-   `values`: The values to set.

##### `setMultiple(values: { [key: string]: ListenerValue }): void`

Sets multiple values in the storage.

##### Parameters

-   `key`: The keys collection to get the values for.
-   `values`: The values to get.

##### `getMultiple(...keys: string[]): { [key: string]: ListenerValue }`

##### Parameters

-   `keys`: The keys to remove the values for.

##### `removeMultiple(...keys: string[]): void`

Removes multiple values from the storage at once.

Gets multiple values from the storage.