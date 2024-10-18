import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

type UseQueryParamsStateReturnType<T> = [T, Dispatch<SetStateAction<T>>];
export function useQueryParamsState<T extends string | undefined>(
  param: string,
  initialState: T
): UseQueryParamsStateReturnType<T> {
  const location = useLocation();

  // State for managing the value derived from the query parameter
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialState;

    // Parse query parameter value from the URL
    const { search } = window.location;
    const searchParams = new URLSearchParams(search);
    const paramValue = searchParams.get(param);

    return paramValue !== null ? (decodeURIComponent(paramValue) as T) : initialState;
  });

  useEffect(() => {
    const currentSearchParams = new URLSearchParams(window.location.search);

    // Update the query parameter with the current state value
    if (value !== null && value !== '' && value !== undefined) {
      currentSearchParams.set(param, encodeURIComponent(value));
    } else {
      currentSearchParams.delete(param);
    }

    // Update the URL with the modified search parameters
    const newUrl = [window.location.pathname, currentSearchParams.toString()]
      .filter(Boolean)
      .join('?');

    // Update the browser's history without triggering a page reload
    window.history.replaceState(window.history.state, '', newUrl);
  }, [param, value, location.pathname]);

  return [value, setValue];
}
