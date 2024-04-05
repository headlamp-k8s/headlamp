/*
 * Documentation for testing with nock:
 * https://github.com/nock/nock
 */

import nock from 'nock';
import * as auth from '../auth';
import * as apiProxy from './apiProxy';

const baseApiUrl = 'http://localhost';
const testPath = '/test/url';
const mockResponse = { message: 'mock response' };
const clusterName = 'test-cluster';
const errorResponse401 = { error: 'Unauthorized', message: 'Unauthorized' };

describe('apiProxy', () => {
  describe('clusterRequest', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    it('Successfully makes a request', async () => {
      nock(baseApiUrl).get(testPath).reply(200, mockResponse);

      const response = await apiProxy.clusterRequest(testPath);
      expect(response).toEqual(mockResponse);
    });

    it('Successfully handles clusterRequest with status 401', async () => {
      expect.assertions(1);

      nock(baseApiUrl).get(testPath).reply(401, errorResponse401);

      try {
        await expect(apiProxy.clusterRequest(testPath)).rejects.toThrow(errorResponse401.error);
      } catch (error: any) {
        expect(error.status).toEqual(401);
      }
    });

    it('Successfully appends query parameters', async () => {
      const queryParams = {
        watch: '1',
        param1: 'value1',
        param2: 'value2',
      };

      nock(baseApiUrl).get(testPath).query(queryParams).reply(200, mockResponse);

      const response = await apiProxy.clusterRequest(testPath, {}, queryParams);
      expect(response).toEqual(mockResponse);
    });

    it('Successfully handles X-Authorization for token refresh', async () => {
      nock(baseApiUrl)
        .get(`/clusters/test-cluster${testPath}`)
        .reply(200, mockResponse, { 'X-Authorization': 'newToken' });

      const setTokenSpy = jest.spyOn(auth, 'setToken');
      await apiProxy.clusterRequest(testPath, { cluster: clusterName });
      expect(setTokenSpy).toHaveBeenCalledWith(clusterName, 'newToken');
    });
  });
});
