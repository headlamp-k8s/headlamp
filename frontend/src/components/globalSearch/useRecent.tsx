import { useCallback } from 'react';
import { useLocalStorageState } from './useLocalStorageState';

/**
 * Custom hook to manage a list of recent items stored in local storage.
 *
 * @param {string} key - The key under which the recent items are stored in local storage.
 * @param {number} [maxItems=10] - The maximum number of recent items to keep. Defaults to 10.
 * @returns {[Record<string, number>, (id: string) => void]} - Returns a tuple containing the recent items and a function to bump an item to the top of the recent list.
 *
 * The `recent` object contains item IDs as keys and timestamps as values.
 * The `bump` function takes an item ID and updates its timestamp, moving it to the top of the recent list.
 */
export function useRecent(
  key: string,
  maxItems: number = 10
): [Record<string, number>, (id: string) => void] {
  const [recent, setRecent] = useLocalStorageState<Record<string, number>>(key, {});

  const bump = useCallback((id: string) => {
    setRecent(recent => {
      const entries = Object.entries(recent);
      const newRecent: Record<string, number> = { ...recent };

      if (entries.length + 1 > maxItems) {
        // Find oldest entry
        let oldestEntry = entries[0];
        entries.forEach(entry => {
          if (entry[1] < oldestEntry[1]) {
            oldestEntry = entry;
          }
        });

        // Remove it
        delete newRecent[oldestEntry[0]];
      }

      newRecent[id] = +new Date();

      return newRecent;
    });
  }, []);

  return [recent, bump] as const;
}
