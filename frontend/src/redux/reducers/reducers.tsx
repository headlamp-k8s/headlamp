import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { combineReducers } from 'redux';
import api from './api';
import clusterAction from './clusterAction';
import config from './config';
import filter from './filter';
import uiReducer from './ui';

const reducers = combineReducers({
  filter,
  ui: uiReducer,
  clusterAction,
  config,
  api,
});

export type RootState = ReturnType<typeof reducers>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default reducers;
