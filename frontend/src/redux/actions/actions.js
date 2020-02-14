export const FILTER_RESET = 'FILTER_RESET';
export const FILTER_SET_NAMESPACE = 'FILTER_SET_NAMESPACE';
export const FILTER_SET_SEARCH = 'FILTER_SET_SEARCH';
export const CLUSTER_ACTION = 'CLUSTER_ACTION';
export const CLUSTER_ACTION_UPDATE = 'CLUSTER_ACTION_UPDATE';
export const CLUSTER_ACTION_CANCEL = 'CLUSTER_ACTION_CANCEL';
export const UI_SIDEBAR_SET_SELECTED = 'UI_SIDEBAR_SET_SELECTED';
export const UI_SIDEBAR_SET_VISIBLE = 'UI_SIDEBAR_SET_VISIBLE';
export const UI_SIDEBAR_SET_ITEM = 'UI_SIDEBAR_SET_ITEM';
export const UI_ROUTER_SET_ROUTE = 'UI_ROUTER_SET_ROUTE';
export const UI_DETAILS_VIEW_SET_HEADER_ACTION = 'UI_DETAILS_VIEW_SET_HEADER_ACTION';

export function setNamespaceFilter(namespaces) {
  return { type: FILTER_SET_NAMESPACE, namespaces: namespaces };
}

export function setSearchFilter(searchTerms) {
  return { type: FILTER_SET_SEARCH, search: searchTerms };
}

export function resetFilter() {
  return { type: FILTER_RESET };
}

export function clusterAction(actionCallback, actionOptions={}) {
  return { type: CLUSTER_ACTION, actionCallback, ...actionOptions};
}

export function updateClusterAction(actionOptions) {
  return { type: CLUSTER_ACTION_UPDATE, ...actionOptions};
}

export function setSidebarSelected(selected) {
  return { type: UI_SIDEBAR_SET_SELECTED, selected };
}

export function setSidebarVisible(isVisible) {
  return { type: UI_SIDEBAR_SET_VISIBLE, isVisible };
}

export function setSidebarItem(item) {
  // @todo: Clarify the spec when we port this to Ts.
  if (item.parent === undefined) {
    item['parent'] = null;
  }
  return { type: UI_SIDEBAR_SET_ITEM, item};
}

export function setRoute(routeSpec) {
  // @todo: Define routeSpec.
  return { type: UI_ROUTER_SET_ROUTE, route: routeSpec};
}

export function setDetailsViewHeaderAction(actionName, actionFunc) {
  return { type: UI_DETAILS_VIEW_SET_HEADER_ACTION, name: actionName, action: actionFunc};
}
