import { TypedUseSelectorHook, useSelector } from 'react-redux';
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

export type RootState = ReturnType<typeof reducers>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default reducers;
