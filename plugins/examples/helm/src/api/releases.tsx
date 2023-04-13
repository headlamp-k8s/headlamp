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

export function createRelease(name: string, namespace: string, value: string, chart: string) {
  return request(`/helm/release/install?namespace=${namespace}`, {
    method: 'POST',
    body: JSON.stringify({
      name: name,
      namespace: namespace,
      //@todo fix this
      value: value,
      chart: chart,
    }),
  });
}

export function getActionStatus(name: string, action: string) {
  return request(`/helm/action/status?name=${name}&action=${action}`, {
    method: 'GET',
  });
}
