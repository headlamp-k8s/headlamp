import { Cluster } from '../lib/k8s/cluster';
import { Notification } from '../lib/notification';

/**
 * Determines whether app is running in electron environment.
 * Note: The isElectron code (Licence: MIT) is taken from
 *   https://github.com/cheton/is-electron/blob/master/index.js
 */
function isElectron(): boolean {
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
  return filterValue.split(' ');
}

export function addQuery(
  queryObj: { [key: string]: string },
  queryParamDefaultObj: { [key: string]: string } = {},
  history: any,
  location: any,
  tableName = ''
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

  history.push({
    pathname: pathname,
    search: searchParams.toString(),
  });
}

/**
 * @returns true if the app is in development mode.
 */
function isDevMode(): boolean {
  return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

/**
 * @returns URL depending on dev-mode/electron, base-url, and window.location.origin.
 *
 * @example isDevMode | isElectron returns 'http://localhost:4466/'
 * @example base-url set as '/headlamp' returns '/headlamp/'
 * @example isDevMode | isElectron and base-url is set
 *          it returns 'http://localhost:4466/headlamp/'
 * @example returns 'https://headlamp.example.com/'using the window.location.origin of browser
 *
 */
function getAppUrl(): string {
  let url =
    exportFunctions.isDevMode() || exportFunctions.isElectron()
      ? 'http://localhost:4466'
      : window.location.origin;

  const baseUrl = exportFunctions.getBaseUrl();
  url += baseUrl ? baseUrl + '/' : '/';

  return url;
}

declare global {
  interface Window {
    headlampBaseUrl?: string;
    Buffer: typeof Buffer;
  }
}

/**
 * @returns the baseUrl for the app based on window.headlampBaseUrl or process.env.PUBLIC_URL
 *
 * This could be either '' meaning /, or something like '/headlamp'.
 */
function getBaseUrl(): string {
  let baseUrl = '';
  if (exportFunctions.isElectron()) {
    return '';
  }
  if (window?.headlampBaseUrl !== undefined) {
    baseUrl = window.headlampBaseUrl;
  } else {
    baseUrl = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';
  }

  if (baseUrl === './' || baseUrl === '.' || baseUrl === '/') {
    baseUrl = '';
  }
  return baseUrl;
}
function getAppVersion() {
  return localStorage.getItem('app_version');
}

function setAppVersion(value: string) {
  localStorage.setItem('app_version', value);
}

const recentClustersStorageKey = 'recent_clusters';

function setRecentCluster(cluster: Cluster) {
  const currentClusters = getRecentClusters().filter(name => name !== cluster.name);
  const newClusters = [cluster.name, ...currentClusters].slice(0, 3);
  localStorage.setItem(recentClustersStorageKey, JSON.stringify(newClusters));
}

function getRecentClusters() {
  const currentClustersStr = localStorage.getItem(recentClustersStorageKey) || '[]';
  return JSON.parse(currentClustersStr) as string[];
}

const tablesRowsPerPageKey = 'tables_rows_per_page';

function getTablesRowsPerPage(defaultRowsPerPage: number = 5) {
  const perPageStr = localStorage.getItem(tablesRowsPerPageKey);
  if (!perPageStr) {
    return defaultRowsPerPage;
  }

  return parseInt(perPageStr);
}

function setTablesRowsPerPage(perPage: number) {
  localStorage.setItem(tablesRowsPerPageKey, perPage.toString());
}

function getVersion() {
  return {
    VERSION: process.env.REACT_APP_HEADLAMP_VERSION,
    GIT_VERSION: process.env.REACT_APP_HEADLAMP_GIT_VERSION,
  };
}

function getProductName() {
  return process.env.REACT_APP_HEADLAMP_PRODUCT_NAME;
}

const defaultMaxNotificationsStored = 200;
type NotificationStoreOptions = {
  max?: number;
};
function storeNotifications(notifications: Notification[], options: NotificationStoreOptions = {}) {
  const { max = defaultMaxNotificationsStored } = options;
  localStorage.setItem('notifications', JSON.stringify(notifications.slice(0, max)));
}

function loadNotifications(): Notification[] {
  return JSON.parse(localStorage.getItem('notifications') || '[]');
}

const exportFunctions = {
  getBaseUrl,
  isDevMode,
  getAppUrl,
  isElectron,
  getAppVersion,
  setAppVersion,
  setRecentCluster,
  getRecentClusters,
  getTablesRowsPerPage,
  setTablesRowsPerPage,
  getVersion,
  getProductName,
  storeNotifications,
  loadNotifications,
  defaultMaxNotificationsStored,
};

export default exportFunctions;
