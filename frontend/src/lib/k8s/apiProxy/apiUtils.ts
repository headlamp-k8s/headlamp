import { omit } from 'lodash';
import store from '../../../redux/stores/store';
import { QueryParameters } from './apiTypes';

export function buildUrl(urlOrParts: string | string[], queryParams?: QueryParameters): string {
  const url = Array.isArray(urlOrParts) ? urlOrParts.join('/') : urlOrParts;
  return url + asQuery(queryParams);
}

/**
 * Combines a base path and a path to create a full path.
 *
 * Doesn't matter if the start or the end has a single slash, the result will always have a single slash.
 *
 * @param base - The base path.
 * @param path - The path to combine with the base path.
 *
 * @returns The combined path.
 */
export function combinePath(base: string, path: string): string {
  if (base.endsWith('/')) base = base.slice(0, -1); // eslint-disable-line no-param-reassign
  if (path.startsWith('/')) path = path.slice(1); // eslint-disable-line no-param-reassign
  return `${base}/${path}`;
}

export function getApiRoot(group: string, version: string) {
  return group ? `/apis/${group}/${version}` : `api/${version}`;
}

/**
 * Converts k8s queryParams to a URL query string.
 *
 * @param queryParams - The k8s API query parameters to convert.
 * @returns The query string (starting with '?'), or empty string.
 */
export function asQuery(queryParams?: QueryParameters): string {
  if (queryParams === undefined) {
    return '';
  }

  let newQueryParams;
  if (typeof queryParams.limit === 'number' || typeof queryParams.limit === 'string') {
    newQueryParams = {
      ...queryParams,
      limit:
        typeof queryParams.limit === 'number' ? queryParams.limit.toString() : queryParams.limit,
    };
  } else {
    newQueryParams = { ...omit(queryParams, 'limit') };
  }

  return !!newQueryParams && !!Object.keys(newQueryParams).length
    ? '?' + new URLSearchParams(newQueryParams).toString()
    : '';
}

/**
 * @returns Auth type of the cluster, or an empty string if the cluster is not found.
 * It could return 'oidc' or '' for example.
 *
 * @param cluster - Name of the cluster.
 */
export function getClusterAuthType(cluster: string): string {
  const state = store.getState();
  const authType: string = state.config?.clusters?.[cluster]?.['auth_type'] || '';
  return authType;
}
