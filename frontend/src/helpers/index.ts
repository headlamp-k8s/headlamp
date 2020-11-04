/* Note: This code is taken from https://github.com/cheton/is-electron/blob/master/index.js
   Licence: MIT
*/
// helper method to determine whether app is running in electron environment
export function isElectron(): boolean {
  // Renderer process
  if (
    typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    (window.process as any).type === 'renderer'
  ) {
    return true;
  }

  // Main process
  if (
    typeof process !== 'undefined' &&
    typeof process.versions === 'object' &&
    !!(process.versions as any).electron
  ) {
    return true;
  }

  // Detect the user agent when the `nodeIntegration` option is set to true
  if (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.indexOf('Electron') >= 0
  ) {
    return true;
  }

  return false;
}

export function getFilterValueByNameFromURL(key: string, location: any): string[] {
  const searchParams = new URLSearchParams(location.search);

  const filterValue = searchParams.get(key);
  if (!filterValue) {
    return [];
  }
  return filterValue.split(',');
}

export function addQuery(
  queryObj: { [key: string]: string },
  queryParamDefaultObj: { [key: string]: string } = {},
  history: any,
  location: any,
  tableName = '',
  isGlobalFilter: boolean = false
) {
  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);

  if (!!tableName) {
    searchParams.set('tableName', tableName);
  }
  // Ensure that default values will not show up in the URL
  for (const key in queryObj) {
    const value = queryObj[key];
    if (value !== queryParamDefaultObj[key]) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
  }

  if (isGlobalFilter) {
    searchParams.delete('page');
  }

  history.push({
    pathname: pathname,
    search: searchParams.toString(),
  });
}
