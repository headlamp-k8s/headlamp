import _ from 'lodash';
import { ClusterChooserType } from '../../plugin/registry';
import {
  Action,
  FunctionsToOverride,
  UI_FUNCTIONS_OVERRIDE,
  UI_HIDE_APP_BAR,
  UI_INITIALIZE_PLUGIN_VIEWS,
  UI_SET_CLUSTER_CHOOSER_BUTTON,
  UI_VERSION_DIALOG_OPEN,
} from '../actions/actions';

export interface UIState {
  isVersionDialogOpen: boolean;
  clusterChooserButtonComponent?: ClusterChooserType;
  hideAppBar?: boolean;
  functionsToOverride: FunctionsToOverride;
}

export const INITIAL_STATE: UIState = {
  isVersionDialogOpen: false,
  hideAppBar: false,
  functionsToOverride: {},
};

function reducer(state = _.cloneDeep(INITIAL_STATE), action: Action) {
  const newFilters = { ..._.cloneDeep(state) };

  switch (action.type) {
    case UI_HIDE_APP_BAR: {
      newFilters.hideAppBar = action.hideAppBar;
      break;
    }
    case UI_INITIALIZE_PLUGIN_VIEWS: {
      const newState = _.cloneDeep(INITIAL_STATE);
      return newState;
    }
    case UI_SET_CLUSTER_CHOOSER_BUTTON: {
      const component = action.component;
      newFilters.clusterChooserButtonComponent = component;
      break;
    }
    case UI_VERSION_DIALOG_OPEN: {
      newFilters.isVersionDialogOpen = action.isVersionDialogOpen;
      break;
    }
    case UI_FUNCTIONS_OVERRIDE: {
      const functionToOverride = action.override;
      for (const key in functionToOverride) {
        if (functionToOverride.hasOwnProperty(key)) {
          newFilters.functionsToOverride[key] = functionToOverride[key];
        }
      }
      break;
    }
    default:
      return state;
  }

  return newFilters;
}

export default reducer;
