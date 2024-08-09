import helpers from '../../../../helpers';
import { findKubeconfigByClusterName, getUserIdFromLocalStorage } from '../../../../stateless';
import { getToken, setToken } from '../../../auth';
import { getClusterAuthType } from '../v1/apiUtils';
import { refreshToken } from '../v1/tokenApi';
import { makeUrl } from './utils';

export const BASE_HTTP_URL = helpers.getAppUrl();

async function backendFetch(url: string | URL, init: RequestInit) {
  const response = await fetch(makeUrl([BASE_HTTP_URL, url]), init);

  // The backend signals through this header that it wants a reload.
  // See plugins.go
  const headerVal = response.headers.get('X-Reload');
  if (headerVal && headerVal.indexOf('reload') !== -1) {
    window.location.reload();
  }

  return response;
}

export async function clusterFetch(url: string | URL, init: RequestInit & { cluster: string }) {
  const token = getToken(init.cluster);

  init.headers = new Headers(init.headers);

  // Set stateless kubeconfig if exists
  const kubeconfig = await findKubeconfigByClusterName(init.cluster);
  if (kubeconfig !== null) {
    const userID = getUserIdFromLocalStorage();
    init.headers.set('KUBECONFIG', kubeconfig);
    init.headers.set('X-HEADLAMP-USER-ID', userID);
  }

  // Refresh service account token only if the cluster auth type is not OIDC
  if (getClusterAuthType(init.cluster) !== 'oidc') {
    await refreshToken(token);
  }

  if (token) {
    init.headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await backendFetch(makeUrl(['clusters', init.cluster, url]), init);

  // In case of OIDC auth if the token is about to expire the backend
  // sends a refreshed token in the response header.
  const newToken = response.headers.get('X-Authorization');
  if (newToken && init.cluster) {
    setToken(init.cluster, newToken);
  }

  return response;
}
