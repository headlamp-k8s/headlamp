# Function: getRouteUseClusterURL()

```ts
function getRouteUseClusterURL(route: Route): boolean
```

Should the route use a cluster URL?

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `route` | [`Route`](../interfaces/Route.md) |  |

## Returns

`boolean`

true when a cluster URL contains cluster in the URL. eg. /c/minikube/my-url
  false, the URL does not contain the cluster. eg. /my-url

## Defined in

[frontend/src/lib/router.tsx:839](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/router.tsx#L839)
