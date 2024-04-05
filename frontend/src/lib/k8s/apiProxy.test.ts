/*
 * Documentation for testing with nock:
 * https://github.com/nock/nock
 */

import WS from 'jest-websocket-mock';
import nock from 'nock';
import * as auth from '../auth';
import * as cluster from '../cluster';
import * as apiProxy from './apiProxy';

const baseApiUrl = 'http://localhost';
const wsUrl = 'ws://localhost';
const testPath = '/test/url';
const mockResponse = { message: 'mock response' };
const clusterName = 'test-cluster';
const namespace = 'default';
const errorResponse401 = { error: 'Unauthorized', message: 'Unauthorized' };
const errorResponse500 = { error: 'Internal Server Error', message: 'Unauthorized' };
const streamResultsUrl = `/apis/v1/namespaces/${namespace}/configmaps`;
const errorMessage = {
  type: 'ERROR',
  object: {
    reason: 'InternalError',
    message: 'Mock internal error message.',
    actionType: 'ERROR',
  },
};

const mockSingleResource: [group: string, version: string, resource: string] = [
  'groupA',
  'v1',
  'resourceA',
];
const mockMultipleResource: [group: string, version: string, resource: string][] = [
  ['groupB', 'v1', 'resourceB'],
  ['groupC', 'v1', 'resourceC'],
  ['groupD', 'v1', 'resourceD'],
];
const mockConfigMap = {
  apiVersion: 'v1',
  kind: 'ConfigMap',
  metadata: {
    creationTimestamp: '2023-04-27T20:31:27Z',
    name: 'my-pvc',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc-1234',
  },
  data: {
    storageClassName: 'default',
    volumeMode: 'Filesystem',
    volumeName: 'pvc-abc-1234',
  },
};
const mockConfigMapList = {
  apiVersion: 'v1',
  items: [],
  kind: 'ConfigMapList',
  metadata: {
    resourceVersion: '1234',
    selfLink: '/api/v1/namespaces/default/configmaps',
  },
};
const modifiedConfigMap = {
  ...mockConfigMap,
  metadata: { ...mockConfigMap.metadata, resourceVersion: '5678' },
  data: { ...mockConfigMap.data, volumeName: 'pvc-xyz-5678' },
};

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

  describe('apiFactory, apiFactoryWithNamespace', () => {
    const mockServers: any = {};
    let mockServer: WS;
    let cb: jest.Mock;
    let errCb: jest.Mock;

    beforeEach(() => {
      nock(baseApiUrl)
        .persist()
        .get(
          uri =>
            uri.includes(mockSingleResource[2]) ||
            uri.includes(mockMultipleResource[0][2]) ||
            uri.includes(mockMultipleResource[1][2]) ||
            uri.includes(mockMultipleResource[2][2])
        )
        .reply(200, mockConfigMapList);

      cb = jest.fn();
      errCb = jest.fn();

      jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      nock.cleanAll();
      WS.clean();
      jest.restoreAllMocks();
    });

    describe('singleApiFactory', () => {
      it('Successfully creates API client for single resource', done => {
        expect.assertions(3);

        mockServer = new WS(
          `${wsUrl}/clusters/${clusterName}/apis/${mockSingleResource[0]}/${mockSingleResource[1]}/${mockSingleResource[2]}`
        );

        const client = apiProxy.apiFactory(...mockSingleResource);
        client.list(cb, errCb, {}, clusterName);

        mockServer.on('connection', async (socket: any) => {
          expect(cb).toHaveBeenNthCalledWith(1, []);

          socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
          expect(cb).toHaveBeenNthCalledWith(2, [{ actionType: 'ADDED', ...mockConfigMap }]);

          socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));
          expect(cb).toHaveBeenNthCalledWith(3, [{ actionType: 'MODIFIED', ...modifiedConfigMap }]);

          done();
        });
      });
    });

    describe('multipleApiFactory', () => {
      it('Successfully creates API client for multiple resources', async () => {
        expect.assertions(10);

        const connections = mockMultipleResource.map(([group, version, resource]) => {
          return new Promise<void>(resolve => {
            mockServers[resource] = new WS(
              `${wsUrl}/clusters/${clusterName}/apis/${group}/${version}/${resource}`
            );
            const client = apiProxy.apiFactory(group, version, resource);
            client.list(cb, errCb, {}, clusterName);

            mockServers[resource].on('connection', async (socket: any) => {
              expect(cb).toHaveBeenCalledWith([]);

              socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
              expect(cb).toHaveBeenCalledWith([{ actionType: 'ADDED', ...mockConfigMap }]);

              socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));
              expect(cb).toHaveBeenCalledWith([{ actionType: 'MODIFIED', ...modifiedConfigMap }]);

              resolve();
            });
          });
        });

        await Promise.all(connections);
        expect(cb).toHaveBeenCalledTimes(3 * mockMultipleResource.length);
      });
    });

    describe('simpleApiFactoryWithNamespace', () => {
      it('Successfully creates API client for single namespaced resource', done => {
        expect.assertions(4);

        mockServer = new WS(
          `${wsUrl}/clusters/${clusterName}/apis/${mockSingleResource[0]}/${mockSingleResource[1]}/namespaces/${namespace}/${mockSingleResource[2]}`
        );

        const client = apiProxy.apiFactoryWithNamespace(...mockSingleResource);
        expect(client.isNamespaced).toBe(true);

        client.list(namespace, cb, errCb, {}, clusterName);

        mockServer.on('connection', async (socket: any) => {
          expect(cb).toHaveBeenNthCalledWith(1, []);

          socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
          expect(cb).toHaveBeenNthCalledWith(2, [{ actionType: 'ADDED', ...mockConfigMap }]);

          socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));
          expect(cb).toHaveBeenNthCalledWith(3, [{ actionType: 'MODIFIED', ...modifiedConfigMap }]);

          done();
        });
      });
    });

    describe('multipleApiFactoryWithNamespace', () => {
      it('Successfully creates API client for multiple namespaced resources', async () => {
        expect.assertions(10);

        const connections = mockMultipleResource.map(([group, version, resource]) => {
          return new Promise<void>(resolve => {
            mockServers[resource] = new WS(
              `${wsUrl}/clusters/${clusterName}/apis/${group}/${version}/namespaces/${namespace}/${resource}`
            );
            const client = apiProxy.apiFactoryWithNamespace(group, version, resource);
            client.list(namespace, cb, errCb, {}, clusterName);

            mockServers[resource].on('connection', async (socket: any) => {
              expect(cb).toHaveBeenCalledWith([]);

              socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
              expect(cb).toHaveBeenCalledWith([{ actionType: 'ADDED', ...mockConfigMap }]);

              socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));
              expect(cb).toHaveBeenCalledWith([{ actionType: 'MODIFIED', ...modifiedConfigMap }]);

              resolve();
            });
          });
        });

        await Promise.all(connections);
        expect(cb).toHaveBeenCalledTimes(3 * mockMultipleResource.length);
      });
    });
  });

  describe('request, post, patch, put, delete', () => {
    const testData = { key: 'value' };

    beforeEach(() => {
      nock(baseApiUrl)
        // Successful GET request
        .persist()
        .get(`/clusters/${clusterName}${testPath}`)
        .reply(200, mockResponse)
        // Successful POST request
        .persist()
        .post(`/clusters/${clusterName}${testPath}`, testData)
        .reply(200, mockResponse)
        // Successful PATCH request
        .persist()
        .patch(`/clusters/${clusterName}${testPath}`, testData)
        .reply(200, mockResponse)
        // Successful PUT request
        .persist()
        .put(`/clusters/${clusterName}${testPath}`, testData)
        .reply(200, mockResponse)
        // Successful DELETE request
        .persist()
        .delete(`/clusters/${clusterName}${testPath}`)
        .reply(200, mockResponse);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    describe('request', () => {
      it('Successfully calls request', async () => {
        const response = await apiProxy.request(
          `/clusters/${clusterName}${testPath}`,
          {},
          true,
          true
        );
        expect(response).toEqual(mockResponse);
      });

      it.each([
        [401, errorResponse401],
        [500, errorResponse500],
      ])('Successfully handles request with error status %d', async (statusCode, errorResponse) => {
        nock.cleanAll();
        nock(baseApiUrl)
          .persist()
          .get(`/clusters/${clusterName}${testPath}`)
          .reply(statusCode, { message: errorResponse.error });

        await expect(
          apiProxy.request(`/clusters/${clusterName}${testPath}`, {}, true, true)
        ).rejects.toThrow(errorResponse.error);
      });
    });

    describe('post, patch, put, delete', () => {
      it('Successfully calls post', async () => {
        const response = await apiProxy.post(testPath, testData, true, { cluster: clusterName });
        expect(response).toEqual(mockResponse);
      });
      it('Successfully calls patch', async () => {
        const response = await apiProxy.patch(testPath, testData, true, { cluster: clusterName });
        expect(response).toEqual(mockResponse);
      });
      it('Successfully calls put', async () => {
        const response = await apiProxy.put(testPath, testData, true, { cluster: clusterName });
        expect(response).toEqual(mockResponse);
      });
      it('Successfully calls remove', async () => {
        const response = await apiProxy.remove(testPath, { cluster: clusterName });
        expect(response).toEqual(mockResponse);
      });

      // Requests with 401 and 500 errors
      it.each([
        ['post', 401, errorResponse401],
        ['post', 500, errorResponse500],
        ['patch', 401, errorResponse401],
        ['patch', 500, errorResponse500],
        ['put', 401, errorResponse401],
        ['put', 500, errorResponse500],
        ['remove', 401, errorResponse401],
        ['remove', 500, errorResponse500],
      ])('Successfully handles %s with status %d', async (method, statusCode, errorResponse) => {
        nock.cleanAll();
        const scope = nock(baseApiUrl).persist();
        let promise;

        switch (method) {
          case 'post':
            scope
              .post(`/clusters/${clusterName}${testPath}`, testData)
              .reply(statusCode, { message: errorResponse.error });
            promise = apiProxy[method](testPath, testData, true, { cluster: clusterName });
            break;
          case 'patch':
            scope
              .patch(`/clusters/${clusterName}${testPath}`, testData)
              .reply(statusCode, { message: errorResponse.error });
            promise = apiProxy[method](testPath, testData, true, { cluster: clusterName });
            break;
          case 'put':
            scope
              .put(`/clusters/${clusterName}${testPath}`, testData)
              .reply(statusCode, { message: errorResponse.error });
            promise = apiProxy[method](testPath, testData, true, { cluster: clusterName });
            break;
          case 'remove':
            scope
              .delete(`/clusters/${clusterName}${testPath}`)
              .reply(statusCode, { message: errorResponse.error });
            promise = apiProxy[method](testPath, { cluster: clusterName });
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        await expect(promise).rejects.toThrow(errorResponse.error);
      });
    });
  });

  describe('streamResult', () => {
    let mockServer: WS;
    let cb: jest.Mock;
    let errCb: jest.Mock;

    beforeEach(() => {
      nock(baseApiUrl)
        .get(`/clusters/${clusterName}${streamResultsUrl}/${mockConfigMap.metadata.name}`)
        .query(true)
        .reply(200, mockConfigMap);

      cb = jest.fn();
      errCb = jest.fn();

      mockServer = new WS(`${wsUrl}/clusters/${clusterName}${streamResultsUrl}`);
      jest.spyOn(cluster, 'getCluster').mockReturnValue(clusterName);
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      nock.cleanAll();
      WS.clean();
      jest.restoreAllMocks();
    });

    it('Successfully handles ADDED, MODIFIED, and DELETED types', done => {
      expect.assertions(4);

      apiProxy.streamResult(streamResultsUrl, mockConfigMap.metadata.name, cb, errCb, {
        watch: '1',
      });

      mockServer.on('connection', async (socket: any) => {
        expect(cb).toHaveBeenNthCalledWith(1, mockConfigMap);

        socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
        expect(cb).toHaveBeenNthCalledWith(2, mockConfigMap);

        socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));
        expect(cb).toHaveBeenNthCalledWith(3, modifiedConfigMap);

        socket.send(JSON.stringify({ type: 'DELETED', object: mockConfigMap }));
        expect(cb).toHaveBeenNthCalledWith(4, mockConfigMap);

        done();
      });
    });

    it('Successfully handles error messages', done => {
      expect.assertions(2);

      apiProxy.streamResult(streamResultsUrl, mockConfigMap.metadata.name, cb, errCb, {
        watch: '1',
      });

      mockServer.on('connection', async (socket: any) => {
        expect(cb).toHaveBeenNthCalledWith(1, mockConfigMap);

        socket.send(JSON.stringify(errorMessage));
        expect(cb).toHaveBeenNthCalledWith(2, errorMessage.object);

        done();
      });
    });

    it('Successfully handles stream cancellation', done => {
      expect.assertions(2);

      apiProxy
        .streamResult(streamResultsUrl, mockConfigMap.metadata.name, cb, errCb, { watch: '1' })
        .then(cancel => {
          mockServer.on('connection', async (socket: any) => {
            socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
            expect(cb).toHaveBeenNthCalledWith(2, mockConfigMap);
            cancel();
            socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));

            expect(cb).toHaveBeenCalledTimes(2);
            done();
          });
        })
        .catch(err => done(err));
    });
  });

  describe('streamResults, streamResultsForCluster', () => {
    let mockServer: WS;
    let cb: jest.Mock;
    let errCb: jest.Mock;

    beforeEach(() => {
      nock(baseApiUrl)
        .get(`/clusters/${clusterName}${streamResultsUrl}`)
        .query(true)
        .reply(200, mockConfigMapList);

      cb = jest.fn();
      errCb = jest.fn();

      mockServer = new WS(`${wsUrl}/clusters/${clusterName}${streamResultsUrl}`);
      jest.spyOn(cluster, 'getCluster').mockReturnValue(clusterName);
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      nock.cleanAll();
      WS.clean();
      jest.restoreAllMocks();
    });

    describe('streamResults', () => {
      it('Successfully starts a stream and receives data', done => {
        expect.assertions(2);

        apiProxy.streamResults(streamResultsUrl, cb, errCb, {
          watch: '1',
        });

        mockServer.on('connection', async (socket: any) => {
          expect(cb).toHaveBeenNthCalledWith(1, []);

          socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
          expect(cb).toHaveBeenNthCalledWith(2, [{ actionType: 'ADDED', ...mockConfigMap }]);

          done();
        });
      });
    });

    describe('streamResultsForCluster', () => {
      it('Successfully handles ADDED, MODIFIED, and DELETED types', done => {
        expect.assertions(4);

        apiProxy.streamResultsForCluster(
          streamResultsUrl,
          { cb, errCb, cluster: clusterName },
          { watch: '1' }
        );

        mockServer.on('connection', async (socket: any) => {
          expect(cb).toHaveBeenNthCalledWith(1, []);

          socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
          expect(cb).toHaveBeenNthCalledWith(2, [{ actionType: 'ADDED', ...mockConfigMap }]);

          socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));
          expect(cb).toHaveBeenNthCalledWith(3, [{ actionType: 'MODIFIED', ...modifiedConfigMap }]);

          socket.send(JSON.stringify({ type: 'DELETED', object: mockConfigMap }));
          expect(cb).toHaveBeenNthCalledWith(4, []);

          done();
        });
      });

      it('Successfully handles error messages', done => {
        apiProxy.streamResultsForCluster(
          streamResultsUrl,
          { cb, errCb, cluster: clusterName },
          { watch: '1' }
        );

        mockServer.on('connection', async (socket: any) => {
          socket.send(JSON.stringify(errorMessage));
          expect(console.error).toHaveBeenCalledWith(
            'Error in update',
            expect.objectContaining({
              object: expect.objectContaining({
                actionType: errorMessage.object.actionType,
                message: errorMessage.object.message,
                reason: errorMessage.object.reason,
              }),
              type: errorMessage.type,
            })
          );
          done();
        });
      });

      it('Successfully handles stream cancellation', done => {
        expect.assertions(2);

        apiProxy
          .streamResultsForCluster(
            streamResultsUrl,
            { cb, errCb, cluster: clusterName },
            { watch: '1' }
          )
          .then(cancel => {
            mockServer.on('connection', async socket => {
              socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
              expect(cb).toHaveBeenCalledWith([{ actionType: 'ADDED', ...mockConfigMap }]);
              cancel();
              socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));

              expect(cb).toHaveBeenCalledWith([{ actionType: 'ADDED', ...mockConfigMap }]);
              done();
            });
          })
          .catch(err => done(err));
      });
    });
  });
});
