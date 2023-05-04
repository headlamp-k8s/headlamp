import { OptionsObject as SnackbarProps } from 'notistack';
import { ReactElement, ReactNode } from 'react';
import { AppLogoType } from '../../components/App/AppLogo';
import { ClusterChooserType } from '../../components/cluster/ClusterChooser';
import { DetailsViewSectionType } from '../../components/DetailsViewSection';
import { SidebarEntryProps } from '../../components/Sidebar';
import { KubeObject } from '../../lib/k8s/cluster';
import { Notification } from '../../lib/notification';
import { Route } from '../../lib/router';
import { UIState } from '../reducers/ui';

export const FILTER_RESET = 'FILTER_RESET';
export const FILTER_SET_NAMESPACE = 'FILTER_SET_NAMESPACE';
export const FILTER_SET_SEARCH = 'FILTER_SET_SEARCH';
export const CLUSTER_ACTION = 'CLUSTER_ACTION';
export const CLUSTER_ACTION_UPDATE = 'CLUSTER_ACTION_UPDATE';
export const CLUSTER_ACTION_CANCEL = 'CLUSTER_ACTION_CANCEL';
export const CONFIG_NEW = 'CONFIG_NEW';
export const UI_SIDEBAR_SET_SELECTED = 'UI_SIDEBAR_SET_SELECTED';
export const UI_SIDEBAR_SET_VISIBLE = 'UI_SIDEBAR_SET_VISIBLE';
export const UI_SIDEBAR_SET_ITEM = 'UI_SIDEBAR_SET_ITEM';
export const UI_SIDEBAR_SET_ITEM_FILTER = 'UI_SIDEBAR_SET_ITEM_FILTER';
export const UI_SIDEBAR_SET_EXPANDED = 'UI_SIDEBAR_SET_EXPANDED';
export const UI_ROUTER_SET_ROUTE = 'UI_ROUTER_SET_ROUTE';
export const UI_ROUTER_SET_ROUTE_FILTER = 'UI_ROUTER_SET_ROUTE_FILTER';
export const UI_DETAILS_VIEW_SET_HEADER_ACTION = 'UI_DETAILS_VIEW_SET_HEADER_ACTION';
export const UI_DETAILS_VIEW_ADD_HEADER_ACTIONS_PROCESSOR =
  'UI_DETAILS_VIEW_ADD_HEADER_ACTIONS_PROCESSOR';
export const UI_SET_DETAILS_VIEW = 'UI_SET_DETAILS_VIEW';
export const UI_APP_BAR_SET_ACTION = 'UI_APP_BAR_SET_ACTION';
export const UI_THEME_SET = 'UI_THEME_SET';
export const UI_INITIALIZE_PLUGIN_VIEWS = 'UI_INITIALIZE_PLUGIN_VIEWS';
export const UI_PLUGINS_LOADED = 'UI_PLUGINS_LOADED';
export const UI_VERSION_DIALOG_OPEN = 'UI_VERSION_DIALOG_OPEN';
export const UI_BRANDING_SET_APP_LOGO = 'UI_BRANDING_SET_APP_LOGO';
export const UI_SET_CLUSTER_CHOOSER_BUTTON = 'UI_SET_CLUSTER_CHOOSER_BUTTON';
export const UI_HIDE_APP_BAR = 'UI_HIDE_APP_BAR';
export const UI_FUNCTIONS_OVERRIDE = 'UI_FUNCTIONS_OVERRIDE';
export const CONFIG_SET_SETTINGS = 'CONFIG_SET_SETTINGS';

export interface BrandingProps {
  logo: AppLogoType;
}
export const UI_SET_NOTIFICATIONS = 'UI_SET_NOTIFICATIONS';
export const UI_UPDATE_NOTIFICATION = 'UI_UPDATE_NOTIFICATION';

export interface ClusterActionButton {
  label: string;
  actionToDispatch: string;
}

export interface ClusterAction {
  id: string;
  key?: string;
  message?: string;
  url?: string;
  buttons?: ClusterActionButton[];
  dismissSnackbar?: string;
  snackbarProps?: SnackbarProps;
}

export interface CallbackAction extends CallbackActionOptions {
  callback: (...args: any[]) => void;
}

export interface CallbackActionOptions {
  startUrl?: string;
  cancelUrl?: string;
  errorUrl?: string;
  successUrl?: string;
  startMessage?: string;
  cancelledMessage?: string;
  errorMessage?: string;
  successMessage?: string;
  startOptions?: SnackbarProps;
  cancelledOptions?: SnackbarProps;
  successOptions?: SnackbarProps;
  errorOptions?: SnackbarProps;
}

export interface Action {
  type: string;
  [propName: string]: any;
}

type SidebarType = UIState['sidebar'];

export type HeaderActionType =
  | ((...args: any[]) => JSX.Element | null | ReactNode)
  | null
  | ReactElement
  | ReactNode;
export type DetailsViewFunc = HeaderActionType;

export type HeaderAction = {
  id: string;
  action?: HeaderActionType;
};

export enum DefaultHeaderAction {
  RESTART = 'RESTART',
  DELETE = 'DELETE',
  EDIT = 'EDIT',
  SCALE = 'SCALE',
  POD_LOGS = 'POD_LOGS',
  POD_TERMINAL = 'POD_TERMINAL',
  POD_ATTACH = 'POD_ATTACH',
}

