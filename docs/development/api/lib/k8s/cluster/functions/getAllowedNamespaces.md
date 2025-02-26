# Function: getAllowedNamespaces()

```ts
function getAllowedNamespaces(cluster: null | string): string[]
```

Gives an optionally configured list of allowed namespaces.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cluster` | `null` \| `string` | Optional cluster to check for allowed namespaces. If not given the current cluster allowed name spaces are used. |

## Returns

`string`[]

A list of configured name spaces for the given cluster or current cluster.
         If a zero length list, then no allowed namespace has been configured for cluster.
         If length > 0, allowed namespaces have been configured for this cluster.
         If not in a cluster it returns [].

There are cases where a user doesn't have the authority to list
all the namespaces. In that case it becomes difficult to access things
around Headlamp. To prevent this we can allow the user to pass a set
of namespaces they know they have access to and we can use this set to
make requests to the API server.

## Defined in

[frontend/src/lib/k8s/cluster.ts:35](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L35)
