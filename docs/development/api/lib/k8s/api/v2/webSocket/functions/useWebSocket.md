# Function: useWebSocket()

```ts
function useWebSocket<T>(__namedParameters: object): void
```

Creates or joins existing WebSocket connection

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `__namedParameters` | \{ `cluster`: `string`; `enabled`: `boolean`; `onMessage`: (`data`: `T`) => `void`; `protocols`: `string` \| `string`[]; `type`: `"json"` \| `"binary"`; `url`: () => `string`; \} | - |
| `__namedParameters.cluster`? | `string` | Cluster name |
| `__namedParameters.enabled`? | `boolean` | - |
| `__namedParameters.onMessage` | (`data`: `T`) => `void` | Message callback |
| `__namedParameters.protocols`? | `string` \| `string`[] | Any additional protocols to include in WebSocket connection |
| `__namedParameters.type`? | `"json"` \| `"binary"` | Type of websocket data |
| `__namedParameters.url` | () => `string` | - |

## Returns

`void`

## Defined in

[frontend/src/lib/k8s/api/v2/webSocket.ts:92](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/webSocket.ts#L92)
