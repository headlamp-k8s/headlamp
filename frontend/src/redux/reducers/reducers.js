import { combineReducers } from 'redux';
import clusterAction from './clusterAction';
import filter from './filter';

const reducers = combineReducers({
  filter: filter,
  clusterAction: clusterAction,
});

export default reducers;
