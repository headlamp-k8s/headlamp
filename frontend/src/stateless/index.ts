import * as jsyaml from 'js-yaml';
import _ from 'lodash';
import { request } from '../lib/k8s/apiProxy';
import { Cluster } from '../lib/k8s/cluster';
import { KubeconfigObject } from '../lib/k8s/kubeconfig';
import { ConfigState, setStatelessConfig } from '../redux/configSlice';
import store from '../redux/stores/store';

let indexedDBtest: any;

// Import 'fake-indexeddb' only in the testing environment
if (process.env.NODE_ENV === 'test') {
  import('fake-indexeddb')
    .then(module => {
      indexedDBtest = module.indexedDB;
    })
    .catch(error => {
      console.error('Error importing fake-indexeddb:', error);
    });
}

/**
 * ParsedConfig is the object that is fetched from the backend.
 * It has cluster information as keys. The values are the same as the KubeconfigObject.
 * @see KubeconfigObject
 * @see fetchStatelessClusterKubeConfigs
 */
interface ParsedConfig {
  [prop: string]: Cluster[];
}

/**
 * DatabaseEvent is the event that is fired when the IndexedDB is upgraded.
 * It is used to create the object store. It is also used to get the result of the
 * IndexedDB open request. The result is the IndexedDB database. It is used to create
 * the transaction and the object store. It is also used to get the result of the
 * IndexedDB add request. The result is the key of the added object.
 * @see storeStatelessClusterKubeconfig
 * @see getStatelessClusterKubeConfigs
 * @see findKubeconfigByClusterName
 */
interface DatabaseEvent extends Event {
  // target is the request that generated the event.
  target: IDBOpenDBRequest & {
    // result is the IndexedDB database. It is used to create the transaction and the object store.
    result: IDBDatabase;
  };
}

/**
 * DatabaseErrorEvent is the event that is fired when the IndexedDB is upgraded.
 * It is used to get the error of the IndexedDB open request. It is also used to get
 * the error of the IndexedDB add request.
 * @see storeStatelessClusterKubeconfig
 * @see getStatelessClusterKubeConfigs
 * @see findKubeconfigByClusterName
 */
interface DatabaseErrorEvent extends Event {
  // target is the request that generated the event.
  target: IDBOpenDBRequest & {
    // error is the error of the request.
    error: DOMException | null;
  };
}

/**
 * CursorSuccessEvent is the event that is fired when the IndexedDB is upgraded.
 * It is used to get the result of the IndexedDB open request. The result is the
 * cursor. It is used to iterate through the object store. It is also used to get
 * the result of the IndexedDB add request. The result is the cursor. It is used to
 * iterate through the object store.
 * @see getStatelessClusterKubeConfigs
 * @see findKubeconfigByClusterName
 * */
interface CursorSuccessEvent extends Event {
  // target is the request that generated the event.
  target: EventTarget & {
    // result is the cursor. It is used to iterate through the object store.
    result: IDBCursorWithValue | null;
  };
}

/** handleDatabaseUpgrade creates the object store if it doesn't exist.
 * this upgrade is only called when the database is created.
 * It is not called when the database is opened.
 * @param event - The event that is fired when the IndexedDB is upgraded.
 * @see storeStatelessClusterKubeconfig
 * @see getStatelessClusterKubeConfigs
 * @see findKubeconfigByClusterName
 * **/
function handleDatabaseUpgrade(event: DatabaseEvent) {
  const db = event.target ? event.target.result : null;
  // Create the object store if it doesn't exist
  if (db && !db.objectStoreNames.contains('kubeconfigStore')) {
    db.createObjectStore('kubeconfigStore', { keyPath: 'id', autoIncrement: true });
  }
}

/** handleDataBaseError handles errors when opening IndexedDB.
 * @param event - The event that is fired when the IndexedDB is upgraded.
 * @see storeStatelessClusterKubeconfig
 * @see getStatelessClusterKubeConfigs
 * @see findKubeconfigByClusterName
 * */

function handleDataBaseError(event: DatabaseErrorEvent, reject: (reason?: any) => void) {
  console.error(event.target ? event.target.error : 'An error occurred while opening IndexedDB');
  reject(event.target ? event.target.error : 'An error occurred while opening IndexedDB');
}

