import * as jsyaml from 'js-yaml';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { updateStatelessClusterKubeconfig } from './index';

// Helper function to create mock IDB request
function createMockRequest(): MockRequest {
  return {
    onsuccess: null,
    onerror: null,
    result: null,
    error: null,
    source: {} as IDBObjectStore,
    transaction: {} as IDBTransaction,
    readyState: 'pending' as IDBRequestReadyState,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  };
}

// Helper function to create mock cursor
function createMockCursor(kubeconfig: string) {
  return {
    value: { kubeconfig, id: 1 },
    key: 1,
    continue: () => {},
    update: () => {},
    delete: () => {},
    source: {} as IDBObjectStore,
    direction: 'next',
    primaryKey: 1,
  };
}

interface MockRequest extends IDBRequest {
  onsuccess: ((this: IDBRequest, ev: Event) => any) | null;
  onerror: ((this: IDBRequest, ev: Event) => any) | null;
  result: any;
  error: DOMException | null;
  source: IDBObjectStore;
  transaction: IDBTransaction;
  readyState: IDBRequestReadyState;
}

describe('updateStatelessClusterKubeconfig', () => {
  const mockStore = {
    put: vi.fn().mockImplementation(() => {
      const request = createMockRequest();
      setTimeout(() => {
        request.onsuccess?.(new Event('success'));
      }, 0);
      return request;
    }),
    openCursor: vi.fn().mockImplementation(() => {
      const request = createMockRequest();
      return request;
    }),
  };

  const mockDB = {
    transaction: vi.fn().mockReturnValue({
      objectStore: vi.fn().mockReturnValue(mockStore),
    }),
    name: 'mockDB',
    version: 1,
    objectStoreNames: ['kubeconfigs'] as unknown as DOMStringList,
    onabort: null,
    onclose: null,
    onerror: null,
    onversionchange: null,
    close: vi.fn(),
    createObjectStore: vi.fn(),
    deleteObjectStore: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn().mockReturnValue(true),
  } as IDBDatabase;

  beforeAll(() => {
    const mockIDBRequest = {
      result: mockDB,
      onupgradeneeded: null,
      onsuccess: null,
      onerror: null,
    } as IDBOpenDBRequest;

    vi.stubGlobal('indexedDB', {
      open: vi.fn().mockImplementation(() => {
        setTimeout(() => {
          mockIDBRequest.onsuccess?.({ target: { result: mockDB } } as any);
        }, 0);
        return mockIDBRequest;
      }),
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  function setupMockCursor(base64Kubeconfig: string) {
    mockStore.openCursor.mockImplementation(() => {
      const request = createMockRequest();
      setTimeout(() => {
        if (request.onsuccess) {
          const cursor = createMockCursor(base64Kubeconfig);
          const event = { target: { result: cursor } };
          request.onsuccess(event as any);
        }
      }, 0);
      return request;
    });
  }

  function createTestKubeconfig(contextName: string, extensions?: any[]) {
    return {
      contexts: [
        {
          name: contextName,
          context: {
            cluster: contextName,
            user: 'test-user',
            ...(extensions && { extensions }),
          },
        },
      ],
    };
  }

  it('should update existing kubeconfig with new custom name', async () => {
    const mockKubeconfig = createTestKubeconfig('test-cluster');
    const base64Kubeconfig = btoa(jsyaml.dump(mockKubeconfig));
    setupMockCursor(base64Kubeconfig);

    await updateStatelessClusterKubeconfig(base64Kubeconfig, 'new-name', 'test-cluster');
    expect(mockStore.put).toHaveBeenCalled();
  });

  it('should reject if no matching context is found', async () => {
    const mockKubeconfig = createTestKubeconfig('different-cluster');
    const base64Kubeconfig = btoa(jsyaml.dump(mockKubeconfig));

    await expect(
      updateStatelessClusterKubeconfig(base64Kubeconfig, 'new-name', 'test-cluster')
    ).rejects.toEqual('No context found matching the cluster name');
  });

  it('should update existing headlamp_info extension', async () => {
    const mockKubeconfig = createTestKubeconfig('test-cluster', [
      {
        name: 'headlamp_info',
        extension: {
          customName: 'old-name',
        },
      },
    ]);

    const base64Kubeconfig = btoa(jsyaml.dump(mockKubeconfig));
    setupMockCursor(base64Kubeconfig);

    await updateStatelessClusterKubeconfig(base64Kubeconfig, 'new-name', 'test-cluster');
    expect(mockStore.put).toHaveBeenCalled();
  });
});
