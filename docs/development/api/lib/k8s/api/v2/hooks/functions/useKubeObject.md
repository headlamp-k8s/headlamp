# Function: useKubeObject()

```ts
function useKubeObject<K>(__namedParameters: object): [K | null, ApiError | null] & QueryResponse<K, ApiError>
```

Returns a single KubeObject.

## Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* [`KubeObject`](../../../../KubeObject/classes/KubeObject.md)\<`any`\> |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `__namedParameters` | \{ `cluster`: `string`; `kubeObjectClass`: (...`args`: `any`) => `K` & *typeof* [`KubeObject`](../../../../KubeObject/classes/KubeObject.md); `name`: `string`; `namespace`: `string`; `queryParams`: [`QueryParameters`](../../../v1/queryParameters/interfaces/QueryParameters.md); \} | - |
| `__namedParameters.cluster`? | `string` | Cluster name |
| `__namedParameters.kubeObjectClass` | (...`args`: `any`) => `K` & *typeof* [`KubeObject`](../../../../KubeObject/classes/KubeObject.md) | Class to instantiate the object with |
| `__namedParameters.name` | `string` | Object name |
| `__namedParameters.namespace`? | `string` | Object namespace |
| `__namedParameters.queryParams`? | [`QueryParameters`](../../../v1/queryParameters/interfaces/QueryParameters.md) | - |

## Returns

[`K` \| `null`, [`ApiError`](../../../v1/clusterRequests/interfaces/ApiError.md) \| `null`] & [`QueryResponse`](../interfaces/QueryResponse.md)\<`K`, [`ApiError`](../../../v1/clusterRequests/interfaces/ApiError.md)\>

## Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:71](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L71)
