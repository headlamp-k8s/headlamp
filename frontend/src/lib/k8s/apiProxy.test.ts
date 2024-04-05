/*
 * Documentation for testing with nock:
 * https://github.com/nock/nock
 */

import WS from 'jest-websocket-mock';
import nock from 'nock';
import * as auth from '../auth';
import * as apiProxy from './apiProxy';

const baseApiUrl = 'http://localhost';
const wsUrl = 'ws://localhost';
const testPath = '/test/url';
const mockResponse = { message: 'mock response' };
const clusterName = 'test-cluster';
const namespace = 'default';
const errorResponse401 = { error: 'Unauthorized', message: 'Unauthorized' };

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
});
