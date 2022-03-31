import { ApiError } from '../../lib/k8s/apiProxy';
import { KubeObject, KubeObjectInterface } from '../../lib/k8s/cluster';
import { getCluster } from '../../lib/util';

export const K8S_API_LIST_RESOURCE = 'K8S_API_LIST_RESOURCE';
export const K8S_API_SET_RESOURCE_LIST = 'K8S_API_SET_RESOURCE_LIST';
export const K8S_API_DROP_LIST_RESOURCE = 'K8S_API_DROP_LIST_RESOURCE';

export type K8sApiAction = K8sApiResourceAction | K8sApiResourceListAction;

export interface K8sApiResourceAction {
  type: string;
  clusterName: string;
  resourceClass: KubeObject;
}

export interface K8sApiResourceListAction {
  type: string;
  clusterName: string;
  resourceClass: KubeObject;
  list: KubeObjectInterface[];
  timestamp: Date | string;
  error?: null | ApiError;
}

export function k8sListAction(resourceClass: KubeObject) {
  const clusterName = getCluster();
  return {
    type: K8S_API_LIST_RESOURCE,
    clusterName,
    resourceClass,
  };
}

export function k8sDropListAction(resourceClass: KubeObject) {
  const clusterName = getCluster();
  return {
    type: K8S_API_DROP_LIST_RESOURCE,
    clusterName,
    resourceClass,
  };
}
