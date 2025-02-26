# Function: listPortForward()

```ts
function listPortForward(cluster: string): Promise<PortForward[]>
```

Lists the port forwards for the specified cluster.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cluster` | `string` | The cluster to list the port forwards. |

## Returns

`Promise`\<[`PortForward`](../interfaces/PortForward.md)[]\>

the list of port forwards for the cluster.

## Defined in

[frontend/src/lib/k8s/api/v1/portForward.ts:129](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/portForward.ts#L129)
