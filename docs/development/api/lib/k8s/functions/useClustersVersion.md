# Function: useClustersVersion()

```ts
function useClustersVersion(clusters: Cluster[]): [object, object]
```

Hook to get the version of the clusters given by the parameter.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `clusters` | [`Cluster`](../cluster/interfaces/Cluster.md)[] |  |

## Returns

[`object`, `object`]

a map with cluster -> version-info, and a map with cluster -> error.

## Defined in

[frontend/src/lib/k8s/index.ts:289](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/index.ts#L289)
