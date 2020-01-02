export const FILTER_RESET = 'FILTER_RESET';
export const FILTER_SET_NAMESPACE = 'FILTER_SET_NAMESPACE';
export const FILTER_SET_SEARCH = 'FILTER_SET_SEARCH';
export const CLUSTER_OBJECTS_DELETE = 'CLUSTER_OBJECTS_DELETE';
export const CLUSTER_OBJECTS_DELETE_START = 'CLUSTER_OBJECTS_DELETE_START';
export const CLUSTER_OBJECTS_DELETED = 'CLUSTER_OBJECTS_DELETED';
export const CLUSTER_OBJECTS_CANCEL_DELETE = 'CLUSTER_OBJECTS_CANCEL_DELETE';
export const CLUSTER_OBJECTS_DELETE_CANCELLED = 'CLUSTER_OBJECTS_DELETE_CANCELLED';

export function setNamespaceFilter(namespaces) {
  return { type: FILTER_SET_NAMESPACE, namespaces: namespaces };
}

export function setSearchFilter(searchTerms) {
  return { type: FILTER_SET_SEARCH, search: searchTerms };
}

export function resetFilter() {
  return { type: FILTER_RESET };
}

export function deleteClusterObjects(items, deleteCallback, options={successUrl: null}) {
  return { type: CLUSTER_OBJECTS_DELETE, items: items, deleteCallback: deleteCallback, options: options};
}

export function startDeleteClusterObjects(items, options={}) {
  return { type: CLUSTER_OBJECTS_DELETE_START, items: items, ...options };
}

export function clusterObjectsDeleted(items, options={}) {
  return { type: CLUSTER_OBJECTS_DELETED, items: items, ...options };
}

export function cancelDeleteClusterObjects(items=[], options={}) {
  return { type: CLUSTER_OBJECTS_CANCEL_DELETE, items: items, ...options};
}

export function deleteClusterObjectsCancelled(items, options={}) {
  return { type: CLUSTER_OBJECTS_DELETE_CANCELLED, items: items, ...options };
}
