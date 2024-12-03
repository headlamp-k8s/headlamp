# Function: registerHeadlampEventCallback()

```ts
function registerHeadlampEventCallback(callback: HeadlampEventCallback): void
```

Add a callback for headlamp events.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback` | [`HeadlampEventCallback`](../type-aliases/HeadlampEventCallback.md) | The callback to add. |

## Returns

`void`

## Example

```ts
import {
  DefaultHeadlampEvents,
  registerHeadlampEventCallback,
  HeadlampEvent,
} from '@kinvolk/headlamp-plugin/lib';

registerHeadlampEventCallback((event: HeadlampEvent) => {
  if (event.type === DefaultHeadlampEvents.ERROR_BOUNDARY) {
    console.error('Error:', event.data);
  } else {
    console.log(`Headlamp event of type ${event.type}: ${event.data}`)
  }
});
```

## Defined in

[frontend/src/plugin/registry.tsx:633](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L633)
