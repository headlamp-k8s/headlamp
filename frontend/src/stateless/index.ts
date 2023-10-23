import * as jsyaml from 'js-yaml';
import { v4 as uuidv4 } from 'uuid';

/**
 * KubeconfigObject is the object that is stored in sessionStorage.
 * It is a JSON encoded version of the kubeconfig file.
 * It is used to store the kubeconfig for stateless clusters.
 * This is basically a k8s client-go Kubeconfig object.
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
 * Export function to store cluster kubeconfig
 * @param kubeconfig - kubeconfig file to store in sessionStorage
 */
export function storeStatelessClusterKubeconfig(kubeconfig: string) {
  // Get existing stored cluster kubeconfigs
  const storedClusterKubeconfigsJSON = sessionStorage.getItem('clusterKubeconfigs');

  let storedClusterKubeconfigs: string[] = [];
  if (storedClusterKubeconfigsJSON) {
    storedClusterKubeconfigs = JSON.parse(storedClusterKubeconfigsJSON);
  }

  // Check if the kubeconfig is not already in the array, then add it
  if (!storedClusterKubeconfigs.includes(kubeconfig)) {
    storedClusterKubeconfigs.push(kubeconfig);
  }

  // Store the updated cluster kubeconfigs back in sessionStorage
  sessionStorage.setItem('clusterKubeconfigs', JSON.stringify(storedClusterKubeconfigs));
}

/**
 * Export function to get stored cluster kubeconfigs
 * @returns stored cluster kubeconfigs
 */
export function getStatelessClusterKubeConfigs(): string[] {
  // Get stored cluster kubeconfigs
  const storedClusterKubeconfigsJSON = sessionStorage.getItem('clusterKubeconfigs');

  if (storedClusterKubeconfigsJSON) {
    const storedClusterKubeconfigs: string[] = JSON.parse(storedClusterKubeconfigsJSON);

    return storedClusterKubeconfigs;
  }

  return [];
}

/**
 * Export function to find kubeconfig by cluster name
 * @param clusterName - cluster name to find kubeconfig for
 * @returns kubeconfig for the cluster
 * @returns null if kubeconfig not found
 */
export function findKubeconfigByClusterName(clusterName: string) {
  // Get stored cluster kubeconfigs
  const storedClusterKubeconfigsJSON = sessionStorage.getItem('clusterKubeconfigs');

  if (storedClusterKubeconfigsJSON) {
    const storedClusterKubeconfigs: string[] = JSON.parse(storedClusterKubeconfigsJSON);

    // Check each kubeconfig for the target clusterName
    for (const kubeconfig of storedClusterKubeconfigs) {
      const kubeconfigObject = jsyaml.load(atob(kubeconfig)) as KubeconfigObject;

      // Check if the kubeconfig contains a cluster with the target clusterName
      const matchingKubeconfig = kubeconfigObject.clusters.find(
        cluster => cluster.name === clusterName
      );
      if (matchingKubeconfig) {
        // Encode the kubeconfig back to base64 if needed
        const encodedKubeconfig = btoa(JSON.stringify(kubeconfigObject));
        return encodedKubeconfig;
      }
    }
  }

  return null; // If not found
}

/**
 * In the backend we use a unique ID to identify a user. We combine it with the
 * cluster name and this headlamp-userId to create a unique ID for a cluster. If we don't
 * do it then if 2 different users have a cluster with the same name, then the
 * proxy will be overwritten.
 * @returns headlamp-userId from sessionStorage
 */
export function getUserId(): string {
  // Retrieve headlamp-userId ID from sessionStorage
  let headlampUserId = sessionStorage.getItem('headlamp-userId');

  // If no headlampUserId ID exists, generate one
  if (!headlampUserId) {
    headlampUserId = uuidv4();

    if (headlampUserId) {
      // Store headlampUserId in sessionStorage
      sessionStorage.setItem('headlamp-userId', headlampUserId);
    }
  }

  return headlampUserId!;
}

const exportFunctions = {
  storeStatelessClusterKubeconfig,
  getStatelessClusterKubeConfigs,
  findKubeconfigByClusterName,
  getUserId,
};

export default exportFunctions;