export type HeaderActionsProcessor = {
  id: string;
  processor: (resource: KubeObject | null, actions: HeaderAction[]) => HeaderAction[];
};

export function setNamespaceFilter(namespaces: string[]) {
  return { type: FILTER_SET_NAMESPACE, namespaces: namespaces };
}

export function setSearchFilter(searchTerms: string) {
  return { type: FILTER_SET_SEARCH, search: searchTerms };
}

export function resetFilter() {
  return { type: FILTER_RESET };
}

export function clusterAction(
  callback: CallbackAction['callback'],
  actionOptions: CallbackActionOptions = {}
) {
  return { type: CLUSTER_ACTION, callback, ...actionOptions };
}

export function updateClusterAction(actionOptions: ClusterAction) {
  return { type: CLUSTER_ACTION_UPDATE, ...actionOptions };
}

export function setSidebarSelected(selected: string | null, sidebar = '') {
  return { type: UI_SIDEBAR_SET_SELECTED, selected: { item: selected, sidebar } };
}

export function setWhetherSidebarOpen(isSidebarOpen: boolean) {
  localStorage.setItem('sidebar', JSON.stringify({ shrink: !isSidebarOpen }));
  return { type: UI_SIDEBAR_SET_EXPANDED, isSidebarOpen, isSidebarOpenUserSelected: isSidebarOpen };
}

export function setHideAppBar(hideAppBar: boolean | undefined) {
  return { type: UI_HIDE_APP_BAR, hideAppBar };
}

export function setSidebarVisible(isVisible: SidebarType['isVisible']) {
  return { type: UI_SIDEBAR_SET_VISIBLE, isVisible };
}

export function setSidebarItem(item: SidebarEntryProps) {
  // @todo: Clarify the spec when we port this to Ts.
  if (item.parent === undefined) {
    item['parent'] = null;
  }
  return { type: UI_SIDEBAR_SET_ITEM, item };
}

export function setSidebarItemFilter(
  filterFunc: (entry: SidebarEntryProps) => SidebarEntryProps | null
) {
  return { type: UI_SIDEBAR_SET_ITEM_FILTER, filterFunc };
}

export function setRoute(routeSpec: Route) {
  return { type: UI_ROUTER_SET_ROUTE, route: routeSpec };
}

export function setRouteFilter(filterFunc: (entry: Route) => Route | null) {
  return { type: UI_ROUTER_SET_ROUTE_FILTER, filterFunc };
}

export function setDetailsViewHeaderAction(action: HeaderActionType | HeaderAction) {
  let headerAction = action as HeaderAction;
  if (headerAction.id === undefined) {
    if (headerAction.action === undefined) {
      headerAction = { id: '', action: action as HeaderActionType };
    } else {
      headerAction = { id: '', action: headerAction.action };
    }
  }
  return { type: UI_DETAILS_VIEW_SET_HEADER_ACTION, action: headerAction };
}

export function addDetailsViewHeaderActionsProcessor(
  actionProcessor: HeaderActionsProcessor | HeaderActionsProcessor['processor']
) {
  let headerActionsProcessor = actionProcessor as HeaderActionsProcessor;
  if (headerActionsProcessor.id === undefined && typeof actionProcessor === 'function') {
    headerActionsProcessor = {
      id: '',
      processor: actionProcessor,
    };
  }
  return { type: UI_DETAILS_VIEW_ADD_HEADER_ACTIONS_PROCESSOR, action: headerActionsProcessor };
}

export function setDetailsView(viewSection: DetailsViewSectionType) {
  return {
    type: UI_SET_DETAILS_VIEW,
    action: viewSection,
  };
}

export function setAppBarAction(actionFunc: HeaderActionType) {
  return { type: UI_APP_BAR_SET_ACTION, action: actionFunc };
}

export function setConfig(config: object) {
  return { type: CONFIG_NEW, config };
}

export function setTheme(name?: string) {
  return { type: UI_THEME_SET, theme: { name } };
}

export function setBrandingAppLogoComponent(component: AppLogoType) {
  return { type: UI_BRANDING_SET_APP_LOGO, component };
}

export function setUINotifications(notifications: Notification[] | Notification) {
  return { type: UI_SET_NOTIFICATIONS, notifications };
}

export function updateUINotification(dispatchedNotification: Notification[] | Notification) {
  return { type: UI_UPDATE_NOTIFICATION, dispatchedNotification };
}
export function setClusterChooserButtonComponent(component: ClusterChooserType) {
  return { type: UI_SET_CLUSTER_CHOOSER_BUTTON, component };
}

export function setVersionDialogOpen(isVersionDialogOpen: boolean) {
  return { type: UI_VERSION_DIALOG_OPEN, isVersionDialogOpen };
}

export type FunctionsToOverride = {
  [key: string]: (...args: any) => any;
};

export function setFunctionsToOverride(override: FunctionsToOverride) {
  return { type: UI_FUNCTIONS_OVERRIDE, override };
}

export function setAppSettings(settings: { [key: string]: any }) {
  return { type: CONFIG_SET_SETTINGS, settings };
}
