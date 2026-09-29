/**
 * Storage Service
 * Encapsulates safe access to browser localStorage with JSON serialization,
 * error handling, and in-memory fallback.
 */

const memoryFallback = new Map();

export const storageService = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`[storageService] Failed to read key "${key}":`, err);
      return memoryFallback.has(key) ? memoryFallback.get(key) : defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      memoryFallback.set(key, value);
      return true;
    } catch (err) {
      console.warn(`[storageService] Failed to write key "${key}":`, err);
      memoryFallback.set(key, value);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      memoryFallback.delete(key);
      return true;
    } catch (err) {
      console.warn(`[storageService] Failed to remove key "${key}":`, err);
      memoryFallback.delete(key);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      memoryFallback.clear();
      return true;
    } catch (err) {
      console.warn('[storageService] Failed to clear storage:', err);
      return false;
    }
  },
};
