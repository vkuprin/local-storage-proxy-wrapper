# Local Storage Proxy (browser / node)

A library which provides assistance in managing the localStorage object and adds the capability to detect modifications to localStorage

### Installation

To install the library, run the following command:

```bash
npm install local-storage-proxy-wrapper
# or
yarn add local-storage-proxy-wrapper
```

### Purpose

It provides more intuitive way to use localStorage and various functionalities like setting, getting, and deleting values, listening for changes to localStorage, getting the history of previous changes, and getting or setting multiple keys...

### Differences from standard localStorage

#### Change Listeners:

Per-Key Listeners: You can add listeners to specific keys that will be notified when the value associated with those keys changes.
Global Listeners: You can add listeners that will be notified of any changes to the localStorage.

#### History Tracking:

The library maintains a history of changes for each key, allowing you to retrieve the previous values up to a specified history size. This is particularly useful for undo functionalities or tracking changes over time.

#### Asynchronous Operations:

Asynchronous Get/Set: The library provides methods for getting and setting items in localStorage asynchronously, which can help in situations where you want to avoid blocking the main thread.

#### Memory Check:

Memory Limit Checking: Before setting a value, the library can check if the storage has reached its memory limit, preventing errors related to exceeding the storage quota.

#### Bulk Operations:
Set Multiple: You can set multiple key-value pairs at once with a single method call.
Get Multiple: You can retrieve multiple key-value pairs at once.
Remove Multiple: You can remove multiple keys at once.

#### Proxy Handling:

The library provides a proxy interface (localStorageProxy) that allows you to interact with localStorage as if it were a regular JavaScript object, while still benefiting from the added functionalities.

### Documentation
For detailed documentation, visit the [documentation page](https://vkuprin.github.io/local-storage-proxy-wrapper/)

### React Example

```jsx
import LocalStorageWrapper from 'local-storage-proxy-wrapper';

const useLocalStorage = () => {
  const storage = new LocalStorageWrapper.LocalStorageWrapper();

  const getAsyncValue = async (key: string) => {
    return await storage.get(storage, key, true);
  };

  const setAsyncValue = async (key: string, value: any) => {
    await storage.set(key, value, true);
  };

  return {
    getValue: getAsyncValue,
    setValue: setAsyncValue,
  };
};

const MyComponent = () => {
    const { getValue, setValue } = useLocalStorage();
    const [storedValue, setStoredValue] = useState(null);

    const fetchValue = async () => {
        const value = await getValue('myKey');
        setStoredValue(value);
    };

    useEffect(() => {
        fetchValue();
    }, []);

    const handleSetValue = async () => {
        await setValue('myKey', 'newValue');
        fetchValue(); // Refresh the stored value
    };

    return (
        <div>
            <p>Stored Value: {storedValue}</p>
            <button onClick={handleSetValue}>Set New Value</button>
    </div>
    );
};
```

