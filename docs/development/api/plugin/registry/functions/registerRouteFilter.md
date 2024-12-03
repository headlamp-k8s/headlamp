# Function: registerRouteFilter()

```ts
function registerRouteFilter(filterFunc: (entry: Route) => null | Route): void
```

Remove routes.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `filterFunc` | (`entry`: [`Route`](../../../lib/router/interfaces/Route.md)) => `null` \| [`Route`](../../../lib/router/interfaces/Route.md) | a function for filtering routes. |

## Returns

`void`

## Example

```tsx
import { registerRouteFilter } from '@kinvolk/headlamp-plugin/lib';

registerRouteFilter(route => (route.path === '/workloads' ? null : route));
```

## Defined in

[frontend/src/plugin/registry.tsx:296](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L296)
