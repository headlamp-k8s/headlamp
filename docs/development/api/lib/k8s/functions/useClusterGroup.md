# Function: useClusterGroup()

```ts
function useClusterGroup(): string[]
```

Get the group of clusters as defined in the URL. Updates when the cluster changes.

## Returns

`string`[]

the cluster group from the URL. If no cluster is defined in the URL, an empty list is returned.

## Defined in

[frontend/src/lib/k8s/index.ts:133](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/index.ts#L133)
