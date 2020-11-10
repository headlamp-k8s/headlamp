import { OptionsObject as SnackbarProps } from 'notistack';
import { SidebarEntry, UIState } from '../reducers/ui';

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
export const UI_SIDEBAR_SET_EXPANDED = 'UI_SIDEBAR_SET_EXPANDED';
export const UI_ROUTER_SET_ROUTE = 'UI_ROUTER_SET_ROUTE';
export const UI_DETAILS_VIEW_SET_HEADER_ACTION = 'UI_DETAILS_VIEW_SET_HEADER_ACTION';
export const UI_APP_BAR_SET_ACTION = 'UI_APP_BAR_SET_ACTION';

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

export type HeaderActionFunc = (...args: any[]) => JSX.Element | null;

export function setNamespaceFilter(namespaces: string[]) {
  return { type: FILTER_SET_NAMESPACE, namespaces: namespaces };
}

export function setSearchFilter(searchTerms: string) {
  return { type: FILTER_SET_SEARCH, search: searchTerms };
}

export function resetFilter() {
  return { type: FILTER_RESET };
}

export function clusterAction(callback: CallbackAction['callback'], actionOptions: CallbackActionOptions = {}) {
  return { type: CLUSTER_ACTION, callback, ...actionOptions};
}

export function updateClusterAction(actionOptions: ClusterAction) {
  return { type: CLUSTER_ACTION_UPDATE, ...actionOptions};
}

export function setSidebarSelected(selected: SidebarType['selected']) {
  return { type: UI_SIDEBAR_SET_SELECTED, selected };
}

export function setWhetherSidebarOpen(isSidebarOpen: boolean) {
  return { type: UI_SIDEBAR_SET_EXPANDED, isSidebarOpen};
}

export function setSidebarVisible(isVisible: SidebarType['isVisible']) {
  return { type: UI_SIDEBAR_SET_VISIBLE, isVisible };
}

export function setSidebarItem(item: SidebarEntry) {
  // @todo: Clarify the spec when we port this to Ts.
  if (item.parent === undefined) {
    item['parent'] = null;
  }
  return { type: UI_SIDEBAR_SET_ITEM, item};
}

export function setRoute(routeSpec: any) {
  // @todo: Define routeSpec later.
  return { type: UI_ROUTER_SET_ROUTE, route: routeSpec};
}

export function setDetailsViewHeaderAction(actionName: string, actionFunc: HeaderActionFunc) {
  return { type: UI_DETAILS_VIEW_SET_HEADER_ACTION, name: actionName, action: actionFunc};
}

export function setAppBarAction(actionName: string, actionFunc: HeaderActionFunc) {
  return { type: UI_APP_BAR_SET_ACTION, name: actionName, action: actionFunc};
}

export function setConfig(config: object) {
  return { type: CONFIG_NEW, config};
}
