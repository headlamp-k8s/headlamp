import WS from 'jest-websocket-mock';
import nock from 'nock';
import * as cluster from '../cluster';
import * as apiProxy from './apiProxy';

const baseApiUrl = 'http://localhost';
const mockResponse = { message: 'mock response' };
const clusterName = 'test-cluster';
const podName = 'test-pod';
const namespace = 'default';
const errorResponse401 = { error: 'Unauthorized', message: 'Unauthorized' };
const errorResponse500 = { error: 'Internal Server Error', message: 'Unauthorized' };
const streamResultsUrl = `/clusters/${clusterName}/apis/v1/namespaces/${namespace}/configmaps`;
const errorMessage = {
  type: 'ERROR',
  object: {
    reason: 'InternalError',
    message: 'Mock internal error message.',
    actionType: 'ERROR',
  },
};

// Mocked resources
const mockSingleResource: [group: string, version: string, resource: string] = [
  'groupA',
  'v1',
  'resourceA',
];
const mockConfigMap = {
  apiVersion: 'v1',
  kind: 'ConfigMap',
  metadata: {
    name: 'my-pvc',
    namespace: 'default',
    resourceVersion: '1234',
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

// describe('clusterRequest', () => {});

describe('apiFactory', () => {
  const mockMultipleResource: [group: string, version: string, resource: string][] = [
    ['groupB', 'v1', 'resourceB'],
    ['groupC', 'v1', 'resourceC'],
    ['groupD', 'v1', 'resourceD'],
  ];
  let mockServer: WS;
  const mockServers: any = {};

  beforeEach(() => {
    nock(baseApiUrl)
      .persist()
      .get(
        uri =>
          uri.includes('resourceA') ||
          uri.includes('resourceB') ||
          uri.includes('resourceC') ||
          uri.includes('resourceD')
      )
      .reply(200, mockConfigMapList);
  });

  afterEach(() => {
    nock.cleanAll();
    WS.clean();
  });

  describe('singleApiFactory', () => {
    it('Successfully creates API client for single resource', done => {
      mockServer = new WS(
        `ws://localhost/clusters/${clusterName}/apis/${mockSingleResource[0]}/${mockSingleResource[1]}/${mockSingleResource[2]}`
      );

      const cb = jest.fn();
      const errCb = jest.fn();
      const client = apiProxy.apiFactory(...mockSingleResource);
      client.list(cb, errCb, {}, clusterName);

      mockServer.on('connection', async (socket: any) => {
        expect(cb).toHaveBeenNthCalledWith(1, []);

        socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(cb).toHaveBeenNthCalledWith(2, [{ actionType: 'ADDED', ...mockConfigMap }]);

        socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(cb).toHaveBeenNthCalledWith(3, [{ actionType: 'MODIFIED', ...modifiedConfigMap }]);

        done();
      });
    });
  });

  describe('multipleApiFactory', () => {
    it('Successfully creates API client for multiple resources', async () => {
      const cb = jest.fn();
      const errCb = jest.fn();

      const connections = mockMultipleResource.map(([group, version, resource]) => {
        return new Promise<void>(resolve => {
          mockServers[resource] = new WS(
            `ws://localhost/clusters/${clusterName}/apis/${group}/${version}/${resource}`
          );
          const client = apiProxy.apiFactory(group, version, resource);
          client.list(cb, errCb, {}, clusterName);

          mockServers[resource].on('connection', async (socket: any) => {
            expect(cb).toHaveBeenCalledWith([]);

            socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
            await new Promise(resolve => setTimeout(resolve, 100));
            expect(cb).toHaveBeenCalledWith([{ actionType: 'ADDED', ...mockConfigMap }]);

            socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));
            await new Promise(resolve => setTimeout(resolve, 100));
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

describe('apiFactoryWithNamespace', () => {
  // let streamResultsForClusterMock: any;

  // beforeEach(() => {
  //   streamResultsForClusterMock = jest.spyOn(apiProxy, 'streamResultsForCluster');
  // });

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  describe('simpleApiFactoryWithNamespace', () => {
    it('Successfully creates single API factory with namespace', async () => {
      const client = apiProxy.apiFactoryWithNamespace(...mockSingleResource);
      expect(client).toBeDefined();
      expect(client.isNamespaced).toBe(true);
      expect(client.apiInfo).toEqual([
        {
          group: mockSingleResource[0],
          version: mockSingleResource[1],
          resource: mockSingleResource[2],
        },
      ]);
    });
  });

  // it('Successfully calls list', () => {
  //   const cb = jest.fn();
  //   const errCb = jest.fn();

  //   const client = apiProxy.apiFactoryWithNamespace(...mockSingleResource);
  //   client.list(namespace, cb, errCb, {}, clusterName);

  //   expect(streamResultsForClusterMock).toHaveBeenCalled();
  // });
});

describe('request, post, patch, put, delete', () => {
  const testPath = '/test/url';
  const testData = { key: 'value' };

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    nock(baseApiUrl)
      // Successful GET request
      .persist()
      .get(`/clusters/${clusterName}` + testPath)
      .reply(200, mockResponse)
      // Successful POST request
      .persist()
      .post(`/clusters/${clusterName}` + testPath, testData)
      .reply(200, mockResponse)
      // Successful PATCH request
      .persist()
      .patch(`/clusters/${clusterName}` + testPath, testData)
      .reply(200, mockResponse)
      // Successful PUT request
      .persist()
      .put(`/clusters/${clusterName}` + testPath, testData)
      .reply(200, mockResponse)
      // Successful DELETE request
      .persist()
      .delete(`/clusters/${clusterName}` + testPath)
      .reply(200, mockResponse);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('request', () => {
    it('Successfully calls request', async () => {
      const response = await apiProxy.request(
        `/clusters/${clusterName}` + testPath,
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
        .get(`/clusters/${clusterName}` + testPath)
        .reply(statusCode, { message: errorResponse.error });

      await expect(
        apiProxy.request(`/clusters/${clusterName}` + testPath, {}, true, true)
      ).rejects.toThrow(`${errorResponse.error}`);
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
            .post(`/clusters/${clusterName}` + testPath, testData)
            .reply(statusCode, { message: errorResponse.error });
          promise = apiProxy[method](testPath, testData, true, { cluster: clusterName });
          break;
        case 'patch':
          scope
            .patch(`/clusters/${clusterName}` + testPath, testData)
            .reply(statusCode, { message: errorResponse.error });
          promise = apiProxy[method](testPath, testData, true, { cluster: clusterName });
          break;
        case 'put':
          scope
            .put(`/clusters/${clusterName}` + testPath, testData)
            .reply(statusCode, { message: errorResponse.error });
          promise = apiProxy[method](testPath, testData, true, { cluster: clusterName });
          break;
        case 'remove':
          scope
            .delete(`/clusters/${clusterName}` + testPath)
            .reply(statusCode, { message: errorResponse.error });
          promise = apiProxy[method](testPath, { cluster: clusterName });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      await expect(promise).rejects.toThrow(`${errorResponse.error}`);
    });
  });
});

describe('streamResult', () => {
  const resourceUrl = `/apis/v1/namespaces/${namespace}/configmaps`;
  let mockServer: WS;
  let getClusterSpy: jest.SpyInstance;

  beforeEach(() => {
    nock(baseApiUrl)
      .get(`${streamResultsUrl}/${mockConfigMap.metadata.name}`)
      .query(true)
      .reply(200, mockConfigMap);

    mockServer = new WS(`ws://localhost${streamResultsUrl}`);
    console.error = jest.fn();
    getClusterSpy = jest.spyOn(cluster, 'getCluster').mockReturnValue(clusterName);
  });

  afterEach(() => {
    nock.cleanAll();
    WS.clean();
    getClusterSpy.mockRestore();
  });

  it('Successfully handles ADDED, MODIFIED, and DELETED types', done => {
    const cb = jest.fn();
    const errCb = jest.fn();

    apiProxy.streamResult(resourceUrl, mockConfigMap.metadata.name, cb, errCb, { watch: '1' });

    mockServer.on('connection', async (socket: any) => {
      expect(cb).toHaveBeenNthCalledWith(1, mockConfigMap);

      socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(cb).toHaveBeenNthCalledWith(2, mockConfigMap);

      socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(cb).toHaveBeenNthCalledWith(3, modifiedConfigMap);

      socket.send(JSON.stringify({ type: 'DELETED', object: mockConfigMap }));
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(cb).toHaveBeenNthCalledWith(4, mockConfigMap);

      done();
    });
  });

  it('Successfully handles error messages', done => {
    const cb = jest.fn();
    const errCb = jest.fn();

    apiProxy.streamResult(resourceUrl, mockConfigMap.metadata.name, cb, errCb, { watch: '1' });

    mockServer.on('connection', async (socket: any) => {
      expect(cb).toHaveBeenNthCalledWith(1, mockConfigMap);

      socket.send(JSON.stringify(errorMessage));
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(cb).toHaveBeenNthCalledWith(2, errorMessage.object);

      done();
    });
  });

  it('Successfully handles stream cancellation', done => {
    const cb = jest.fn();
    const errCb = jest.fn();
    apiProxy
      .streamResult(resourceUrl, mockConfigMap.metadata.name, cb, errCb, { watch: '1' })
      .then(cancel => {
        mockServer.on('connection', async (socket: any) => {
          socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));

          setTimeout(() => {
            expect(cb).toHaveBeenNthCalledWith(2, mockConfigMap);
            cancel();
            socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));

            setTimeout(() => {
              expect(cb).toHaveBeenCalledTimes(2);
              done();
            }, 100);
          }, 100);
        });
      })
      .catch(err => done(err));
  });
});

describe('streamResults, streamResultsForCluster', () => {
  let mockServer: WS;
  let getClusterSpy: jest.SpyInstance;

  beforeEach(() => {
    nock(baseApiUrl).get(streamResultsUrl).query(true).reply(200, mockConfigMapList);

    mockServer = new WS(`ws://localhost${streamResultsUrl}`);
    console.error = jest.fn();
    getClusterSpy = jest.spyOn(cluster, 'getCluster').mockReturnValue(clusterName);
  });

  afterEach(() => {
    nock.cleanAll();
    WS.clean();
    getClusterSpy.mockRestore();
  });

  describe('streamResults', () => {
    it('Successfully starts a stream and receives data', done => {
      const cb = jest.fn();
      const errCb = jest.fn();

      apiProxy.streamResults(`/apis/v1/namespaces/${namespace}/configmaps`, cb, errCb, {
        watch: '1',
      });

      mockServer.on('connection', async (socket: any) => {
        expect(cb).toHaveBeenNthCalledWith(1, []);

        socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(cb).toHaveBeenNthCalledWith(2, [{ actionType: 'ADDED', ...mockConfigMap }]);

        done();
      });
    });
  });

  describe('streamResultsForCluster', () => {
    it('Successfully handles ADDED, MODIFIED, and DELETED types', done => {
      const cb = jest.fn();
      const errCb = jest.fn();

      apiProxy.streamResultsForCluster(
        `/apis/v1/namespaces/${namespace}/configmaps`,
        { cb, errCb, cluster: clusterName },
        { watch: '1' }
      );

      mockServer.on('connection', async (socket: any) => {
        expect(cb).toHaveBeenNthCalledWith(1, []);

        socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(cb).toHaveBeenNthCalledWith(2, [{ actionType: 'ADDED', ...mockConfigMap }]);

        socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(cb).toHaveBeenNthCalledWith(3, [{ actionType: 'MODIFIED', ...modifiedConfigMap }]);

        socket.send(JSON.stringify({ type: 'DELETED', object: mockConfigMap }));
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(cb).toHaveBeenNthCalledWith(4, []);

        done();
      });
    });

    it('Successfully handles error messages', done => {
      const cb = jest.fn();
      const errCb = jest.fn();

      apiProxy.streamResultsForCluster(
        `/apis/v1/namespaces/${namespace}/configmaps`,
        { cb, errCb, cluster: clusterName },
        { watch: '1' }
      );

      mockServer.on('connection', async (socket: any) => {
        socket.send(JSON.stringify(errorMessage));
        await new Promise(resolve => setTimeout(resolve, 100));
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
      const cb = jest.fn();
      const errCb = jest.fn();

      apiProxy
        .streamResultsForCluster(
          `/apis/v1/namespaces/${namespace}/configmaps`,
          { cb, errCb, cluster: clusterName },
          { watch: '1' }
        )
        .then(cancel => {
          mockServer.on('connection', async socket => {
            socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));

            setTimeout(() => {
              expect(cb).toHaveBeenCalledWith([{ actionType: 'ADDED', ...mockConfigMap }]);
              cancel();
              socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));

              setTimeout(() => {
                expect(cb).toHaveBeenCalledWith([{ actionType: 'ADDED', ...mockConfigMap }]);
                done();
              }, 100);
            }, 100);
          });
        })
        .catch(err => done(err));
    });
  });
});

describe('stream', () => {
  const streamUrl = '/test/stream/url';
  let mockServer: WS;
  let getClusterSpy: jest.SpyInstance;

  beforeEach(() => {
    mockServer = new WS(`ws://localhost/clusters/${clusterName}${streamUrl}`);
    getClusterSpy = jest.spyOn(cluster, 'getCluster').mockReturnValue(clusterName);
  });

  afterEach(() => {
    WS.clean();
    getClusterSpy.mockRestore();
  });

  it('Successfully connects to the server and receives messages', done => {
    const cb = jest.fn();
    const connectCb = jest.fn();
    const failCb = jest.fn();

    apiProxy.stream(streamUrl, cb, { connectCb, failCb, isJson: true });

    mockServer.on('connection', async (socket: any) => {
      expect(connectCb).toHaveBeenCalled();

      socket.send(JSON.stringify(mockResponse));
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(cb).toHaveBeenNthCalledWith(1, mockResponse);

      done();
    });
  });

  it('Successfully handles WebSocket errors', done => {
    const cb = jest.fn();
    const connectCb = jest.fn();
    const failCb = jest.fn();

    apiProxy.stream(streamUrl, cb, { connectCb, failCb, isJson: true });

    mockServer.on('connection', async (socket: any) => {
      socket.close();
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(failCb).toHaveBeenCalled();

      done();
    });
  });

  it('Successfully handles stream cancellation', done => {
    const cb = jest.fn();
    const connectCb = jest.fn();
    const failCb = jest.fn();

    const { cancel } = apiProxy.stream(streamUrl, cb, { connectCb, failCb, isJson: true });

    mockServer.on('connection', async () => {
      cancel();

      mockServer.send(JSON.stringify(mockResponse));
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(cb).not.toHaveBeenCalled();

      done();
    });
  });
});

// describe('apply', () => {

// });

// describe('metrics', () => {

// });

describe('testAuth', () => {
  const apiPath = '/apis/authorization.k8s.io/v1/selfsubjectrulesreviews';
  const spec = { namespace: namespace };

  beforeEach(() => {
    nock(baseApiUrl)
      .persist()
      .post(`/clusters/${clusterName}` + apiPath, { spec })
      .reply(200, mockResponse);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('Successfully handles authentication', async () => {
    const response = await apiProxy.testAuth(clusterName);
    expect(response).toEqual(mockResponse);
  });

  it.each([
    [401, errorResponse401],
    [500, errorResponse500],
  ])(
    'Successfully handles authentication with error status %d',
    async (statusCode, errorResponse) => {
      nock.cleanAll();
      nock(baseApiUrl)
        .persist()
        .post(`/clusters/${clusterName}` + apiPath, { spec })
        .reply(statusCode, { message: errorResponse.error });

      await expect(apiProxy.testAuth(clusterName)).rejects.toThrow(`${errorResponse.error}`);
    }
  );
});

describe('testClusterHealth', () => {
  const apiPath = '/healthz';
  const successResponse = 'ok';

  beforeEach(() => {
    nock(baseApiUrl)
      .persist()
      .get(`/clusters/${clusterName}` + apiPath)
      .reply(200, successResponse, { 'content-type': 'text/plain' });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('Successfully checks cluster health', async () => {
    const response = await apiProxy.testClusterHealth(clusterName);
    const body = await response.text();
    expect(body).toEqual(successResponse);
  });

  it.each([
    [401, errorResponse401],
    [500, errorResponse500],
  ])(
    'Successfully handles cluster health check with error status %d',
    async (statusCode, errorResponse) => {
      nock.cleanAll();
      nock(baseApiUrl)
        .persist()
        .get(`/clusters/${clusterName}` + apiPath)
        .reply(statusCode, { message: errorResponse.error });

      await expect(apiProxy.testClusterHealth(clusterName)).rejects.toThrow(
        `${errorResponse.error}`
      );
    }
  );
});

describe('setCluster, deleteCluster', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('deleteCluster', () => {
    it('Successfully deletes a cluster', async () => {
      nock(baseApiUrl).persist().delete(`/cluster/${clusterName}`).reply(200, mockResponse);

      const response = await apiProxy.deleteCluster(clusterName);
      expect(response).toEqual(mockResponse);
    });

    it.each([
      [401, errorResponse401],
      [500, errorResponse500],
    ])(
      'Successfully handles deleteCluster with error status %d',
      async (statusCode, errorResponse) => {
        nock.cleanAll();
        nock(baseApiUrl)
          .persist()
          .delete(`/cluster/${clusterName}`)
          .reply(statusCode, { message: errorResponse.error });

        await expect(apiProxy.deleteCluster(clusterName)).rejects.toThrow(`${errorResponse.error}`);
      }
    );
  });
});

describe('startPortForward, stopOrDeletePortForward, listPortForward', () => {
  const containerPort = 8080;
  const service = 'test-service';
  const serviceNamespace = 'default';
  const port = '8080';
  const mockId = '1234';
  const mockStartResponse = { message: 'Port forwarding started' };
  const mockStopResponse = { message: 'Port forwarding stopped' };
  const mockListResponse = [
    {
      id: mockId,
      podname: podName,
      containerPort: containerPort,
      service: service,
      namespace: namespace,
    },
  ];

  beforeEach(() => {
    (global.fetch as jest.MockedFunction<typeof fetch>) = jest
      .fn()
      .mockImplementation((url, options) => {
        if (url.includes('portforward') && !url.includes('list')) {
          if (options.method === 'POST' && url.includes('portforward')) {
            return Promise.resolve(
              new Response(JSON.stringify(mockStartResponse), {
                status: 200,
                headers: { 'content-type': 'application/json' },
              })
            );
          } else if (options.method === 'DELETE' && url.includes('portforward')) {
            return Promise.resolve(
              new Response(JSON.stringify(mockStopResponse), {
                status: 200,
                headers: { 'content-type': 'application/json' },
              })
            );
          }
        } else if (url.includes('portforward') && url.includes('list')) {
          return Promise.resolve(
            new Response(JSON.stringify(mockListResponse), {
              status: 200,
              headers: { 'content-type': 'application/json' },
            })
          );
        }
        return Promise.reject(new Error('Not Found'));
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('startPortForward', () => {
    it('Successfully starts a port forward', async () => {
      const response = await apiProxy.startPortForward(
        clusterName,
        namespace,
        podName,
        containerPort,
        service,
        serviceNamespace,
        port,
        baseApiUrl,
        mockId
      );
      expect(response).toEqual(mockStartResponse);
    });
  });

  describe('stopOrDeletePortForward', () => {
    it('Successfully deletes a port forward', async () => {
      const response = await apiProxy.stopOrDeletePortForward(clusterName, mockId);
      const data = JSON.parse(response);
      expect(data).toEqual(mockStopResponse);
    });
  });

  describe('listPortForward', () => {
    it('Successfully list port forwards', async () => {
      const response = await apiProxy.listPortForward(clusterName);
      expect(response).toEqual(mockListResponse);
    });
  });
});

describe('drainNode, drainNodeStatus', () => {
  const nodeName = 'test-node';
  const drainNodeErrorResponse = 'Something went wrong';

  beforeEach(() => {
    (global.fetch as jest.MockedFunction<typeof fetch>) = jest
      .fn()
      .mockImplementation((url, options) => {
        if (options.method === 'POST' && url.includes('drain-node')) {
          if (options.body.includes(nodeName)) {
            return Promise.resolve(
              new Response(JSON.stringify(mockResponse), {
                status: 200,
                headers: { 'content-type': 'application/json' },
              })
            );
          }
        } else if (url.includes('drain-node-status')) {
          return Promise.resolve(
            new Response(JSON.stringify(mockResponse), {
              status: 200,
              headers: { 'content-type': 'application/json' },
            })
          );
        } else {
          return Promise.reject(new Error('Not Found'));
        }
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('drainNode', () => {
    it('Successfully drains a node', async () => {
      const response = await apiProxy.drainNode(clusterName, nodeName);
      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('drain-node'),
        expect.objectContaining({
          method: 'POST',
          headers: { map: expect.objectContaining({ 'content-type': 'application/json' }) },
          body: JSON.stringify({ cluster: clusterName, nodeName }),
        })
      );
    });

    it('Successfully handles drainNode with error', async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>) = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve(drainNodeErrorResponse),
        });
      });

      await expect(apiProxy.drainNode(clusterName, 'invalid-node')).rejects.toThrow(
        drainNodeErrorResponse
      );
    });
  });

  describe('drainNodeStatus', () => {
    it('Successfully gets drain node status', async () => {
      const response = await apiProxy.drainNodeStatus(clusterName, nodeName);
      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('drain-node-status'),
        expect.objectContaining({
          method: 'GET',
          headers: { map: expect.objectContaining({ 'content-type': 'application/json' }) },
        })
      );
    });

    it('Successfully handles drainNodeStatus with error', async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>) = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve(drainNodeErrorResponse),
        });
      });

      await expect(apiProxy.drainNodeStatus(clusterName, 'invalid-node')).rejects.toThrow(
        drainNodeErrorResponse
      );
    });
  });
});

describe('deletePlugin', () => {
  const pluginName = 'test-plugin';
  const fakePluginName = 'fake-plugin';
  const deleteResponse = { message: 'Plugin deleted successfully' };

  beforeEach(() => {
    (global.fetch as jest.MockedFunction<typeof fetch>) = jest
      .fn()
      .mockImplementation((url, options) => {
        if (url.endsWith(`/plugins/${pluginName}`) && options.method === 'DELETE') {
          return Promise.resolve(
            new Response(JSON.stringify(deleteResponse), {
              status: 200,
              headers: { 'content-type': 'application/json' },
            })
          );
        } else if (url.endsWith(`/plugins/${fakePluginName}`) && options.method === 'DELETE') {
          return Promise.resolve(
            new Response(JSON.stringify({ message: 'Plugin not found' }), {
              status: 404,
              headers: { 'content-type': 'application/json' },
            })
          );
        } else {
          return Promise.reject(new Error('Not Found'));
        }
      });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Successfully deletes a plugin', async () => {
    const response = await apiProxy.deletePlugin(pluginName);
    expect(response).toEqual(deleteResponse);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`plugins/${pluginName}`),
      expect.objectContaining({
        method: 'DELETE',
        headers: {},
      })
    );
  });

  it('Successfully handles deletePlugin with error', async () => {
    await expect(apiProxy.deletePlugin(fakePluginName)).rejects.toThrow('Plugin not found');
  });
});
