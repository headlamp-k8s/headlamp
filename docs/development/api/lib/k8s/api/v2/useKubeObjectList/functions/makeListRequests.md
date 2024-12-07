# Function: makeListRequests()

```ts
function makeListRequests(
   clusters: string[], 
   getAllowedNamespaces: (cluster: null | string) => string[], 
   isResourceNamespaced: boolean, 
   requestedNamespaces?: string[]): object[]
```

Creates multiple requests to list Kube objects
Handles multiple clusters, namespaces and allowed namespaces

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `clusters` | `string`[] | list of clusters |
| `getAllowedNamespaces` | (`cluster`: `null` \| `string`) => `string`[] | function to get allowed namespaces for a cluster |
| `isResourceNamespaced` | `boolean` | if the resource is namespaced |
| `requestedNamespaces`? | `string`[] | requested namespaces(optional) |

## Returns

`object`[]

list of requests for clusters and appropriate namespaces

## Defined in

[frontend/src/lib/k8s/api/v2/useKubeObjectList.ts:166](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/useKubeObjectList.ts#L166)
