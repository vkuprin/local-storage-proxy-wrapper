# Local Storage Proxy (browser / node)

A library which provides assistance in managing the localStorage object and adds the capability to detect modifications to localStorage.

[![Rate this package](https://badges.openbase.com/js/rating/local-storage-proxy-wrapper.svg?token=qocsFqVQshrwHHfbBZFxCary9nXTxo2R90G48g8zdOM=)](https://openbase.com/js/local-storage-proxy-wrapper?utm_source=embedded&amp;utm_medium=badge&amp;utm_campaign=rate-badge)
### Installation
To install the library, run the following command:

```bash
npm install local-storage-proxy-wrapper
# or
yarn add local-storage-proxy-wrapper
```

### Purpose
The purpose of this library is to provide a wrapper around the localStorage object which will allow you to detect when the localStorage object has been modified.
And access properties of the localStorage object in a more intuitive way.

### Usage
To use the library, import it into your project:

### Direct usage with no wrapper
```javascript
import { localStorageProxy } from 'local-storage-proxy-wrapper';
```

To set a value, use the following syntax:

```javascript
localStorageProxy.yourKey = 'yourValue';
```

To get a value, use the following syntax:

```javascript
const yourValue = localStorageProxy.yourKey;
```

To delete a value, use the following syntax:

```javascript
delete localStorageProxy.yourKey;
```

### Usage with a wrapper

```javascript
import { LocalStorageWrapper, localStorageProxy } from 'local-storage-proxy-wrapper';
```

To set a value, use the following syntax:

```javascript
const store = new LocalStorageWrapper();
// Returns true if successfuly set
store.set(localStorageProxy, 'yourKey', 'yourValue');
```

To get a value, use the following syntax:

```javascript
const store = new LocalStorageWrapper();
// Contains the value of yourKey
store.get(localStorageProxy, 'yourKey');
```

To listen for changes to the localStorage object, use the following syntax:

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

To remove a change listener, use the following syntax:

```javascript
const store = new LocalStorageWrapper();

store.clearChangeListeners('yourKey');
```
