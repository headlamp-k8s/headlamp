# Function: registerRoute()

```ts
function registerRoute(routeSpec: Route): void
```

Add a Route for a component.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `routeSpec` | [`Route`](../../../lib/router/interfaces/Route.md) | details of URL, highlighted sidebar and component to use. |

## Returns

`void`

## Example

```tsx
import { registerRoute } from '@kinvolk/headlamp-plugin/lib';

// Add a route that will display the given component and select
// the "traces" sidebar item.
registerRoute({
  path: '/traces',
  sidebar: 'traces',
  component: () => <TraceList />
});
```

## See

 - [Route examples](https://github.com/kinvolk/headlamp/blob/main/frontend/src/lib/router.tsx)
 - [Sidebar Example](http://github.com/kinvolk/headlamp/plugins/examples/sidebar/)

## Defined in

[frontend/src/plugin/registry.tsx:323](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L323)
