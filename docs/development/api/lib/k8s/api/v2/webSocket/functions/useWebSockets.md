# Function: useWebSockets()

```ts
function useWebSockets<T>(__namedParameters: object): void
```

Creates or joins mutiple existing WebSocket connections

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `__namedParameters` | \{ `connections`: [`WebSocketConnectionRequest`](../type-aliases/WebSocketConnectionRequest.md)\<`T`\>[]; `enabled`: `boolean`; `protocols`: `string` \| `string`[]; `type`: `"json"` \| `"binary"`; \} | - |
| `__namedParameters.connections` | [`WebSocketConnectionRequest`](../type-aliases/WebSocketConnectionRequest.md)\<`T`\>[] | Make sure that connections value is stable between renders |
| `__namedParameters.enabled`? | `boolean` | - |
| `__namedParameters.protocols`? | `string` \| `string`[] | Any additional protocols to include in WebSocket connection make sure that the value is stable between renders |
| `__namedParameters.type`? | `"json"` \| `"binary"` | Type of websocket data |

## Returns

`void`

## Defined in

[frontend/src/lib/k8s/api/v2/webSocket.ts:141](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/webSocket.ts#L141)
