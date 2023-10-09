import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JSONPath } from 'jsonpath-plus';
import { KubeObjectInterface } from '../lib/k8s/cluster';
import { KubeEvent } from '../lib/k8s/event';

export interface FilterState {
  /** The namespaces to filter on. */
  namespaces: Set<string>;
  /** The search string to filter on. */
  search: string;
}

export const initialState: FilterState = {
  namespaces: new Set(),
  search: '',
};

/**
 * Filters a resource based on the filter state.
 *
 * @param item - The item to filter.
 * @param filter - The filter state.
 * @param matchCriteria - The JSONPath criteria to match.
 *
 * @returns True if the item matches the filter, false otherwise.
 */
export function filterResource(
  item: KubeObjectInterface | KubeEvent,
  filter: FilterState,
  matchCriteria?: string[]
) {
  let matches: boolean = true;

  if (item.metadata.namespace && filter.namespaces.size > 0) {
    matches = filter.namespaces.has(item.metadata.namespace);
  }

  if (!matches) {
    return false;
  }

  if (filter.search) {
    const filterString = filter.search.toLowerCase();
    const usedMatchCriteria = [
      item.metadata.uid.toLowerCase(),
      item.metadata.namespace ? item.metadata.namespace.toLowerCase() : '',
      item.metadata.name.toLowerCase(),
      ...Object.keys(item.metadata.labels || {}).map(item => item.toLowerCase()),
      ...Object.values(item.metadata.labels || {}).map(item => item.toLowerCase()),
    ];

    matches = !!usedMatchCriteria.find(item => item.includes(filterString));
    if (matches) {
      return true;
    }

    matches = filterGeneric(item, filter, matchCriteria);
  }

  return matches;
}

/**
 * Filters a generic item based on the filter state.
 *
 * The item is considered to match if any of the matchCriteria (described as JSONPath)
 * matches the filter.search contents. Case matching is insensitive.
 *
 * @param item - The item to filter.
 * @param filter - The filter state.
 * @param matchCriteria - The JSONPath criteria to match.
 */
export function filterGeneric<T extends { [key: string]: any } = { [key: string]: any }>(
  item: T,
  filter: FilterState,
  matchCriteria?: string[]
) {
  if (!filter.search) {
    return true;
  }

  const filterString = filter.search.toLowerCase();
  const usedMatchCriteria: string[] = [];

  // Use the custom matchCriteria if any
  (matchCriteria || []).forEach(jsonPath => {
    let values: any[];
    try {
      values = JSONPath({ path: '$' + jsonPath, json: item });
    } catch (err) {
      console.debug(
        `Failed to get value from JSONPath when filtering ${jsonPath} on item ${item}; skipping criteria`
      );
      return;
    }

    // Include matches values in the criteria
    values.forEach((value: any) => {
      if (typeof value === 'string' || typeof value === 'number') {
        // Don't use empty string, otherwise it'll match everything
        if (value !== '') {
          usedMatchCriteria.push(value.toString().toLowerCase());
        }
      } else if (Array.isArray(value)) {
        value.forEach((elem: any) => {
          if (!!elem && typeof elem === 'string') {
            usedMatchCriteria.push(elem.toLowerCase());
          }
        });
      }
    });
  });

  return !!usedMatchCriteria.find(item => item.includes(filterString));
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    /**
     * Sets the namespace filter with an array of strings.
     */
    setNamespaceFilter(state, action: PayloadAction<string[]>) {
      state.namespaces = new Set(action.payload);
    },
    /**
     * Sets the search filter with a string.
     */
    setSearchFilter(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    /**
     * Resets the filter state.
     */
    resetFilter(state) {
      state.namespaces = new Set();
      state.search = '';
    },
  },
});

export const { setNamespaceFilter, setSearchFilter, resetFilter } = filterSlice.actions;

export default filterSlice.reducer;
