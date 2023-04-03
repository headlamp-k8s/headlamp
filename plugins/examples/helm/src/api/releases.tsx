import { ApiProxy } from '@kinvolk/headlamp-plugin/lib';

const request = ApiProxy.request;

export function listReleases() {
  return request('/releases/list', {
    method: 'GET',
  });
}
