import nock from 'nock';
import * as apiProxy from './apiProxy';

const baseApiUrl = 'http://localhost';
const mockResponse = { data: 'mock response' };
const clusterName = 'test-cluster';
const errorResponse401 = { error: 'Unauthorized', message: 'Unauthorized' };
const errorResponse500 = { error: 'Internal Server Error', message: 'Unauthorized' };

// describe('apiFactory', () => {
//   const mockSingleResource = ['groupA', 'v1', 'resourceA'];
//   const mockMultipleResource = [['groupB', 'v1', 'resourceB'], ['groupC', 'v1', 'resourceC']];

//   beforeAll(() => {
//     nock.cleanAll();
//     nock.disableNetConnect();
//   });

//   beforeEach(() => {
//     nock(baseApiUrl)
//       // Successful GET request on single resource
//       .persist()
//       .get(`/clusters/${clusterName}/apis/${mockSingleResource[0]}/${mockSingleResource[1]}/${mockSingleResource[2]}`)
//       .reply(200, mockResponse)
//       // Successful GET request on multiple resources
//       .persist()
//       .get(`/clusters/${clusterName}/apis/${mockMultipleResource[0][0]}/${mockMultipleResource[0][1]}/${mockMultipleResource[0][2]}`)
//       .reply(200, mockResponse)
//       .persist()
//       .get(`/clusters/${clusterName}/apis/${mockMultipleResource[1][0]}/${mockMultipleResource[1][1]}/${mockMultipleResource[1][2]}`)
//       .reply(200, mockResponse);
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

// });

// describe('apply', () => {

// });

// describe('metrics', () => {

// });

describe('testAuth', () => {
  const apiPath = '/apis/authorization.k8s.io/v1/selfsubjectrulesreviews';
  const spec = { namespace: 'default' };

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
      .reply(200, successResponse, { 'Content-Type': 'text/plain' });
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

// describe('startPortForward, stopOrDeletePortForward, listPortForward', () => {

// });

// describe('drainNode, drainNodeStatus', () => {

// });
