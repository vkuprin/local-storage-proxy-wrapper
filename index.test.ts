import { LocalStorageWrapper, ChangeListener } from "./index";

describe("LocalStorageWrapper", () => {
  let localStorageWrapper: LocalStorageWrapper;

  beforeEach(() => {
    localStorageWrapper = new LocalStorageWrapper();
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    } as any;
  });

  describe("notifyListeners", () => {
    it("should notify change listeners", () => {
      const listener: ChangeListener = jest.fn();
      localStorageWrapper.addChangeListener("key", listener);

      // Call the private method using a workaround
      (localStorageWrapper as any).notifyListeners("newValue", "oldValue", "key");

      expect(listener).toHaveBeenCalledWith("newValue", "oldValue", "key");
    });
  });

  describe("getHistory", () => {
    it("should return the history of a key", () => {
      (localStorageWrapper as any).history["key"] = ["oldValue1", "oldValue2"];
      const history = localStorageWrapper.getHistory("key");

      expect(history).toEqual(["oldValue1", "oldValue2"]);
    });
  });

  describe("clearHistory", () => {
    it("should clear the history of a key", () => {
      (localStorageWrapper as any).history["key"] = ["oldValue1", "oldValue2"];
      localStorageWrapper.clearHistory("key");

      expect(localStorageWrapper.getHistory("key")).toEqual([]);
    });
  });

  describe("checkMemoryLimit", () => {
    it("should return true if memory limit is not reached", async () => {
      const result = await (localStorageWrapper as any).checkMemoryLimit(localStorage);
      expect(result).toBe(true);
    });

    // it("should throw error if memory limit is reached", async () => {
    //   (global.localStorage.setItem as jest.Mock).mockImplementation(() => {
    //     throw new Error("Storage memory limit reached");
    //   });
    //
    //   await expect((localStorageWrapper as any).checkMemoryLimit(localStorage)).rejects.toThrow(
    //     "Storage memory limit reached",
    //   );
    // });
  });

  // describe("get", () => {
  //   it("should return the value for a key synchronously", async () => {
  //     (global.localStorage.getItem as jest.Mock).mockReturnValue("value");
  //     const value = await localStorageWrapper.get(localStorage, "key");
  //
  //     expect(value).toBe("value");
  //   });
  //
  //   it("should return the value for a key asynchronously", async () => {
  //     (global.localStorage.getItem as jest.Mock).mockReturnValue("value");
  //     const value = await localStorageWrapper.get(localStorage, "key", true);
  //
  //     expect(value).toBe("value");
  //   });
  // });

  // describe("set", () => {
  //   it("should set the value for a key synchronously", async () => {
  //     const notifyListenersSpy = jest.spyOn<any, any>(localStorageWrapper as any, "notifyListeners");
  //     const result = await localStorageWrapper.set(localStorage, "key", "newValue");
  //
  //     expect(global.localStorage.setItem).toHaveBeenCalledWith("key", "newValue");
  //     expect(notifyListenersSpy).toHaveBeenCalledWith("newValue", "", "key");
  //     expect(result).toBe(true);
  //   });
  //
  //   // it("should set the value for a key asynchronously", async () => {
  //   //   const notifyListenersSpy = jest.spyOn<any, any>(localStorageWrapper as any, "notifyListeners");
  //   //   const result = await localStorageWrapper.set(localStorage, "key", "newValue", true);
  //   //
  //   //   expect(global.localStorage.setItem).toHaveBeenCalledWith("key", "newValue");
  //   //   expect(notifyListenersSpy).toHaveBeenCalledWith("newValue", "", "key");
  //   //   expect(result).toBe(true);
  //   // });
  // });

  describe("setWithMemoryCheck", () => {
    it("should set the value if memory limit is not reached", async () => {
      const setSpy = jest.spyOn(localStorageWrapper, "set").mockResolvedValue(true);
      const result = await localStorageWrapper.setWithMemoryCheck(localStorage, "key", "newValue");

      expect(setSpy).toHaveBeenCalledWith(localStorage, "key", "newValue", false);
      expect(result).toBe(true);
    });

    it("should not set the value if memory limit is reached", async () => {
      jest
        .spyOn<any, any>(localStorageWrapper as any, "checkMemoryLimit")
        .mockRejectedValue(new Error("Memory limit reached"));
      const result = await localStorageWrapper.setWithMemoryCheck(localStorage, "key", "newValue");

      expect(result).toBe(false);
    });
  });

  describe("addChangeListener", () => {
    it("should add a change listener", () => {
      const listener: ChangeListener = jest.fn();
      localStorageWrapper.addChangeListener("key", listener);

      expect((localStorageWrapper as any).changeListeners["key"]).toContain(listener);
    });
  });

  describe("clearChangeListeners", () => {
    it("should clear change listeners for a key", () => {
      const listener: ChangeListener = jest.fn();
      localStorageWrapper.addChangeListener("key", listener);
      localStorageWrapper.clearChangeListeners("key");

      expect((localStorageWrapper as any).changeListeners["key"]).toEqual([]);
    });
  });

  describe("addGlobalChangeListener", () => {
    it("should add a global change listener", () => {
      const listener: ChangeListener = jest.fn();
      localStorageWrapper.addGlobalChangeListener(listener);

      expect((localStorageWrapper as any).globalChangeListeners).toContain(listener);
    });
  });

  describe("clearGlobalChangeListeners", () => {
    it("should clear all global change listeners", () => {
      const listener: ChangeListener = jest.fn();
      localStorageWrapper.addGlobalChangeListener(listener);
      localStorageWrapper.clearGlobalChangeListeners();

      expect((localStorageWrapper as any).globalChangeListeners).toEqual([]);
    });
  });

  describe("setMultiple", () => {
    it("should set multiple values", async () => {
      const setWithMemoryCheckSpy = jest.spyOn(localStorageWrapper, "setWithMemoryCheck").mockResolvedValue(true);
      const data = { key1: "value1", key2: "value2" };
      await localStorageWrapper.setMultiple(data);

      expect(setWithMemoryCheckSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("getMultiple", () => {
    it("should get multiple values", async () => {
      jest.spyOn(localStorageWrapper, "get").mockResolvedValueOnce("value1").mockResolvedValueOnce("value2");
      const keys = ["key1", "key2"];
      const result = await localStorageWrapper.getMultiple(keys);

      expect(result).toEqual({ key1: "value1", key2: "value2" });
    });
  });

  describe("removeMultiple", () => {
    it("should remove multiple keys", async () => {
      const removeSyncSpy = jest.spyOn<any, any>(localStorageWrapper as any, "removeSync");
      const keys = ["key1", "key2"];
      await localStorageWrapper.removeMultiple(keys);

      expect(removeSyncSpy).toHaveBeenCalledTimes(2);
    });
  });
});
