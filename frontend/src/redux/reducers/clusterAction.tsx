import _ from 'lodash';
import { Action, CLUSTER_ACTION_UPDATE, ClusterAction } from '../actions/actions';

interface ClusterState {
  [id: string]: ClusterAction; // todo: Complete the type.
}

export const INITIAL_STATE: ClusterState = {
  // id: { message, ... } . See the ActionsNotifier.
};

function cluster(clusterActions = INITIAL_STATE, action: ClusterAction & Action) {
  const {type, id, ...actionOptions} = action;
  const newState = {...clusterActions};
  switch (type) {
    case CLUSTER_ACTION_UPDATE:
      if (_.isEmpty(actionOptions)) {
        delete newState[id];
      } else {
        newState[id] = {...(action as ClusterAction)};
      }
      break;

    default:
      break;
  };

  return newState;
}

export default cluster;
