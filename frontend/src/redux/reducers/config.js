import { CONFIG_NEW } from '../actions/actions';

export const INITIAL_STATE = {
  clusters: [],
}

function reducer(state = INITIAL_STATE, action) {
  let newState = {...state};
    switch(action.type) {
      case CONFIG_NEW:
        newState.clusters = [...action.config.clusters];
        break;
      default:
        break;
  };

  return newState;
}

export default reducer;
