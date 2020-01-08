import _ from 'lodash';
import { CLUSTER_ACTION_UPDATE } from '../actions/actions';

export const INITIAL_STATE = {
  // id: { message, ... } . See the ActionsNotifier.
};

function cluster(clusterActions = INITIAL_STATE, action) {
  const {type, id, ...actionOptions} = action;
  const newState = {...clusterActions};
  switch(type) {
    case CLUSTER_ACTION_UPDATE:
      if (_.isEmpty(actionOptions)) {
        delete newState[id];
      } else {
        newState[id] = {...actionOptions};
      }
      break;

    default:
      break;
  };

  return newState;
}

export default cluster;
