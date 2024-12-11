# Function: parseKubeConfig()

```ts
function parseKubeConfig(clusterReq: ClusterRequest): Promise<any>
```

parseKubeConfig sends call to backend to parse kubeconfig and send back
the parsed clusters and contexts.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `clusterReq` | [`ClusterRequest`](../../clusterRequests/interfaces/ClusterRequest.md) | The cluster request object. |

## Returns

`Promise`\<`any`\>

## Defined in

[frontend/src/lib/k8s/api/v1/clusterApi.ts:164](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterApi.ts#L164)
