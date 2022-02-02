import _ from 'lodash';
import { ApiError } from '../../lib/k8s/apiProxy';
import { KubeObject, KubeObjectInterface } from '../../lib/k8s/cluster';
import { K8S_API_SET_RESOURCE_LIST, K8sApiAction, K8sApiResourceListAction } from '../actions/api';

export interface ApiState {
  [clusterName: string]: {
    [resourceClass: string]: {
      list: {
        [resourceName: string]: KubeObject;
      } | null;
      error?: ApiError | null;
    };
  };
}

export const INITIAL_STATE: ApiState = {};

function reducer(state = _.cloneDeep(INITIAL_STATE), action: K8sApiAction) {
  const newFilters = { ...state };
  switch (action.type) {
    case K8S_API_SET_RESOURCE_LIST: {
      const listAction = action as K8sApiResourceListAction;
      const newList: {
        [resourceName: string]: KubeObjectInterface;
      } = {};

      if (listAction.error) {
        listAction.list.forEach((item: KubeObject) => {
          newList[`${item.metadata.namespace || '-'}/${item.metadata.name}`] = item;
        });
      }

      if (!newFilters[action.clusterName]) {
        newFilters[action.clusterName] = {};
      }

      newFilters[action.clusterName][action.resourceClass] = {
        error: listAction.error,
        list: listAction.list,
      };

      break;
    }
    default:
      return state;
  }

  return newFilters;
}

export default reducer;
