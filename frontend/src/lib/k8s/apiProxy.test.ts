import WS from 'jest-websocket-mock';
import nock from 'nock';
import * as apiProxy from './apiProxy';

const baseApiUrl = 'http://localhost';
const mockResponse = { message: 'mock response' };
const clusterName = 'test-cluster';
const podName = 'test-pod';
const namespace = 'default';
const errorResponse401 = { error: 'Unauthorized', message: 'Unauthorized' };
const errorResponse500 = { error: 'Internal Server Error', message: 'Unauthorized' };
const streamResultsUrl = `/clusters/${clusterName}/apis/v1/namespaces/${namespace}/configmaps`;

// Mocked resources for stream functions
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

describe('apiFactory', () => {
  const mockSingleResource: [group: string, version: string, resource: string] = [
    'groupA',
    'v1',
    'resourceA',
  ];
  // const mockMultipleResource: [group: string, version: string, resource: string][] = [['groupB', 'v1', 'resourceB'], ['groupC', 'v1', 'resourceC'], ['groupD', 'v1', 'resourceD']];
  let mockServer: WS;
  // let mockServers: Record<string, WS> = {};

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

  // it('Successfully creates API client for multiple resources', (done) => {
  //     const cb = jest.fn((...args) => {
  //     console.log(`Callback invoked for multipleResourceTest with args:`, args);
  //   });
  //   const errCb = jest.fn();

  //   mockMultipleResource.forEach(([group, version, resource]) => {
  //     mockServers[resource] = new WS(`ws://localhost/clusters/${clusterName}/apis/${group}/${version}/${resource}`);
  //     const client = apiProxy.apiFactory(group, version, resource);
  //     client.list(cb, errCb, {}, clusterName);

  //     mockServers[resource].on('connection', async(socket) => {
  //       socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
  //       await new Promise((resolve) => setTimeout(resolve, 100));

  //       socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));
  //       await new Promise((resolve) => setTimeout(resolve, 100));
  //     });
  //   });

  //   expect(cb).toHaveBeenCalledTimes(mockMultipleResource.length);
  //   done();
  // });
});

