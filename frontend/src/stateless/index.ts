import { indexedDB as indexedDBtest } from 'fake-indexeddb';
import * as jsyaml from 'js-yaml';
import { v4 as uuidv4 } from 'uuid';

/**
 * KubeconfigObject is the object that is stored in indexDB as string format.
 * It is a JSON encoded version of the kubeconfig file.
 * It is used to store the kubeconfig for stateless clusters.
 * This is basically a k8s client - go Kubeconfig object.
 * @see storeStatelessClusterKubeconfig
 * @see getStatelessClusterKubeConfigs
 * @see findKubeconfigByClusterName
 */
interface KubeconfigObject {
  apiVersion: string;
  kind: string;
  clusters: Array<{
    name: string;
    cluster: {
      server: string;
    };
  }>;
  users: Array<{
    name: string;
    user: {};
  }>;
  contexts: Array<{
    name: string;
    context: {
      cluster: string;
      user: string;
    };
  }>;
  'current-context': string;
}

/**
 * Store the kubeconfig for a stateless cluster in IndexedDB.
 * @param kubeconfig - The kubeconfig to store.
 * @returns void
 * @throws Error if IndexedDB is not supported.
 * @throws Error if the kubeconfig is invalid.
 */
export function storeStatelessClusterKubeconfig(kubeconfig: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let request;
    if (process.env.NODE_ENV === 'test') {
      request = indexedDBtest.open('kubeconfigs', 1);
    } else {
      request = indexedDB.open('kubeconfigs', 1);
    }

    request.onupgradeneeded = function (event: any) {
      const db = event.target ? event.target.result : null;
      if (db) {
        if (!db.objectStoreNames.contains('kubeconfigStore')) {
          db.createObjectStore('kubeconfigStore', { keyPath: 'id', autoIncrement: true });
        }
      }
    };

    request.onsuccess = function (event: any) {
      const db = event.target ? event.target.result : null;

      if (db) {
        const transaction = db.transaction(['kubeconfigStore'], 'readwrite');
        const store = transaction.objectStore('kubeconfigStore');

        const newItem = { kubeconfig: kubeconfig };
        const addRequest = store.add(newItem);

        addRequest.onsuccess = function () {
          console.log('Kubeconfig added to IndexedDB');
          resolve(); // Resolve the promise when the kubeconfig is successfully added
        };

        addRequest.onerror = function (event: any) {
          console.error(event.target ? event.target.error : 'An error occurred');
          reject(event.target ? event.target.error : 'An error occurred'); // Reject the promise on error
        };
      } else {
        console.error('Failed to open IndexedDB');
        reject('Failed to open IndexedDB');
      }
    };

    request.onerror = function (event: any) {
      console.error(
        event.target ? event.target.error : 'An error occurred while opening IndexedDB'
      );
      reject(event.target ? event.target.error : 'An error occurred while opening IndexedDB');
    };
  });
}

/**
 * Gets stateless cluster kubeconfigs from IndexedDB.
 * @returns A promise that resolves with the kubeconfigs.
 * @throws Error if IndexedDB is not supported.
 * @throws Error if the kubeconfig is invalid.
 */
export function getStatelessClusterKubeConfigs(): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    let request;
    if (process.env.NODE_ENV === 'test') {
      request = indexedDBtest.open('kubeconfigs', 1);
    } else {
      request = indexedDB.open('kubeconfigs', 1);
    }

    request.onupgradeneeded = function (event: any) {
      const db = event.target ? event.target.result : null;
      // Create the object store if it doesn't exist
      if (db) {
        if (!db.objectStoreNames.contains('kubeconfigStore')) {
          db.createObjectStore('kubeconfigStore', { keyPath: 'id', autoIncrement: true });
        }
      }
    };

    request.onsuccess = function (event: any) {
      const db = event.target ? event.target.result : null;

      if (db) {
        const transaction = db.transaction(['kubeconfigStore'], 'readonly');
        const store = transaction.objectStore('kubeconfigStore');

        const kubeconfigs: string[] = [];

        store.openCursor().onsuccess = function (event: any) {
          const cursor = event.target.result;
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

    request.onerror = function (event: any) {
      reject('Error opening the database: ' + (event.target ? event.target.error : ''));
    };
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
      let request;
      if (process.env.NODE_ENV === 'test') {
        request = indexedDBtest.open('kubeconfigs', 1);
      } else {
        request = indexedDB.open('kubeconfigs', 1);
      }

      request.onupgradeneeded = function (event: any) {
        const db = event.target ? event.target.result : null;
        // Create the object store if it doesn't exist
        if (!db.objectStoreNames.contains('kubeconfigStore')) {
          db.createObjectStore('kubeconfigStore', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = function (event: any) {
        const db = event.target.result;
        const transaction = db.transaction(['kubeconfigStore'], 'readonly');
        const store = transaction.objectStore('kubeconfigStore');

        store.openCursor().onsuccess = function (event: any) {
          const cursor = event.target.result;
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

      request.onerror = function (event: any) {
        console.error('Error opening the database:', event.target.error);
        reject(event.target.error);
      };
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
    headlampUserId = uuidv4();

    if (headlampUserId) {
      localStorage.setItem('headlamp-userId', headlampUserId);
    }
  }

  return headlampUserId!;
}

const exportFunctions = {
  storeStatelessClusterKubeconfig,
  getStatelessClusterKubeConfigs,
  findKubeconfigByClusterName,
  getUserIdFromLocalStorage,
};

export default exportFunctions;
