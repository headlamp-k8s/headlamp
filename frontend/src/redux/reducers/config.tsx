import _ from 'lodash';
import { Cluster } from '../../lib/k8s/cluster';
import { Action, CONFIG_NEW } from '../actions/actions';

export interface ConfigState {
  clusters: {
    [clusterName: string]: Cluster;
  } | null;
}

export const INITIAL_STATE: ConfigState = {
  clusters: null,
};

export interface ConfigAction extends Action {
  config: {
    clusters: ConfigState['clusters'];
  };
}

function reducer(state = _.cloneDeep(INITIAL_STATE), action: ConfigAction) {
  const newState = { ...state };
  switch (action.type) {
    case CONFIG_NEW:
      newState.clusters = { ...action.config.clusters };
      break;
    default:
      break;
  }

  return newState;
}

export default reducer;
