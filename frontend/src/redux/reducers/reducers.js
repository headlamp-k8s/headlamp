import { combineReducers } from 'redux';
import clusterAction from './clusterAction';
import filter from './filter';
import uiReducer from './ui';

const reducers = combineReducers({
  filter: filter,
  ui: uiReducer,
  clusterAction: clusterAction,
});

export default reducers;
