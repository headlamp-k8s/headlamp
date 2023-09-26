import _ from 'lodash';
import { Cluster } from '../../lib/k8s/cluster';
import { Action, CONFIG_NEW, CONFIG_SET_SETTINGS, CONFIG_STATELESS_NEW } from '../actions/actions';

const storedSettings = JSON.parse(localStorage.getItem('settings') || '{}');

export interface ConfigState {
  clusters: {
    [clusterName: string]: Cluster;
  } | null;
  statelessClusters: {
    [clusterName: string]: Cluster;
  } | null;
  allClusters: {
    [clusterName: string]: Cluster;
  } | null;
  isDynamicEnabled: boolean;
  settings: {
    tableRowsPerPageOptions: number[];
    timezone: string;
    [key: string]: any;
  };
}

export const defaultTableRowsPerPageOptions = [15, 25, 50];

function defaultTimezone() {
  return process.env.UNDER_TEST ? 'UTC' : Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export const INITIAL_STATE: ConfigState = {
  clusters: null,
  statelessClusters: null,
  allClusters: null,
  isDynamicEnabled: true,
  settings: {
    tableRowsPerPageOptions:
      storedSettings.tableRowsPerPageOptions || defaultTableRowsPerPageOptions,
    timezone: storedSettings.timezone || defaultTimezone(),
  },
};

export interface ConfigAction extends Action {
  config: {
    clusters: ConfigState['clusters'];
    statelessClusters: ConfigState['statelessClusters'];
    allClusters: ConfigState['allClusters'];
  };
}

function reducer(state = _.cloneDeep(INITIAL_STATE), action: ConfigAction) {
  const newState = { ..._.cloneDeep(state) };
  switch (action.type) {
    case CONFIG_NEW: {
      newState.clusters = { ...action.config.clusters };
      break;
    }
    case CONFIG_STATELESS_NEW: {
      newState.statelessClusters = { ...action.config.statelessClusters };
      break;
    }
    case CONFIG_SET_SETTINGS: {
      const keys = Object.keys(action.settings);
      keys.forEach(key => {
        if (Object.keys(newState.settings).includes(key)) {
          newState.settings[key] = action.settings[key];
        }
      });
      localStorage.setItem('settings', JSON.stringify(newState.settings));
      break;
    }
    default:
      break;
  }

  return newState;
}

export default reducer;
