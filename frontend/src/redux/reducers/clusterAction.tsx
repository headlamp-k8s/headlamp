import _ from 'lodash';
import { Action, CLUSTER_ACTION_UPDATE } from '../actions/actions';

interface ClusterState {
  [id: string]: any; // todo: Complete the type.
}

export const INITIAL_STATE: ClusterState = {
  // id: { message, ... } . See the ActionsNotifier.
};

function cluster(clusterActions = INITIAL_STATE, action: Action) {
  const {type, id, ...actionOptions} = action;
  const newState = {...clusterActions};
  switch (type) {
    case CLUSTER_ACTION_UPDATE:
      if (_.isEmpty(actionOptions)) {
        delete newState[id as string];
      } else {
        newState[id as string] = {...actionOptions};
      }
      break;

    default:
      break;
  };

  return newState;
}

export default cluster;
