import { test, expect } from "@playwright/test";
import { HeadlampPage } from './headlampPage';
const yaml = require('yaml');
const fs = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);

test('Store modified kubeconfig to IndexDB and check if present', async ({ page }) => {
  const headlampPage = new HeadlampPage(page);

  await headlampPage.authenticate();
  await page.waitForLoadState('load');

  const base64EncodedKubeconfig = await getBase64EncodedKubeconfig(page);
  await saveKubeconfigToIndexDB(page, base64EncodedKubeconfig);
  await page.waitForLoadState('load');

  const storedKubeconfig = await getKubeconfigFromIndexDB(page);
  await page.waitForLoadState('load');

  expect(storedKubeconfig).not.toBeNull();
});

test('check test is present in cluster and working', async ({ page }) => {
  const headlampPage = new HeadlampPage(page);

  await headlampPage.authenticate();
  await page.waitForLoadState('load');

  const base64EncodedKubeconfig = await getBase64EncodedKubeconfig(page);
  await saveKubeconfigToIndexDB(page, base64EncodedKubeconfig);
  await page.waitForLoadState('load');

  const storedKubeconfig = await getKubeconfigFromIndexDB(page);
  await page.waitForLoadState('load');

  expect(storedKubeconfig).not.toBeNull();

  await headlampPage.navigateTopage('/c/test');
  await headlampPage.pageLocatorContent('h2:has-text("Overview")', 'Overview');
});

const getBase64EncodedKubeconfig = async (page) => {
  // Use kubectl command-line tool to get the kubeconfig
  const { stdout, stderr } = await exec('kubectl config view --output json');
  if (stderr) {
    console.error('Error fetching Minikube kubeconfig:', stderr);
    return;
  }

  // Parse the kubeconfig JSON
  const kubeconfig = JSON.parse(stdout);
  // Update the existing cluster and context names to "test"
  kubeconfig.clusters[0].name = 'test';
  kubeconfig.clusters[0].cluster.server = 'https://10.96.0.1:443';
  kubeconfig.contexts[0].name = 'test';
  kubeconfig.users[0].name = 'test';
  kubeconfig.contexts[0].context.user = 'test';
  kubeconfig.contexts[0].context.cluster = 'test';

  // Get the contents of certificate-authority file and convert to base64
  const caFilePath = kubeconfig.clusters[0].cluster['certificate-authority'];
  const caFileContent = await fs.readFile(caFilePath, 'utf-8');
  kubeconfig.clusters[0].cluster['certificate-authority-data'] = Buffer.from(caFileContent).toString('base64');

  // Get the contents of client-certificate file and convert to base64
  const clientCertFilePath = kubeconfig.users[0].user['client-certificate'];
  const clientCertFileContent = await fs.readFile(clientCertFilePath, 'utf-8');
  kubeconfig.users[0].user['client-certificate-data'] = Buffer.from(clientCertFileContent).toString('base64');

  // Get the contents of client-key file and convert to base64
  const clientKeyFilePath = kubeconfig.users[0].user['client-key'];
  const clientKeyFileContent = await fs.readFile(clientKeyFilePath, 'utf-8');
  kubeconfig.users[0].user['client-key-data'] = Buffer.from(clientKeyFileContent).toString('base64');

  // Remove client-key, client-certificate, and certificate-authority keys
  delete kubeconfig.users[0].user['client-key'];
  delete kubeconfig.users[0].user['client-certificate'];
  delete kubeconfig.clusters[0].cluster['certificate-authority'];

  // Set the current context to "minikubetest"
  kubeconfig['current-context'] = 'test';

  // Convert JSON back to YAML
  const kubeconfigYaml = yaml.stringify(kubeconfig);

  return Buffer.from(kubeconfigYaml).toString('base64');
};

const saveKubeconfigToIndexDB = async (page, base64EncodedKubeconfig) => {
  await page.evaluate((base64EncodedKubeconfig) => {
    // Open or create an IndexDB database
    const request = indexedDB.open('kubeconfigs', 1);

    // Handle database creation or upgrade
    request.onupgradeneeded = function (event: any) {
      const db = event.target ? event.target.result : null;
      // Create the object store if it doesn't exist
      if (!db.objectStoreNames.contains('kubeconfigStore')) {
        db.createObjectStore('kubeconfigStore', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(['kubeconfigStore'], 'readwrite');
      const store = transaction.objectStore('kubeconfigStore');

      // Add the base64 encoded kubeconfig to the IndexDB store
      const addRequest = store.add({ kubeconfig: base64EncodedKubeconfig });

      // Handle the success or failure of the add operation
      addRequest.onsuccess = () => {
        console.log('Kubeconfig added to IndexDB');
      };

      addRequest.onerror = () => {
        console.error('Error adding kubeconfig to IndexDB');
      };

      // Close the database when done
      transaction.oncomplete = () => {
        db.close();
      };
    };

    request.onerror = function (event: any) {
      console.error('Error opening the database:', event.target.error);
      return event.target.error;
    };
  }, base64EncodedKubeconfig);
};

const getKubeconfigFromIndexDB = async (page) => {
  const storedKubeconfig = await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('kubeconfigs', 1);

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(['kubeconfigStore'], 'readwrite');
        const store = transaction.objectStore('kubeconfigStore');

        const getRequest = store.getAll();

        getRequest.onsuccess = () => {
          const storedItems = getRequest.result;
          if (storedItems.length > 0) {
            resolve(storedItems[0].kubeconfig);
          } else {
            resolve(null);
          }
        };

        getRequest.onerror = () => {
          reject('Error getting kubeconfig from IndexDB');
        };

        transaction.oncomplete = () => {
          db.close();
        };
      };

      request.onerror = (event: any) => {
        reject(`Error opening the database: ${event.target.error}`);
      };
    });
  });

  return storedKubeconfig;
};
