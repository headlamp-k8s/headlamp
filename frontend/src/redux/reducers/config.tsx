import _ from 'lodash';
import { Cluster } from '../../lib/k8s/cluster';
import { Action, CONFIG_CLUSTERS, CONFIG_NEW } from '../actions/actions';

export interface ConfigState {
  clusters: {
    [clusterName: string]: Cluster;
  } | null;
  headless: boolean | null;
}

export const INITIAL_STATE: ConfigState = {
  clusters: null,
  headless: null,
};

export interface ConfigAction extends Action {
  config: {
    clusters: ConfigState['clusters'];
    headless: ConfigState['headless'];
  };
}

function reducer(state = _.cloneDeep(INITIAL_STATE), action: ConfigAction) {
  const newState = { ...state };
  switch (action.type) {
    case CONFIG_NEW:
      newState.clusters = { ...action.config.clusters };
      newState.headless = action.config.headless;
      break;
    case CONFIG_CLUSTERS:
      newState.clusters = { ...action.config.clusters };
      break;
    default:
      break;
  }

  return newState;
}

export default reducer;
