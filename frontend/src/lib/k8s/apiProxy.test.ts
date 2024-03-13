import nock from 'nock';
import * as apiProxy from './apiProxy';

const baseApiUrl = 'http://localhost';
const mockResponse = { message: 'mock response' };
const clusterName = 'test-cluster';
const namespace = 'default';
const errorResponse401 = { error: 'Unauthorized', message: 'Unauthorized' };
const errorResponse500 = { error: 'Internal Server Error', message: 'Unauthorized' };

// describe('apiFactory', () => {
//   const mockSingleResource = ['groupA', 'v1', 'resourceA'];
//   const mockMultipleResource = [['groupB', 'v1', 'resourceB'], ['groupC', 'v1', 'resourceC']];
//   const mockKubeConfigMap = {
//     apiVersion: 'v1',
//     kind: 'ConfigMap',
//     metadata: {
//       creationTimestamp: '2023-04-27T20:31:27Z',
//       name: 'my-pvc',
//       namespace: 'default',
//       resourceVersion: '1234',
//       uid: 'abc-1234',
//     },
//     data: {
//       storageClassName: 'default',
//       volumeMode: 'Filesystem',
//       volumeName: 'pvc-abc-1234',
//     },
//   };
//   const newMockResponse = {
//     apiVersion: 'v1',
//     items: [mockKubeConfigMap],
//     kind: 'ConfigMapList',
//     metadata: {
//       resourceVersion: '1234',
//       selfLink: '/api/v1/namespaces/default/configmaps',
//     },
//   }

//   beforeAll(() => {
//     nock.cleanAll();
//     nock.disableNetConnect();
//   });

//   beforeEach(() => {
//     nock(baseApiUrl)
//       // Successful GET request on single resource
//       .persist()
//       .get(`/clusters/${clusterName}/apis/${mockSingleResource[0]}/${mockSingleResource[1]}/${mockSingleResource[2]}`)
//       .reply(200, JSON.stringify(newMockResponse))
//       // Successful GET request on multiple resources
//       .persist()
//       .get(`/clusters/${clusterName}/apis/${mockMultipleResource[0][0]}/${mockMultipleResource[0][1]}/${mockMultipleResource[0][2]}`)
//       .reply(200, JSON.stringify(newMockResponse))
//       .persist()
//       .get(`/clusters/${clusterName}/apis/${mockMultipleResource[1][0]}/${mockMultipleResource[1][1]}/${mockMultipleResource[1][2]}`)
//       .reply(200, JSON.stringify(newMockResponse));
//       console.log(baseApiUrl + `/clusters/${clusterName}/apis/${mockSingleResource[0]}/${mockSingleResource[1]}/${mockSingleResource[2]}`)
//   });

//   afterEach(() => {
//     nock.cleanAll();
//   });

//   afterAll(() => {
//     nock.enableNetConnect();
//   });

//   it('Successfully creates API client for single resource', async () => {
//     const client = apiProxy.apiFactory(mockSingleResource[0], mockSingleResource[1], mockSingleResource[2]);
//     const cb = jest.fn(((...args) => {console.log('<<<<>>>>>>>>>', args)}));
//     const errCb = jest.fn();

//     await client.list(cb, errCb, {}, clusterName);
//     await new Promise(resolve => setTimeout(resolve, 250));
//     expect(cb).toHaveBeenCalledWith(mockResponse);
//   });

//   it('Successfully creates API client for multiple resources', async () => {
//     const client = apiProxy.apiFactory([mockMultipleResource[0][0], mockMultipleResource[0][1], mockMultipleResource[0][2]],
//       [mockMultipleResource[1][0], mockMultipleResource[1][1], mockMultipleResource[1][2]]);
//     const cb = jest.fn();
//     const errCb = jest.fn();

//     await client.list(cb, errCb, {}, clusterName);
//     expect(cb).toHaveBeenCalledWith(mockResponse);
//   });
// });

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

// describe('streamResult', () => {

// });

// describe('streamResults', () => {

// });

// describe('stream', () => {
//   const testUrl = 'ws://localhost';
//   const errorMessage = { error: 'Error in api stream' };

//   beforeAll(() => {
//     jest.setTimeout(10000);
//     defineGlobalWebSocketMock();
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   function defineGlobalWebSocketMock(triggerError = false) {
//     global.WebSocket = jest.fn().mockImplementation((url, protocols) => {
//       return {
//         url,
//         protocols,
//         addEventListener: jest.fn((event, callback) => {
//           if (event === 'message' && !triggerError) {
//             setTimeout(() => callback({ data: JSON.stringify(mockResponse) }), 100);
//           } else if (event === 'error' && triggerError) {
//             setTimeout(() => callback(errorMessage), 100);
//           }
//         }),
//         removeEventListener: jest.fn(),
//         close: jest.fn(),
//         readyState: WebSocket.OPEN,
//       };
//     }) as unknown as typeof WebSocket;

//     Object.defineProperties(global.WebSocket, {
//       CONNECTING: { value: 0, enumerable: true},
//       OPEN: { value: 1, enumerable: true},
//       CLOSING: { value: 2, enumerable: true},
//       CLOSED: { value: 3, enumerable: true},
//     });
//   }

//   it('Successfully connects to the server and receives messages', async () => {
//     const cb = jest.fn();
//     const failCb = jest.fn();

//     apiProxy.stream(testUrl, cb, { failCb });

//     await new Promise((r) => setTimeout(r, 200));

//     expect(cb).toHaveBeenCalledWith(JSON.stringify(mockResponse));
//     expect(failCb).not.toHaveBeenCalled();
//   });

//   it('Successfully handles WebSocket errors', async () => {
//     defineGlobalWebSocketMock(true);

//     const cb = jest.fn();
//     const failCb = jest.fn();

//     apiProxy.stream(testUrl, cb, { failCb });

//     await new Promise((r) => setTimeout(r, 200));

//     expect(cb).not.toHaveBeenCalled();
//     expect(failCb).toEqual(errorMessage);
//   });
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
  const podname = 'test-pod';
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
      podname: podname,
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
      podname,
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
