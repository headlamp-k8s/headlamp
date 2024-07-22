import { getCluster } from '../../cluster';
import { KubeMetadata } from '../cluster';
import { ScaleApi } from './apiTypes';
import { clusterRequest, patch, put } from './clusterRequests';

export function apiScaleFactory(apiRoot: string, resource: string): ScaleApi {
  return {
    get: (namespace: string, name: string, clusterName?: string) => {
      const cluster = clusterName || getCluster() || '';
      return clusterRequest(url(namespace, name), { cluster });
    },
    put: (body: { metadata: KubeMetadata; spec: { replicas: number } }, clusterName?: string) => {
      const cluster = clusterName || getCluster() || '';
      return put(url(body.metadata.namespace!, body.metadata.name), body, undefined, { cluster });
    },
    patch: (
      body: {
        spec: {
          replicas: number;
        };
      },
      metadata: KubeMetadata,
      clusterName?: string
    ) => {
      const cluster = clusterName || getCluster() || '';
      return patch(url(metadata.namespace!, metadata.name), body, false, { cluster });
    },
  };

  function url(namespace: string, name: string) {
    return `${apiRoot}/namespaces/${namespace}/${resource}/${name}/scale`;
  }
}
