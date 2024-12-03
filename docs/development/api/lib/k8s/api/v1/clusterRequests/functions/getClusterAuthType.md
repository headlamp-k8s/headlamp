# Function: getClusterAuthType()

```ts
function getClusterAuthType(cluster: string): string
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cluster` | `string` | Name of the cluster. |

## Returns

`string`

Auth type of the cluster, or an empty string if the cluster is not found.
It could return 'oidc' or '' for example.

## Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:59](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L59)
