# Function: renameCluster()

```ts
function renameCluster(
   cluster: string, 
   newClusterName: string, 
source: string): Promise<any>
```

renameCluster sends call to backend to update a field in kubeconfig which
is the custom name of the cluster used by the user.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cluster` | `string` |  |
| `newClusterName` | `string` | - |
| `source` | `string` | - |

## Returns

`Promise`\<`any`\>

## Defined in

[frontend/src/lib/k8s/api/v1/clusterApi.ts:138](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterApi.ts#L138)
