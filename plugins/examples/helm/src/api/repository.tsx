import { ApiProxy } from '@kinvolk/headlamp-plugin/lib';

const request = ApiProxy.request;

export function addRepository(repoName: string, repoURL: string) {
  return request('/helm/repositories', {
    method: 'POST',
    body: JSON.stringify({
      name: repoName,
      url: repoURL,
    }),
  });
}
