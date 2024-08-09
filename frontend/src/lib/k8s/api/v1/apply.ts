import _ from 'lodash';
import { getCluster } from '../../../cluster';
import { KubeObjectInterface } from '../../cluster';
import { ApiError } from './apiTypes';
import { getClusterDefaultNamespace } from './clusterApi';
import { resourceDefToApiFactory } from './factories';

/**
 * Applies the provided body to the Kubernetes API.
 *
 * Tries to POST, and if there's a conflict it does a PUT to the api endpoint.
 *
 * @param body - The kubernetes object body to apply.
 * @param clusterName - The cluster to apply the body to. By default uses the current cluster (URL defined).
 *
 * @returns The response from the kubernetes API server.
 */
export async function apply<T extends KubeObjectInterface>(
  body: T,
  clusterName?: string
): Promise<T> {
  const bodyToApply = _.cloneDeep(body);

  let apiEndpoint;
  try {
    apiEndpoint = await resourceDefToApiFactory(bodyToApply, clusterName);
  } catch (err) {
    console.error(`Error getting api endpoint when applying the resource ${bodyToApply}: ${err}`);
    throw err;
  }

  const cluster = clusterName || getCluster();

  // Check if the default namespace is needed. And we need to do this before
  // getting the apiEndpoint because it will affect the endpoint itself.
  const isNamespaced = apiEndpoint.isNamespaced;
  const { namespace } = body.metadata;
  if (!namespace && isNamespaced) {
    let defaultNamespace = 'default';

    if (!!cluster) {
      defaultNamespace = getClusterDefaultNamespace(cluster) || 'default';
    }

    bodyToApply.metadata.namespace = defaultNamespace;
  }

  const resourceVersion = bodyToApply.metadata.resourceVersion;

  try {
    delete bodyToApply.metadata.resourceVersion;
    return await apiEndpoint.post(bodyToApply, {}, cluster!);
  } catch (err) {
    // Check to see if failed because the record already exists.
    // If the failure isn't a 409 (i.e. Confilct), just rethrow.
    if ((err as ApiError).status !== 409) throw err;

    // Preserve the resourceVersion if its an update request
    bodyToApply.metadata.resourceVersion = resourceVersion;
    // We had a conflict. Try a PUT
    return apiEndpoint.put(bodyToApply, {}, cluster!) as Promise<T>;
  }
}
