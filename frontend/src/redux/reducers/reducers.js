import { combineReducers } from 'redux';
import clusterAction from './clusterAction';
import config from './config';
import filter from './filter';
import uiReducer from './ui';

const reducers = combineReducers({
  filter: filter,
  ui: uiReducer,
  clusterAction: clusterAction,
  config: config,
});

export default reducers;
