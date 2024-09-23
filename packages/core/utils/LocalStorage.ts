/**
 * Safe & drop-in replacement for localStorage access for browser with storage disabled
 *  - Firefox with dom.storage.enabled = false
 *  - Webview with storage disabled
 */
const LocalStorage: typeof window.localStorage = {
  getItem(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      return window.localStorage.setItem(key, value);
    } catch (err) {
      return;
    }
  },
  removeItem(key: string): void {
    try {
      return window.localStorage.removeItem(key);
    } catch (err) {
      return;
    }
  },
  clear(): void {
    try {
      return window.localStorage.clear();
    } catch (err) {
      return;
    }
  },
  key(index: number): string | null {
    try {
      return window.localStorage.key(index);
    } catch (err) {
      return null;
    }
  },
  get length(): number {
    try {
      return window.localStorage.length;
    } catch (err) {
      return 0;
    }
  },
};

export default LocalStorage;
