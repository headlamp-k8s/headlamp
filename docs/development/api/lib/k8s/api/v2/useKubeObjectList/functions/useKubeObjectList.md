# Function: useKubeObjectList()

```ts
function useKubeObjectList<K>(param: object): [K[] | null, ApiError | null] & QueryListResponse<(ListResponse<K> | undefined | null)[], K, ApiError>
```

Returns a combined list of Kubernetes objects and watches for changes from the clusters given.

## Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* [`KubeObject`](../../../../KubeObject/classes/KubeObject.md)\<`any`\> |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `param` | \{ `kubeObjectClass`: (...`args`: `any`) => `K` & *typeof* [`KubeObject`](../../../../KubeObject/classes/KubeObject.md); `queryParams`: [`QueryParameters`](../../../v1/queryParameters/interfaces/QueryParameters.md); `requests`: `object`[]; `watch`: `boolean`; \} | request paramaters |
| `param.kubeObjectClass` | (...`args`: `any`) => `K` & *typeof* [`KubeObject`](../../../../KubeObject/classes/KubeObject.md) | Class to instantiate the object with |
| `param.queryParams`? | [`QueryParameters`](../../../v1/queryParameters/interfaces/QueryParameters.md) | - |
| `param.requests` | `object`[] | - |
| `param.watch`? | `boolean` | Watch for updates **Default** `true` |

## Returns

[`K`[] \| `null`, [`ApiError`](../../../v1/clusterRequests/interfaces/ApiError.md) \| `null`] & [`QueryListResponse`](../../hooks/interfaces/QueryListResponse.md)\<([`ListResponse`](../interfaces/ListResponse.md)\<`K`\> \| `undefined` \| `null`)[], `K`, [`ApiError`](../../../v1/clusterRequests/interfaces/ApiError.md)\>

Combined list of Kubernetes resources

## Defined in

[frontend/src/lib/k8s/api/v2/useKubeObjectList.ts:190](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/useKubeObjectList.ts#L190)
