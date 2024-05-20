# Local Storage Proxy (browser / node)

[![StackBlitz](https://img.shields.io/badge/StackBlitz-Edit-blue?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAABECAYAAAD+1gcLAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5AINBw4X0bTGRQAABSxJREFUaN7VmVtsFFUYx//fmQW79bbd2QKpaIIaDcGoifFBEgMGqTTRRA01SgxE5Rbi7QG6S3lgo9J2twpeotxEQlCigLdoQwJ4ARN9QB9MRCNRDBdRzE7LJbTSmTl/H4BYStmd2Z3tDOdt5lzml/9833fO9x0gYi2xgom6Tt5aapyKEnRDlrVGPzfGT+G3SwZ87HLGT8f5uYD7jmSl99IAX80RfTY3A5wMqDVepoQPnqVKHtMbAN4PyJeFtPwafXBSknG9UoDHAIDQq7xODRU8mdc5Aeaeffy7O2F8GnnwZM5dKsCic88CrMU8sSMNbubdZwTIDnjlOoZa52eNYQc3c84sEK+d/1a6ji2UA5EFN3POw4C8fcYy/m+a3p1y2MGTOXsqIJsAxAZ1Hei53tgeSfBkBycK1McALrswJGIVHhE3cuD1ed4uorsAXD5Ed7/hqvXlrFtV8LpO3qKpdwJIDLn/AB/+s0SORgp8VJ43KK23AzAvNsagWlXu+lKV6LGc14itvyEwrsiwX6wWNQEijITiY9pYD1vvKAENAG+VC40hQlNlNt3Bq22lt4EYX2Jor6PVe5V8KzDFG7KsFXE/A3GHB/vcdHyx9IQPnuXI/ji3CuRuT+N1+U4ZHPhmGqk43yXY5C0ccE9hsfwQLjgp5n69hmCz9ylYGcRPrgg8ldfLIXjSx5RjNX3GB6GCm3m3ncDz/v4QNnjJ4KsGbubdVhAZ35YFtTaoKOY7jps5dwGIZf73aH7dnZa9QYH72vLNDmcmRNaX86eEnGvT2BoIdA0o3pV2HgRkS9C7bXnRDGlPypmd9r2AvB8FaAFetDJGvqTiyU7eJWeOp1cgfOo3rRbj6ZJRJdHB20TrrkhAAxutXvVsSedMtfEmGno3gNHhM8snVp80IytO0The18HraOgdkYCm7KyLy6MDoYdUfNQyjnZjeheAm8NXmt/FlDH16CI5dUHaN/DhypeZUqK/AkomAsMQ8fCjq41GKy0nim75ydd51UjX3QZgQgQccV/MUfcVSzYM4Mw1hnPa7QJkYgSgD2qqe6xWOVL8kLWaI3ptbgFkUgSgjwpUY09GDpY8ZJnH9UsExhPYH8CuVgtgTJlzC5pqipXxdpUSaF3FzLkdANJleOIJETWlkJbvh78glOVIM64PARjlc2afiGoqtMiuUMoTqRp3ehnQtpDNfqEDBdeC+T6nuELOLGRiXVVPJC5u2xwP6L0+1qOQ8wqZWNmpXECK6wV+RBCipRLoQBRvyLL2dFwfBlDnTWos7W4xXgi3IATg31p3hldoEG8EAR0IuEC8OuUGK62eCyoYVARutvNOL9VZQD6yxqmnKqmHB6u46PkejHp7XVxmlHOzVhXnTKxgwujXhzH0bdo56m9jymgcKhEITXFl61lFoYV7BMa0akCjkjqJEHOKdP/U7xhNJ1vlZLXOv2Upnmq3JxfJlH4XRzWebBWrmgf38hRXav5F4vSfjqGmHl8if1W/NuSzjWljvW3oQxh0Ly9AQRtqUvdC+Xk4UiXfpmLH9JzB0CBOQKtpwwXtHzxLJcTsQW97FdQDQVxIVc3GUzVuEyEDb4z7NTndysju4c6qfSlOOc8pXQof78nEtoVRDvDsnMlXeK04+o+ztRgSnNOdjq1DSM2z4uLoeecKSCQWhgntXfEsY2ZcHwDQAMESq8VoC7ty5EnxZK37EIAGAV6NArT3c3def2Hm3HdASlSYSipe384bAR6x+tTsIBOBqoMTzlirVz2BrOgoWcF/mizikfkwKiQAAAAASUVORK5CYII=)](https://stackblitz.com/edit/vitejs-vite-j1vvk9?file=src%2FApp.tsx)

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
import LocalStorageWrapper, {
    ListenerValue,
} from 'local-storage-proxy-wrapper';

const useLocalStorage = () => {
    const storage = new LocalStorageWrapper();

    const getAsyncValue = async (key: string) => {
        return await storage.get(storage, key, true);
    };

    const setAsyncValue = async (key: string, value: ListenerValue) => {
        await storage.set(storage, key, value, true);
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
