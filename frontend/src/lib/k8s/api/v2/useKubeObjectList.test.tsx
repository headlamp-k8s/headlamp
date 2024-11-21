import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import {
  kubeObjectListQuery,
  ListResponse,
  makeListRequests,
  useWatchKubeObjectLists,
} from './useKubeObjectList';
import * as websocket from './webSocket';

describe('makeListRequests', () => {
  describe('for non namespaced resource', () => {
    it('should not include namespace in requests', () => {
      const requests = makeListRequests(['default'], () => ['namespace-a'], false, [
        'namepspace-a',
        'namespace-b',
      ]);
      expect(requests).toEqual([{ cluster: 'default', namespaces: undefined }]);
    });
  });
  describe('for namespaced resource', () => {
    it('should make request with no namespaces provided', () => {
      const requests = makeListRequests(['default'], () => [], true);
      expect(requests).toEqual([{ cluster: 'default', namespaces: [] }]);
    });

    it('should make requests for allowed namespaces only', () => {
      const requests = makeListRequests(['default'], () => ['namespace-a'], true);
      expect(requests).toEqual([{ cluster: 'default', namespaces: ['namespace-a'] }]);
    });

    it('should make requests for allowed namespaces only, even when requested other', () => {
      const requests = makeListRequests(['default'], () => ['namespace-a'], true, [
        'namespace-a',
        'namespace-b',
      ]);
      expect(requests).toEqual([{ cluster: 'default', namespaces: ['namespace-a'] }]);
    });

    it('should make requests for allowed namespaces per cluster', () => {
      const requests = makeListRequests(
        ['cluster-a', 'cluster-b'],
        (cluster: string | null) => (cluster === 'cluster-a' ? ['namespace-a'] : ['namespace-b']),
        true
      );
      expect(requests).toEqual([
        { cluster: 'cluster-a', namespaces: ['namespace-a'] },
        { cluster: 'cluster-b', namespaces: ['namespace-b'] },
      ]);
    });

    it('should make requests for allowed namespaces per cluster, even if requested other', () => {
      const requests = makeListRequests(
        ['cluster-a', 'cluster-b'],
        (cluster: string | null) => (cluster === 'cluster-a' ? ['namespace-a'] : ['namespace-b']),
        true,
        ['namespace-a', 'namespace-b', 'namespace-c']
      );
      expect(requests).toEqual([
        { cluster: 'cluster-a', namespaces: ['namespace-a'] },
        { cluster: 'cluster-b', namespaces: ['namespace-b'] },
      ]);
    });

    it('should make requests for allowed namespaces per cluster, with one cluster without allowed namespaces', () => {
      const requests = makeListRequests(
        ['cluster-a', 'cluster-b'],
        (cluster: string | null) => (cluster === 'cluster-a' ? ['namespace-a'] : []),
        true,
        ['namespace-a', 'namespace-b', 'namespace-c']
      );
      expect(requests).toEqual([
        { cluster: 'cluster-a', namespaces: ['namespace-a'] },
        { cluster: 'cluster-b', namespaces: ['namespace-a', 'namespace-b', 'namespace-c'] },
      ]);
    });
  });
});

const mockClass = class {
  static apiVersion = 'v1';
  static apiName = 'pods';

  constructor(public jsonData: any) {}
} as any;

