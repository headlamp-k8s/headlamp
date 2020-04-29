import { OptionsObject as SnackbarProps } from 'notistack';

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
export const UI_ROUTER_SET_ROUTE = 'UI_ROUTER_SET_ROUTE';
export const UI_DETAILS_VIEW_SET_HEADER_ACTION = 'UI_DETAILS_VIEW_SET_HEADER_ACTION';

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

export interface Action {
  type: string,
  [propName: string]: any;
}

export function setNamespaceFilter(namespaces: string[]) {
  return { type: FILTER_SET_NAMESPACE, namespaces: namespaces };
}

export function setSearchFilter(searchTerms: string) {
  return { type: FILTER_SET_SEARCH, search: searchTerms };
}

export function resetFilter() {
  return { type: FILTER_RESET };
}

export function clusterAction(actionCallback: () => void, actionOptions: object = {}) {
  return { type: CLUSTER_ACTION, actionCallback, ...actionOptions};
}

export function updateClusterAction(actionOptions: ClusterAction) {
  return { type: CLUSTER_ACTION_UPDATE, ...actionOptions};
}

export function setSidebarSelected(selected: string) {
  return { type: UI_SIDEBAR_SET_SELECTED, selected };
}

export function setSidebarVisible(isVisible: boolean) {
  return { type: UI_SIDEBAR_SET_VISIBLE, isVisible };
}

export function setSidebarItem(item: any) {
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

export function setDetailsViewHeaderAction(actionName: string, actionFunc: () => void) {
  return { type: UI_DETAILS_VIEW_SET_HEADER_ACTION, name: actionName, action: actionFunc};
}

export function setConfig(config: object) {
  return { type: CONFIG_NEW, config};
}
