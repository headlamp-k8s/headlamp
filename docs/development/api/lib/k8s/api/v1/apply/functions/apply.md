# Function: apply()

```ts
function apply<T>(body: T, clusterName?: string): Promise<T>
```

Applies the provided body to the Kubernetes API.

Tries to POST, and if there's a conflict it does a PUT to the api endpoint.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`KubeObjectInterface`](../../../../KubeObject/interfaces/KubeObjectInterface.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `body` | `T` | The kubernetes object body to apply. |
| `clusterName`? | `string` | The cluster to apply the body to. By default uses the current cluster (URL defined). |

## Returns

`Promise`\<`T`\>

The response from the kubernetes API server.

## Defined in

[frontend/src/lib/k8s/api/v1/apply.ts:18](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/apply.ts#L18)
