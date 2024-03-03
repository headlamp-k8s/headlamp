import nock from 'nock';
import * as apiProxy from './apiProxy';

describe('apiProxy functions', () => {
  const baseApiUrl = 'http://localhost';
  const testPath = '/test/url';
  const clusterName = 'test-cluster';
  const testData = { key: 'value' };
  const mockResponse = { data: 'mock response' };

  beforeAll(() => {
    nock.disableNetConnect();
    // POST request
    nock(baseApiUrl)
      .persist()
      .post(`/clusters/${clusterName}` + testPath, testData)
      .reply(200, mockResponse);
    // PATCH request
    nock(baseApiUrl)
      .persist()
      .patch(`/clusters/${clusterName}` + testPath, testData)
      .reply(200, mockResponse);
    // PUT request
    nock(baseApiUrl)
      .persist()
      .put(`/clusters/${clusterName}` + testPath, testData)
      .reply(200, mockResponse);
    // DELETE request
    nock(baseApiUrl)
      .persist()
      .delete(`/clusters/${clusterName}` + testPath)
      .reply(200, mockResponse);
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Correctly calls POST', async () => {
    const response = await apiProxy.post(testPath, testData, true, { cluster: clusterName });
    expect(response).toEqual(mockResponse);
  });

  it('Correctly calls PATCH', async () => {
    const response = await apiProxy.patch(testPath, testData, true, { cluster: clusterName });
    expect(response).toEqual(mockResponse);
  });

  it('Correctly calls PUT', async () => {
    const response = await apiProxy.put(testPath, testData, true, { cluster: clusterName });
    expect(response).toEqual(mockResponse);
  });

  it('Correctly calls DELETE', async () => {
    const response = await apiProxy.remove(testPath, { cluster: clusterName });
    expect(response).toEqual(mockResponse);
  });
});
