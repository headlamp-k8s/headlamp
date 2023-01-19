import _ from 'lodash';
import { DefaultRowsPerPageOptions } from '../../components/App/settings/config';
import { Cluster } from '../../lib/k8s/cluster';
import { Action, CONFIG_NEW, CONFIG_SET_SETTINGS } from '../actions/actions';

const storedSettings = JSON.parse(localStorage.getItem('settings') || '{}');

export interface ConfigState {
  clusters: {
    [clusterName: string]: Cluster;
  } | null;
  settings: {
    tableRowsPerPageOptions: number[];
    timezone: string;
    [key: string]: any;
  };
}

export const INITIAL_STATE: ConfigState = {
  clusters: null,
  settings: {
    tableRowsPerPageOptions: storedSettings.tableRowsPerPageOptions || DefaultRowsPerPageOptions,
    timezone: storedSettings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
};

export interface ConfigAction extends Action {
  config: {
    clusters: ConfigState['clusters'];
  };
}

function reducer(state = _.cloneDeep(INITIAL_STATE), action: ConfigAction) {
  const newState = { ...state };
  switch (action.type) {
    case CONFIG_NEW: {
      newState.clusters = { ...action.config.clusters };
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
