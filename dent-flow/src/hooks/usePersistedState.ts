import { useEffect, useState } from "react";

/**
 * Custom hook to persist React state in localStorage.
 * Automatically loads initial value from localStorage and keeps it updated.
 *
 * @template T - Type of the state
 * @param {string} key - localStorage key
 * @param {T} defaultValue - default value if nothing is in localStorage
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} - [state, setState]
 */
export function usePersistedState<T>(key: string, defaultValue: T) {
  // Initialize state from localStorage, fallback to defaultValue
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback if JSON parsing fails
        return saved as unknown as T;
      }
    }
    return defaultValue;
  });

  // Sync state changes to localStorage automatically
  useEffect(() => {
    try {
      if (typeof value === "string") {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Failed to persist key "${key}" in localStorage`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}