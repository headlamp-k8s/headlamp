import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { combineReducers } from 'redux';
import notificationsReducer from '../../components/App/Notifications/notificationsSlice';
import themeReducer from '../../components/App/themeSlice';
import pluginsReducer from '../../plugin/pluginsSlice';
import actionButtons from '../actionButtonsSlice';
import clusterAction from '../clusterActionSlice';
import configReducer from '../configSlice';
import filterReducer from '../filterSlice';
import routesReducer from '../routesSlice';
import resourceTableReducer from './../../components/common/Resource/resourceTableSlice';
import detailsViewSectionReducer from './../../components/DetailsViewSection/detailsViewSectionSlice';
import sidebarReducer from './../../components/Sidebar/sidebarSlice';
import uiReducer from './ui';

const reducers = combineReducers({
  filter: filterReducer,
  ui: uiReducer,
  clusterAction: clusterAction,
  config: configReducer,
  plugins: pluginsReducer,
  actionButtons: actionButtons,
  notifications: notificationsReducer,
  theme: themeReducer,
  resourceTable: resourceTableReducer,
  detailsViewSection: detailsViewSectionReducer,
  routes: routesReducer,
  sidebar: sidebarReducer,
});

export type RootState = ReturnType<typeof reducers>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default reducers;
