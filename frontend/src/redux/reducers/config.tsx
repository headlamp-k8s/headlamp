import { Action, CONFIG_NEW } from '../actions/actions';

export interface Cluster {
  name: string;
  [propName: string]: any;
}

interface ConfigState {
  clusters: Cluster[];
}

export const INITIAL_STATE: ConfigState = {
  clusters: [],
};

function reducer(state = INITIAL_STATE, action: Action) {
  const newState = {...state};
  switch (action.type) {
    case CONFIG_NEW:
      newState.clusters = [...action.config.clusters];
      break;
    default:
      break;
  };

  return newState;
}

export default reducer;