describe('get, post, patch, put, delete', () => {
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

  it('Successfully calls request', async () => {
    const response = await apiProxy.request(`/clusters/${clusterName}` + testPath, {}, true, true);
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

// describe('streamResults', () => {
//   const testUrl = `/clusters/${clusterName}/apis/v1/namespaces/${namespace}/configmaps`;

//   let mockServer: WS;

//   beforeEach(() => {
//     nock(baseApiUrl)
//       .get(testUrl)
//       .query({ watch: '1' })
//       .reply(200, mockConfigMapList);

//     mockServer = new WS(
//       `ws://localhost/clusters/${clusterName}/apis/v1/namespaces/${namespace}/configmaps`
//     );
//     console.error = jest.fn();
//   });

//   afterEach(() => {
//     nock.cleanAll();
//     WS.clean();
//   });

//   it('Successfully starts a stream and receives data', async () => {
//     const cb = jest.fn();
//     const errCb = jest.fn();

//     const cancel = await apiProxy.streamResults(testUrl, cb, errCb, { watch: '1'});

//     mockServer.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
//     await new Promise(resolve => setTimeout(resolve, 100));
//     expect(cb).toHaveBeenCalledWith([{ actionType: 'ADDED', ...mockConfigMap }]);

//     cancel();
//   })
// });

// describe('streamResult', () => {
//   let closeCalled: any;
//   const fullUrl = `${baseApiUrl}/namespaces/${namespace}/pods/${podName}?watch=1&fieldSelector=metadata.name=${podName}&key=value`;

//   beforeAll(() => {
//     defineGlobalWebSocketMock();
//     nock(baseApiUrl)
//       .persist()
//       .get(`/namespaces/${namespace}/pods/${podName}`)
//       .query(true)
//       .reply(200, mockResponse);
//   });

//   beforeEach(() => {
//     console.error = jest.fn();
//     console.debug = jest.fn(); // Assuming the implementation uses console.debug for logs
//     closeCalled = false;
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//     nock.cleanAll();
//   });

//   // Helper to mock WebSocket and allow for error handling and successful message reception
//   function defineGlobalWebSocketMock(triggerError = false) {
//     global.WebSocket = jest.fn().mockImplementation((url, protocols) => {
//       if (url !== fullUrl) {
//         throw new Error(`Unexpected WebSocket URL: ${url}`);
//       }
//       return {
//         url,
//         protocols,
//         addEventListener: jest.fn((event, callback) => {
//           if (event === 'message' && !triggerError) {
//             setTimeout(() => callback({ data: JSON.stringify(mockResponse) }), 150);
//           } else if (event === 'error' && triggerError) {
//             setTimeout(() => callback({ error: 'WebSocket error' }), 150);
//           }
//         }),
//         removeEventListener: jest.fn(),
//         close: jest.fn(() => {
//           closeCalled = true;
//         }),
//         readyState: WebSocket.OPEN,
//       };
//     }) as unknown as typeof WebSocket;

//     Object.defineProperties(global.WebSocket, {
//       CONNECTING: { value: 0, enumerable: true },
//       OPEN: { value: 1, enumerable: true },
//       CLOSING: { value: 2, enumerable: true },
//       CLOSED: { value: 3, enumerable: true },
//     });
//   }

//   it('Successfully streams initial and subsequent results', async () => {
//     const cb = jest.fn();
//     const errCb = jest.fn();

//     const cancelStream = await apiProxy.streamResult(baseApiUrl, podName, cb, errCb, {}, clusterName);

//     await new Promise(r => setTimeout(r, 200)); // Wait for both initial response and WebSocket message

//     expect(cb).toHaveBeenCalledTimes(2);
//     expect(cb).toHaveBeenCalledWith(mockResponse);
//     expect(errCb).not.toHaveBeenCalled();
//     cancelStream();
//     expect(closeCalled).toBe(true);
//   });
// });

describe('streamResults, streamResultsForCluster', () => {
  let mockServer: WS;

  beforeEach(() => {
    nock(baseApiUrl)
      .get(`/clusters/${clusterName}/apis/v1/namespaces/${namespace}/configmaps`)
      .query({ watch: '1' })
      .reply(200, mockConfigMapList);

    mockServer = new WS(
      `ws://localhost/clusters/${clusterName}/apis/v1/namespaces/${namespace}/configmaps`
    );
    console.error = jest.fn();
  });

  afterEach(() => {
    nock.cleanAll();
    WS.clean();
  });

  it('streamResults: Successfully starts a stream and receives data', async () => {
    const cb = jest.fn();
    const errCb = jest.fn();

    apiProxy.streamResults(streamResultsUrl, cb, errCb, { watch: '1' });

    mockServer.on('connection', async (socket: any) => {
      expect(cb).toHaveBeenNthCalledWith(1, []);

      socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(cb).toHaveBeenNthCalledWith(2, [{ actionType: 'ADDED', ...mockConfigMap }]);
    });
  });

  it('streamResultsForCluster: Successfully handles ADDED, MODIFIED, and DELETED types', done => {
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

  it('streamResultsForCluster: Successfully handles ERROR type', done => {
    const cb = jest.fn();
    const errCb = jest.fn();

    apiProxy.streamResultsForCluster(
      `/apis/v1/namespaces/${namespace}/configmaps`,
      { cb, errCb, cluster: clusterName },
      { watch: '1' }
    );

    mockServer.on('connection', async (socket: any) => {
      const errorMessage = {
        type: 'ERROR',
        object: {
          reason: 'InternalError',
          message: 'Mock internal error message.',
          actionType: 'ERROR',
        },
      };
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

  it('streamResultsForCluster: Successfully handles stream cancellation', async () => {
    const cb = jest.fn();
    const errCb = jest.fn();

    const cancel = await apiProxy.streamResultsForCluster(
      `/apis/v1/namespaces/${namespace}/configmaps`,
      { cb, errCb, cluster: clusterName },
      { watch: '1' }
    );

    mockServer.on('connection', async socket => {
      socket.send(JSON.stringify({ type: 'ADDED', object: mockConfigMap }));
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(cb).toHaveBeenCalledWith([{ actionType: 'ADDED', ...mockConfigMap }]);

      cancel();

      socket.send(JSON.stringify({ type: 'MODIFIED', object: modifiedConfigMap }));
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(cb).toHaveBeenCalledWith([{ actionType: 'ADDED', ...mockConfigMap }]);
    });
  });
});

// describe('stream', () => {
//   const testUrl = 'ws://localhost/clusters/test-cluster/apis/v1/namespaces/default/configmaps?watch=1&resourceVersion=1234';
//   const errorMessage = { error: 'Error in api stream' };
//   let server: WS;

//   beforeEach(() => {
//     server = new WS(testUrl);
//   });

//   afterEach(() => {
//     WS.clean();
//   });

//   it('Successfully connects to the server and receives messages', async () => {
//     const cb = jest.fn();
//     const failCb = jest.fn();

//     apiProxy.stream(testUrl, cb, { failCb });

//     console.log("Trying to connect to server...");
//     await server.connected;
//     console.log("Trying to send message...");
//     server.send(JSON.stringify(mockResponse));
//     console.log("Message sent.");

//     await new Promise((r) => setTimeout(r, 100));
//     expect(cb).toHaveBeenCalledTimes(1);
//     // expect(cb).toHaveBeenCalledWith(mockResponse);
//     // expect(failCb).not.toHaveBeenCalled();

//     // console.log("Waiting to connect to server...");
//     // mockServer.on('connection', async (socket: any) => {
//     //   console.log("Connected to server. Sending message...");
//     //   socket.send(JSON.stringify(mockResponse));
//     //   console.log("Message sent.");
//     //   await new Promise((r) => setTimeout(r, 100));
//     //   expect(cb).toHaveBeenCalledTimes(1);
//     //   expect(cb).toHaveBeenCalledWith(mockResponse);
//     //   expect(failCb).not.toHaveBeenCalled();
//     // });
//   });

// it('Successfully handles WebSocket errors', async () => {
//   const cb = jest.fn();
//   const failCb = jest.fn();

//   apiProxy.stream(testUrl, cb, { failCb });

//   mockServer.on('connection', async (socket: any) => {
//     socket.close();
//     expect(cb).not.toHaveBeenCalled();
//     expect(failCb).not.toHaveBeenCalled();
//     // expect(console.error).toHaveBeenCalledWith(errorMessage.error, {
//     //   err: errorMessage,
//     //   path: testUrl,
//     // });
//   });
// });

// it('Successfully cancels the stream', async () => {
//   const cb = jest.fn();
//   const failCb = jest.fn();
//   closeCalled = false;

//   const { cancel } = apiProxy.stream(testUrl, cb, { failCb });

//   await new Promise(r => setTimeout(r, 50));
//   cancel();
//   await new Promise(r => setTimeout(r, 50));

//   expect(closeCalled).toBe(true);
//   expect(cb).not.toHaveBeenCalled();
// });
// });

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

  it('Successfully deletes a port forward', async () => {
    const response = await apiProxy.stopOrDeletePortForward(clusterName, mockId);
    const data = JSON.parse(response);
    expect(data).toEqual(mockStopResponse);
  });

  it('Successfully list port forwards', async () => {
    const response = await apiProxy.listPortForward(clusterName);
    expect(response).toEqual(mockListResponse);
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
