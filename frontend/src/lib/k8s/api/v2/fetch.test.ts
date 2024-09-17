import nock from 'nock';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { findKubeconfigByClusterName, getUserIdFromLocalStorage } from '../../../../stateless';
import { getToken, setToken } from '../../../auth';
import { getClusterAuthType } from '../v1/clusterRequests';
import { BASE_HTTP_URL, clusterFetch } from './fetch';

vi.mock('../../../auth', () => ({
  getToken: vi.fn(),
  setToken: vi.fn(),
}));

vi.mock('../../../../stateless', () => ({
  findKubeconfigByClusterName: vi.fn(),
  getUserIdFromLocalStorage: vi.fn(),
}));

vi.mock('../v1/clusterRequests', () => ({
  getClusterAuthType: vi.fn(),
}));

vi.mock('../v1/tokenApi', () => ({
  refreshToken: vi.fn(),
}));

describe('clusterFetch', () => {
  const clusterName = 'test-cluster';
  const testUrl = '/test/url';
  const mockResponse = { message: 'mock response' };
  const token = 'test-token';
  const newToken = 'new-token';
  const kubeconfig = 'mock-kubeconfig';
  const userID = 'mock-user-id';

  beforeEach(() => {
    vi.resetAllMocks();
    (getToken as Mock).mockReturnValue(token);
    (findKubeconfigByClusterName as Mock).mockResolvedValue(kubeconfig);
    (getUserIdFromLocalStorage as Mock).mockReturnValue(userID);
    (getClusterAuthType as Mock).mockReturnValue('serviceAccount');
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('Successfully makes a request', async () => {
    nock(BASE_HTTP_URL).get(`/clusters/${clusterName}${testUrl}`).reply(200, mockResponse);

    const response = await clusterFetch(testUrl, { cluster: clusterName });
    const responseBody = await response.json();

    expect(responseBody).toEqual(mockResponse);
  });

  it('Sets Authorization header with token', async () => {
    nock(BASE_HTTP_URL)
      .get(`/clusters/${clusterName}${testUrl}`)
      .matchHeader('Authorization', `Bearer ${token}`)
      .reply(200, mockResponse);

    await clusterFetch(testUrl, { cluster: clusterName });
  });

  it('Sets KUBECONFIG and X-HEADLAMP-USER-ID headers if kubeconfig exists', async () => {
    nock(BASE_HTTP_URL)
      .get(`/clusters/${clusterName}${testUrl}`)
      .matchHeader('KUBECONFIG', kubeconfig)
      .matchHeader('X-HEADLAMP-USER-ID', userID)
      .reply(200, mockResponse);

    await clusterFetch(testUrl, { cluster: clusterName });
  });

  it('Sets new token if X-Authorization header is present in response', async () => {
    nock(BASE_HTTP_URL)
      .get(`/clusters/${clusterName}${testUrl}`)
      .reply(200, mockResponse, { 'X-Authorization': newToken });

    await clusterFetch(testUrl, { cluster: clusterName });

    expect(setToken).toHaveBeenCalledWith(clusterName, newToken);
  });

  it('Throws an error if response is not ok', async () => {
    nock(BASE_HTTP_URL).get(`/clusters/${clusterName}${testUrl}`).reply(500);

    await expect(clusterFetch(testUrl, { cluster: clusterName })).rejects.toThrow('Unreachable');
  });
});
