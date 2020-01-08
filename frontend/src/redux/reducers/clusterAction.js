import { CLUSTER_ACTION_UPDATE } from '../actions/actions';

export const INITIAL_STATE = {
};

function cluster(deletion = INITIAL_STATE, action) {
  const {type, ...actionOptions} = action;
  let newState = {...deletion};
  switch(type) {
    case CLUSTER_ACTION_UPDATE:
      newState = {...actionOptions};
      break;

    default:
      break;
  };

  return newState;
}

export default cluster;
