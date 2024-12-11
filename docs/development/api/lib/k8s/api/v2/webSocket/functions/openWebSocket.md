# Function: openWebSocket()

```ts
function openWebSocket<T>(url: string, options: object): Promise<WebSocket>
```

Create new WebSocket connection to the backend

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | WebSocket URL |
| `options` | \{ `cluster`: `string`; `onMessage`: (`data`: `T`) => `void`; `protocols`: `string` \| `string`[]; `type`: `"json"` \| `"binary"`; \} | Connection options |
| `options.cluster`? | `string` | Cluster name |
| `options.onMessage` | (`data`: `T`) => `void` | Message callback |
| `options.protocols`? | `string` \| `string`[] | Any additional protocols to include in WebSocket connection |
| `options.type` | `"json"` \| `"binary"` |  |

## Returns

`Promise`\<`WebSocket`\>

WebSocket connection

## Defined in

[frontend/src/lib/k8s/api/v2/webSocket.ts:18](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/webSocket.ts#L18)
