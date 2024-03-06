import nock from 'nock';
import * as apiProxy from './apiProxy';

describe('apiProxy functions', () => {
  const baseApiUrl = 'http://localhost';
  const testPath = '/test/url';
  const clusterName = 'test-cluster';
  const testData = { key: 'value' };
  const mockResponse = { data: 'mock response' };
  const errorResponse401 = { error: 'Unauthorized' };
  const errorResponse500 = { error: 'Internal Server Error' };

  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    // Successful POST request
    nock(baseApiUrl)
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

  it('Correctly calls post', async () => {
    const response = await apiProxy.post(testPath, testData, true, { cluster: clusterName });
    expect(response).toEqual(mockResponse);
  });
  it('Correctly calls patch', async () => {
    const response = await apiProxy.patch(testPath, testData, true, { cluster: clusterName });
    expect(response).toEqual(mockResponse);
  });
  it('Correctly calls put', async () => {
    const response = await apiProxy.put(testPath, testData, true, { cluster: clusterName });
    expect(response).toEqual(mockResponse);
  });
  it('Correctly calls remove', async () => {
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
  ])('Correctly handles %s with status %d', async (method, statusCode, errorResponse) => {
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
