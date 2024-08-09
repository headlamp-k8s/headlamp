import { KubeObjectEndpoint } from './KubeObjectEndpoint';

export function makeUrl(urlParts: any[], query: Record<string, string> = {}) {
  const url = urlParts
    .map(it => (typeof it === 'string' ? it : String(it)))
    .filter(Boolean)
    .join('/');
  const queryString = new URLSearchParams(query).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  // replace multiple slashes with a single one
  // unless it is part of the protocol
  return fullUrl.replace(/([^:]\/)\/+/g, '$1');
}

/**
 * Represents a KubeObject with an endpoint.
 */
export interface ObjectWithEndpoint {
  apiEndpoint: {
    apiInfo: KubeObjectEndpoint[];
  };

  new (data: any): ObjectWithEndpoint;

  [prop: string]: any;
}
