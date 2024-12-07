# Function: useClustersConf()

```ts
function useClustersConf(): ConfigState["allClusters"]
```

Hook for getting or fetching the clusters configuration.
This gets the clusters from the redux store. The redux store is updated
when the user changes the configuration. The configuration is stored in
the local storage. When stateless clusters are present, it combines the
stateless clusters with the clusters from the redux store.

## Returns

`ConfigState`\[`"allClusters"`\]

the clusters configuration.

## Defined in

[frontend/src/lib/k8s/index.ts:85](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/index.ts#L85)
