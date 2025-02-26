# Function: drainNode()

```ts
function drainNode(cluster: string, nodeName: string): Promise<any>
```

Drain a node

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cluster` | `string` | The cluster to drain the node |
| `nodeName` | `string` | The node name to drain |

## Returns

`Promise`\<`any`\>

## Throws

if the request fails

## Throws

if the response is not ok

This function is used to drain a node. It is used in the node detail page.
As draining a node is a long running process, we get the request received
message if the request is successful. And then we poll the drain node status endpoint
to get the status of the drain node process.

## Defined in

[frontend/src/lib/k8s/api/v1/drainNode.ts:20](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/drainNode.ts#L20)