/**
 * Store the kubeconfig for a stateless cluster in IndexedDB.
 * @param kubeconfig - The kubeconfig to store.
 * @returns promise that resolves when the kubeconfig is successfully added.
 * @throws Error if IndexedDB is not supported.
 * @throws Error if the kubeconfig is invalid.
 */
export function storeStatelessClusterKubeconfig(kubeconfig: string): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const request =
      process.env.NODE_ENV === 'test'
        ? indexedDBtest.open('kubeconfigs', 1)
        : indexedDB.open('kubeconfigs', 1);

    // The onupgradeneeded event is fired when the database is created for the first time.
    request.onupgradeneeded = handleDatabaseUpgrade;

    /** The onsuccess event is fired when the database is opened.
     * This event is where you specify the actions to take when the database is opened.
     * Once the database is opened, it creates a transaction and an object store.
     * The transaction is used to add the kubeconfig to the object store.
     * The object store is used to store the kubeconfig.
     * */
    request.onsuccess = function handleDatabaseSuccess(event: DatabaseEvent) {
      const db = event.target ? event.target.result : null;

      if (db) {
        const transaction = db.transaction(['kubeconfigStore'], 'readwrite');
        const store = transaction.objectStore('kubeconfigStore');

        const newItem = { kubeconfig: kubeconfig };
        const addRequest = store.add(newItem);

        // The onsuccess event is fired when the request has succeeded.
        // This is where you handle the results of the request.
        addRequest.onsuccess = function requestSuccess() {
          console.log('Kubeconfig added to IndexedDB');
          resolve(); // Resolve the promise when the kubeconfig is successfully added
        };

        // The onerror event is fired when the request has failed.
        // This is where you handle the error.
        addRequest.onerror = function requestError(event: Event) {
          const errorEvent = event as DatabaseErrorEvent;
          console.error(errorEvent.target ? errorEvent.target.error : 'An error occurred');
          reject(errorEvent.target ? errorEvent.target.error : 'An error occurred'); // Reject the promise on error
        };
      } else {
        console.error('Failed to open IndexedDB');
        reject('Failed to open IndexedDB');
      }
    };

    // The onerror event is fired when the database is opened.
    // This is where you handle errors.
    request.onerror = handleDataBaseError;
  });
}

/**
 * Gets stateless cluster kubeconfigs from IndexedDB.
 * @returns A promise that resolves with the kubeconfigs.
 * @throws Error if IndexedDB is not supported.
 * @throws Error if the kubeconfig is invalid.
 */
export function getStatelessClusterKubeConfigs(): Promise<string[]> {
  return new Promise<string[]>(async (resolve, reject) => {
    const request =
      process.env.NODE_ENV === 'test'
        ? indexedDBtest.open('kubeconfigs', 1)
        : indexedDB.open('kubeconfigs', 1);

    // The onupgradeneeded event is fired when the database is created for the first time.
    request.onupgradeneeded = handleDatabaseUpgrade;

    /** The onsuccess event is fired when the database is opened.
     * This event is where you specify the actions to take when the database is opened.
     * Once the database is opened, it creates a transaction and an object store.
     * It returns all the kubeconfigs from the object store.
     * */
    request.onsuccess = function handleDatabaseSuccess(event: DatabaseEvent) {
      const db = event.target ? event.target.result : null;

      if (db) {
        const transaction = db.transaction(['kubeconfigStore'], 'readonly');
        const store = transaction.objectStore('kubeconfigStore');

        const kubeconfigs: string[] = [];

        /** The onsuccess event is fired when the request has succeeded.
         * This is where you handle the results of the request.
         * The result is the cursor. It is used to iterate through the object store.
         * The cursor is null when there are no more objects to iterate through.
         * */
        store.openCursor().onsuccess = function storeSuccess(event: Event) {
          const successEvent = event as CursorSuccessEvent;
          const cursor = successEvent.target.result;
          if (cursor) {
            kubeconfigs.push(cursor.value.kubeconfig);
            cursor.continue();
          } else {
            // All kubeconfigs have been retrieved
            resolve(kubeconfigs);
          }
        };
      } else {
        reject('Failed to open IndexedDB');
      }
    };

    // The onerror event is fired when the database is opened.
    // This is where you handle errors.
    request.onerror = handleDataBaseError;
  });
}

/**
 * Finds a kubeconfig by cluster name.
 * @param clusterName
 * @returns A promise that resolves with the kubeconfig, or null if not found.
 * @throws Error if IndexedDB is not supported.
 * @throws Error if the kubeconfig is invalid.
 */
