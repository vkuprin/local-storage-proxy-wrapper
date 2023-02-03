import scala.scalajs.js
import scala.scalajs.js.annotation.JSGlobal

@js.native
@JSGlobal("localStorage")
object LocalStorage extends js.Object {
  def getItem(key: String): String = js.native
  def setItem(key: String, value: String): Unit = js.native
  def removeItem(key: String): Unit = js.native
  def clear(): Unit = js.native
  def key(index: Int): String = js.native
  def length: Int = js.native
}

object LocalStorageProxy {
  def get(key: String): String = LocalStorage.getItem(key)
  def set(key: String, value: String): Unit = LocalStorage.setItem(key, value)
  def remove(key: String): Unit = LocalStorage.removeItem(key)
  def clear(): Unit = LocalStorage.clear()
  def key(index: Int): String = LocalStorage.key(index)
  def length: Int = LocalStorage.length
}

object LocalStorageWrapper {
  private val changeListeners: js.Dictionary[js.Array[ChangeListener]] = js.Dictionary()
  private val globalChangeListeners: js.Array[ChangeListener] = js.Array()
  private val history: js.Dictionary[js.Array[js.Any]] = js.Dictionary()
  private val historySize: Int = 1

  def notifyListeners(newValue: js.Any, oldValue: js.Any, key: String): Unit = {
    if (!history.contains(key)) {
      history(key) = js.Array()
    }
    history(key).unshift(oldValue)
    if (history(key).length > historySize) {
      history(key).pop()
    }
    if (changeListeners.contains(key)) {
      for (listener <- changeListeners(key)) {
        listener(newValue, oldValue, key)
      }
    }

    if (globalChangeListeners.length > 0) {
      for (listener <- globalChangeListeners) {
        listener(newValue, oldValue, key)
      }
    }
  }

  def getHistory(key: String): js.Array[js.Any] = {
    if (!history.contains(key)) {
      return js.Array()
    }
    history(key)
  }

  def clearHistory(key: String): Unit = {
    if (history.contains(key)) {
      history(key) = js.Array()
    }
  }

  def get(key: String): String = {
    try {
      LocalStorageProxy.get(key)
    } catch {
      case e: Throwable => throw new Error(s"Error getting value for key $key from storage")
    }
  }

  def set(key: String, value: js.Any): Boolean = {
    try {
      val oldValue = LocalStorageProxy.get(key)
      LocalStorageProxy.set(key, value.toString)
      notifyListeners(value, oldValue, key)
      true
    } catch {
      case e: Throwable => throw new Error(s"Error setting value for key $key in storage")
    }
  }

  def addChangeListener(key: String, listener: ChangeListener): Unit = {
    if (!changeListeners.contains(key)) {
      changeListeners(key) = js.Array()
    }
    changeListeners(key).push(listener)
  }

  def clearChangeListeners(key: String): Unit = {
    if (changeListeners.contains(key)) {
      changeListeners(key) = js.Array()
    }
  }

  def addGlobalChangeListener(listener: ChangeListener): Unit = {
    globalChangeListeners.push(listener)
  }

  def clearGlobalChangeListeners(): Unit = {
    globalChangeListeners = js.Array()
  }

  def setMultiple(data: js.Dictionary[js.Any]): Unit = {
    for (key <- js.Object.keys(data)) {
      val oldValue = LocalStorageProxy.get(key)
      LocalStorageProxy.set(key, data(key).toString)
      notifyListeners(data(key), oldValue, key)
    }
  }

  def getMultiple(keys: js.Array[String]): js.Dictionary[js.Any] = {
    val result = js.Dictionary[js.Any]()
    for (key <- keys) {
      result(key) = LocalStorageProxy.get(key)
    }
    result
  }
}

type ChangeListener = js.Function3[js.Any, js.Any, String, Unit]

object LocalStorageWrapper {
  def apply(): LocalStorageWrapper = new LocalStorageWrapper()
}

class LocalStorageWrapper {
  def get(key: String): String = LocalStorageWrapper.get(key)
  def set(key: String, value: js.Any): Boolean = LocalStorageWrapper.set(key, value)
  def addChangeListener(key: String, listener: ChangeListener): Unit = LocalStorageWrapper.addChangeListener(key, listener)
  def clearChangeListeners(key: String): Unit = LocalStorageWrapper.clearChangeListeners(key)
  def addGlobalChangeListener(listener: ChangeListener): Unit = LocalStorageWrapper.addGlobalChangeListener(listener)
  def clearGlobalChangeListeners(): Unit = LocalStorageWrapper.clearGlobalChangeListeners()
  def setMultiple(data: js.Dictionary[js.Any]): Unit = LocalStorageWrapper.setMultiple(data)
  def getMultiple(keys: js.Array[String]): js.Dictionary[js.Any] = LocalStorageWrapper.getMultiple(keys)
}