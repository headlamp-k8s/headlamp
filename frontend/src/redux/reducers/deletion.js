import { CLUSTER_OBJECTS_DELETED, CLUSTER_OBJECTS_DELETE_CANCELLED, CLUSTER_OBJECTS_DELETE_START } from '../actions/actions';

export const INITIAL_STATE = {
  items: [],
  status: '',
  url: null,
}

function cluster(deletion = INITIAL_STATE, action) {
  let newState = {...deletion};
  switch(action.type) {
    case CLUSTER_OBJECTS_DELETE_START:
      newState.status = 'start';
      break;
    case CLUSTER_OBJECTS_DELETED:
      // Set success or reset status.
      newState.status = action.items.length > 0 ? 'success' : '';
      break;
    case CLUSTER_OBJECTS_DELETE_CANCELLED:
      newState.status = 'cancelled';
      break;

    default:
      break;
  };

  if (action.items !== undefined) {
    newState.items = action.items;
  }

  newState.url = action.url || null;

  return newState;
}

export default cluster;
