# Function: getResourceMetrics()

```ts
function getResourceMetrics(
   item: Node, 
   metrics: KubeMetrics[], 
   resourceType: "cpu" | "memory"): any[]
```

## Parameters

| Parameter | Type |
| ------ | ------ |
| `item` | [`Node`](../../k8s/node/classes/Node.md) |
| `metrics` | [`KubeMetrics`](../../k8s/cluster/interfaces/KubeMetrics.md)[] |
| `resourceType` | `"cpu"` \| `"memory"` |

## Returns

`any`[]

## Defined in

[frontend/src/lib/util.ts:132](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/util.ts#L132)
