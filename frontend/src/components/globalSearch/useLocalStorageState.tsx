import { useState } from 'react';

/**
 * Custom hook to manage state synchronized with localStorage.
 * Value must by serializable to JSON.
 *
 * @template T - The type of the state value.
 * @param {string} key - The key under which the state is stored in localStorage.
 * @param {T} defaultValue - The default value to use if no value is found in localStorage.
 * @returns Returns a tuple containing the current state and a function to update the state.
 *
 * @example
 * const [value, setValue] = useLocalStorageState<string>('myKey', 'default');
 * setValue((oldValue) => 'newValue');
 */
export function useLocalStorageState<T>(key: string, defaultValue: T) {
  const get = () => {
    const maybeValue = localStorage.getItem(key);
    if (maybeValue) {
      return JSON.parse(maybeValue);
    }
    return defaultValue;
  };
  const put = (value: T) => localStorage.setItem(key, JSON.stringify(value));

  const [state, setState] = useState<T>(() => get());

  const set = (updater: (old: T) => T) => {
    const newValue = updater(state);
    put(newValue);
    setState(newValue);
  };

  return [state, set] as const;
}
