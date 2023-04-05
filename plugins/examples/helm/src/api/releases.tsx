import { ApiProxy } from '@kinvolk/headlamp-plugin/lib';

const request = ApiProxy.request;

export function listReleases() {
  return request('/helm/releases/list', {
    method: 'GET',
  });
}

export function getRelease(namespace: string, releaseName: string) {
  return request(`/helm/releases?name=${releaseName}&namespace=${namespace}`, {
    method: 'GET',
  });
}

export function getReleaseHistory(namespace: string, releaseName: string) {
  return request(`/helm/release/history?name=${releaseName}&namespace=${namespace}`, {
    method: 'GET',
  });
}

export function deleteRelease(namespace: string, releaseName: string) {
  return request(`/helm/releases/uninstall?name=${releaseName}&namespace=${namespace}`, {
    method: 'DELETE',
  });
}

export function rollbackRelease(namespace: string, releaseName: string, version: string) {
  return request(`/helm/releases/rollback?name=${releaseName}&namespace=${namespace}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: releaseName,
      namespace: namespace,
      revision: version,
    }),
  });
}