describe('useWatchKubeObjectLists', () => {
  it('should not be enabled when no endpoint is provided', () => {
    const spy = vi.spyOn(websocket, 'useWebSockets');
    const queryClient = new QueryClient();
    renderHook(() => useWatchKubeObjectLists({ kubeObjectClass: mockClass, lists: [] }), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    expect(spy).toHaveBeenCalledWith({ enabled: false, connections: [] });
  });

  it('should call useWebSockets when endpoint and lists are provided', () => {
    const spy = vi.spyOn(websocket, 'useWebSockets');
    const queryClient = new QueryClient();

    renderHook(
      () =>
        useWatchKubeObjectLists({
          kubeObjectClass: mockClass,
          lists: [{ cluster: 'default', resourceVersion: '1' }],
          endpoint: { version: 'v1', resource: 'pods' },
        }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        ),
      }
    );

    expect(spy.mock.calls[0][0].enabled).toBe(true);
    expect(spy.mock.calls[0][0].connections[0].cluster).toBe('default');
    expect(spy.mock.calls[0][0].connections[0].url).toBe('api/v1/pods?watch=1&resourceVersion=1');
  });

  it('should call useWebSockets when endpoint and 2 lists are provided', () => {
    const spy = vi.spyOn(websocket, 'useWebSockets');
    const queryClient = new QueryClient();

    renderHook(
      () =>
        useWatchKubeObjectLists({
          kubeObjectClass: mockClass,
          lists: [
            { cluster: 'default', resourceVersion: '1', namespace: 'a' },
            { cluster: 'default', resourceVersion: '1', namespace: 'b' },
          ],
          endpoint: { version: 'v1', resource: 'pods' },
        }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        ),
      }
    );

    expect(spy.mock.calls[0][0].enabled).toBe(true);
    expect(spy.mock.calls[0][0].connections[0].cluster).toBe('default');
    expect(spy.mock.calls[0][0].connections[0].url).toBe(
      'api/v1/namespaces/a/pods?watch=1&resourceVersion=1'
    );

    expect(spy.mock.calls[0][0].connections[1].cluster).toBe('default');
    expect(spy.mock.calls[0][0].connections[1].url).toBe(
      'api/v1/namespaces/b/pods?watch=1&resourceVersion=1'
    );
  });

  it('should update query data on ADDED message', () => {
    const useWebSocketSpy = vi.spyOn(websocket, 'useWebSockets');
    const queryClient = new QueryClient();

    // Given
    const kubeObjectClass = mockClass;
    const endpoint = { version: 'v1', resource: 'pods' };
    const lists = [
      { cluster: 'default', resourceVersion: '1', namespace: 'a' },
      { cluster: 'default', resourceVersion: '1', namespace: 'b' },
    ];
    const cluster = 'default';
    const queryParams = {};
    const keyForNamespaceA = kubeObjectListQuery(
      mockClass,
      endpoint,
      'a',
      cluster,
      queryParams
    ).queryKey;
    const keyForNamespaceB = kubeObjectListQuery(
      mockClass,
      endpoint,
      'b',
      cluster,
      queryParams
    ).queryKey;

    // Prepopulate query data with existing list
    queryClient.setQueryData(keyForNamespaceA, {
      list: { items: [], metadata: { resourceVersion: '0' } },
      cluster,
    });
    queryClient.setQueryData(keyForNamespaceB, {
      list: { items: [], metadata: { resourceVersion: '0' } },
      cluster,
    });

    // When watching lists
    renderHook(() => useWatchKubeObjectLists({ kubeObjectClass, lists, endpoint }), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    // And receiving updates
    const connectionToNamespaceA = useWebSocketSpy.mock.calls[0][0].connections[0];
    const objectA = { metadata: { namespace: 'a', resourceVersion: '123' } };
    connectionToNamespaceA.onMessage({
      type: 'ADDED',
      object: objectA,
    });
    const connectionToNamespaceB = useWebSocketSpy.mock.calls[0][0].connections[1];
    const objectB = { metadata: { namespace: 'b', resourceVersion: '123' } };
    connectionToNamespaceB.onMessage({
      type: 'ADDED',
      object: objectB,
    });

    // Should put object in the appropriate query data
    expect(
      (queryClient.getQueryData(keyForNamespaceA) as ListResponse<any>).list.items[0].jsonData
    ).toBe(objectA);

    expect(
      (queryClient.getQueryData(keyForNamespaceB) as ListResponse<any>).list.items[0].jsonData
    ).toBe(objectB);
  });
});
