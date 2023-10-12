import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { combineReducers } from 'redux';
import pluginsReducer from '../../plugin/pluginsSlice';
import actionButtons from '../actionButtonsSlice';
import configReducer from '../configSlice';
import detailsViewSectionsSlice from '../detailsViewSectionsSlice';
import filterReducer from '../filterSlice';
import clusterAction from './clusterAction';
import uiReducer from './ui';

const reducers = combineReducers({
  filter: filterReducer,
  ui: uiReducer,
  clusterAction: clusterAction,
  config: configReducer,
  plugins: pluginsReducer,
  actionButtons: actionButtons,
  detailsViewSections: detailsViewSectionsSlice,
});

export type RootState = ReturnType<typeof reducers>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default reducers;
