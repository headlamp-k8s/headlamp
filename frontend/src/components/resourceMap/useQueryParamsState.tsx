import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

type UseQueryParamsStateReturnType<T> = [T | undefined, (newValue: T | undefined) => void];

/**
 * Custom hook to manage a state synchronized with a URL query parameter
 *
 * @param param - The name of the query parameter to synchronize with
 * @param initialState - The initial state value
 * @returns A tuple containing the current state value and a function to update the state value
 *
 * @example
 * const [searchTerm, setSearchTerm] = useQueryParamsState('search', 'initial-value')
 *
 */
export function useQueryParamsState<T extends string | undefined>(
  param: string,
  initialState: T
): UseQueryParamsStateReturnType<T> {
  const location = useLocation();
  const history = useHistory();

  // State for managing the value derived from the query parameter
  const [value, setValue] = useState<T | undefined>(() => {
    const { search } = location;
    const searchParams = new URLSearchParams(search);
    const paramValue = searchParams.get(param);

    return paramValue !== null ? (decodeURIComponent(paramValue) as T) : undefined;
  });

  // Update the value from URL to state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paramValue = searchParams.get(param);

    if (paramValue !== null) {
      const decodedValue = decodeURIComponent(paramValue) as T;
      setValue(decodedValue);
    } else {
      setValue(undefined);
    }
  }, [location.search]);

  // Set the value from state to URL
  useEffect(() => {
    const currentSearchParams = new URLSearchParams(location.search);

    if (value && currentSearchParams.get(param) === encodeURIComponent(value)) return;

    // Update the query parameter with the current state value
    if (value !== null && value !== '' && value !== undefined) {
      currentSearchParams.set(param, encodeURIComponent(value));
    } else {
      currentSearchParams.delete(param);
    }

    // Update the URL with the modified search parameters
    const newUrl = [location.pathname, currentSearchParams.toString()].filter(Boolean).join('?');

    history.push(newUrl);
  }, [param, value]);

  // Initi state with initial state value
  useEffect(() => {
    setValue(initialState);
  }, []);

  const handleSetValue = useCallback(
    (newValue: T | undefined) => {
      if (newValue !== undefined && typeof newValue !== 'string') {
        throw new Error("useQueryParamsState: Can't set a value to something that isn't a string");
      }
      setValue(newValue);
    },
    [setValue]
  );

  return [value, handleSetValue];
}