export function findKubeconfigByClusterName(clusterName: string): Promise<string | null> {
  return new Promise<string | null>(async (resolve, reject) => {
    try {
      const request =
        process.env.NODE_ENV === 'test'
          ? indexedDBtest.open('kubeconfigs', 1)
          : indexedDB.open('kubeconfigs', 1);

      // The onupgradeneeded event is fired when the database is created for the first time.
      request.onupgradeneeded = handleDatabaseUpgrade;

      // The onsuccess event is fired when the database is opened.
      // This event is where you specify the actions to take when the database is opened.
      request.onsuccess = function handleDatabaseSuccess(event: DatabaseEvent) {
        const db = event.target.result;
        const transaction = db.transaction(['kubeconfigStore'], 'readonly');
        const store = transaction.objectStore('kubeconfigStore');

        // The onsuccess event is fired when the request has succeeded.
        // This is where you handle the results of the request.
        // The result is the cursor. It is used to iterate through the object store.
        // The cursor is null when there are no more objects to iterate through.
        // The cursor is used to find the kubeconfig by cluster name.
        store.openCursor().onsuccess = function storeSuccess(event: Event) {
          const successEvent = event as CursorSuccessEvent;
          const cursor = successEvent.target.result;
          if (cursor) {
            const kubeconfigObject = cursor.value;
            const kubeconfig = kubeconfigObject.kubeconfig;

            const parsedKubeconfig = jsyaml.load(atob(kubeconfig)) as KubeconfigObject;

            const matchingKubeconfig = parsedKubeconfig.clusters.find(
              cluster => cluster.name === clusterName
            );

            if (matchingKubeconfig) {
              resolve(kubeconfig);
            } else {
              cursor.continue();
            }
          } else {
            resolve(null); // No matching kubeconfig found
          }
        };
      };

      // The onerror event is fired when the database is opened.
      // This is where you handle errors.
      request.onerror = handleDataBaseError;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * In the backend we use a unique ID to identify a user. If there is no ID in localStorage
 * we generate a new one and store it in localStorage. We then combine it with the
 * cluster name and this headlamp-userId to create a unique ID for a cluster. If we don't
 * do it then if 2 different users have a cluster with the same name, then the
 * proxy will be overwritten.
 * @returns headlamp-userId from localStorage
 */
export function getUserIdFromLocalStorage(): string {
  let headlampUserId = localStorage.getItem('headlamp-userId');

  if (!headlampUserId) {
    headlampUserId = generateSecureToken();

    if (headlampUserId) {
      localStorage.setItem('headlamp-userId', headlampUserId);
    }
  }

  return headlampUserId!;
}

/**
 * Generates a cryptographically secure random token using the browser's crypto API.
 * @param {number} length - The length of the token.
 * @returns {string} - The generated token.
 */
function generateSecureToken(length = 16): string {
  const buffer = new Uint8Array(length);
  if (process.env.NODE_ENV === 'test') {
    // Use Math.random() in the testing environment
    return Array.from(buffer, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
  window.crypto.getRandomValues(buffer);
  return Array.from(buffer, byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
}

/**
 * Compares the cluster config from the backend and the redux store
 * @param clusters
 * @param clustersToConfig
 * @param isStateless
 * @returns true if the present stored config is different from the fetched one.
 */
export function processClusterComparison(
  clusters: ConfigState['clusters'],
  clustersToConfig: ConfigState['clusters'],
  isStateless: boolean
) {
  if (!clusters) {
    // If no clusters, then add all clusters
    return false;
  }

  if (!clustersToConfig) {
    // If no clustersToConfig, then delete all clusters
    return true;
  }

  let isConfigDifferent = false;

  Object.keys(clustersToConfig).forEach(key => {
    if (!!clusters[key]) {
      let clusterToCompare = clusters[key];

      if (clusterToCompare.useToken !== undefined) {
        clusterToCompare = _.cloneDeep(clusters[key]);
        delete clusterToCompare.useToken;
      }

      if (isStateless) {
        if (_.isEqual(clustersToConfig[key], clusterToCompare)) {
          delete clusters[key];
        }
      } else {
        isConfigDifferent =
          isConfigDifferent || !_.isEqual(clustersToConfig[key], clusterToCompare);
      }
    }
  });

  return isConfigDifferent;
}

/**
 * Parses the cluster config from the backend and updates the redux store
 * if the present stored config is different from the fetched one.
 */
export async function fetchStatelessClusterKubeConfigs(dispatch: any) {
  const config = await getStatelessClusterKubeConfigs();
  const statelessClusters = store.getState().config.statelessClusters;
  const JSON_HEADERS = { Accept: 'application/json', 'Content-Type': 'application/json' };
  const clusterReq = {
    kubeconfigs: config,
  };

  // Parses statelessCluster config
  request(
    '/parseKubeConfig',
    {
      method: 'POST',
      body: JSON.stringify(clusterReq),
      headers: {
        ...JSON_HEADERS,
      },
    },
    false,
    false
  )
    .then((config: ParsedConfig) => {
      const clustersToConfig: ConfigState['statelessClusters'] = {};
      config?.clusters.forEach((cluster: Cluster) => {
        clustersToConfig[cluster.name] = cluster;
      });

      const configToStore = {
        ...config,
        statelessClusters: clustersToConfig,
      };
      if (statelessClusters === null) {
        dispatch(setStatelessConfig({ ...configToStore }));
      } else if (Object.keys(clustersToConfig).length !== Object.keys(statelessClusters).length) {
        dispatch(setStatelessConfig({ ...configToStore }));
      }
    })
    .catch((err: Error) => {
      console.error('Error getting config:', err);
    });
}

/**
 * deleteClusterKubeconfig deletes the kubeconfig for a stateless cluster from indexedDB
 * @param clusterName - The name of the cluster
 * @returns A promise that resolves with the kubeconfig, or null if not found.
 */
export async function deleteClusterKubeconfig(clusterName: string): Promise<string | null> {
  return new Promise<string | null>(async (resolve, reject) => {
    try {
      const request =
        process.env.NODE_ENV === 'test'
          ? indexedDBtest.open('kubeconfigs', 1)
          : indexedDB.open('kubeconfigs', 1);

      // The onupgradeneeded event is fired when the database is created for the first time.
      request.onupgradeneeded = handleDatabaseUpgrade;

      // The onsuccess event is fired when the database is opened.
      // This event is where you specify the actions to take when the database is opened.
      request.onsuccess = function handleDatabaseSuccess(event: DatabaseEvent) {
        const db = event.target.result;
        const transaction = db.transaction(['kubeconfigStore'], 'readwrite');
        const store = transaction.objectStore('kubeconfigStore');

        // The onsuccess event is fired when the request has succeeded.
        // This is where you handle the results of the request.
        // The result is the cursor. It is used to iterate through the object store.
        // The cursor is null when there are no more objects to iterate through.
        // The cursor is used to find the kubeconfig by cluster name.
        store.openCursor().onsuccess = function storeSuccess(event: Event) {
          // delete the kubeconfig by cluster name
          const successEvent = event as CursorSuccessEvent;
          const cursor = successEvent.target.result;
          if (cursor) {
            const kubeconfigObject = cursor.value;
            const kubeconfig = kubeconfigObject.kubeconfig;

            const parsedKubeconfig = jsyaml.load(atob(kubeconfig)) as KubeconfigObject;

            const matchingKubeconfig = parsedKubeconfig.clusters.find(
              cluster => cluster.name === clusterName
            );

            if (matchingKubeconfig) {
              const deleteRequest = store.delete(cursor.key);
              deleteRequest.onsuccess = () => {
                console.log('Kubeconfig deleted from IndexedDB');
                resolve(kubeconfig);
              };
              deleteRequest.onerror = () => {
                console.error('Error deleting kubeconfig from IndexedDB');
                reject('Error deleting kubeconfig from IndexedDB');
              };
            } else {
              cursor.continue();
            }
          } else {
            resolve(null); // No matching kubeconfig found
          }
        };
      };

      // The onerror event is fired when the database is opened.
      // This is where you handle errors.
      request.onerror = handleDataBaseError;
    } catch (error) {
      reject(error);
    }
  });
}

const exportFunctions = {
  storeStatelessClusterKubeconfig,
  getStatelessClusterKubeConfigs,
  findKubeconfigByClusterName,
  getUserIdFromLocalStorage,
  processClusterComparison,
  fetchStatelessClusterKubeConfigs,
  deleteClusterKubeconfig,
};

export default exportFunctions;
