# Function: drainNodeStatus()

```ts
function drainNodeStatus(cluster: string, nodeName: string): Promise<DrainNodeStatus>
```

Get the status of the drain node process.

It is used in the node detail page.
As draining a node is a long running process, we poll this endpoint to get
the status of the drain node process.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cluster` | `string` | The cluster to get the status of the drain node process for. |
| `nodeName` | `string` | The node name to get the status of the drain node process for. |

## Returns

`Promise`\<`DrainNodeStatus`\>

- The response from the API. @todo: what response?

## Throws

if the request fails

## Throws

if the response is not ok

## Defined in

[frontend/src/lib/k8s/api/v1/drainNode.ts:62](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/drainNode.ts#L62)
