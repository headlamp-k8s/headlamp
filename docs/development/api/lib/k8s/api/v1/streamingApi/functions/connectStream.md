# Function: connectStream()

```ts
function connectStream<T>(
   path: string, 
   cb: StreamResultsCb<T>, 
   onFail: () => void, 
   isJson: boolean, 
   additionalProtocols: string[], 
cluster: string): Promise<object>
```

Connects to a WebSocket stream at the specified path and returns an object
with a `close` function and a `socket` property. Sends messages to `cb` callback.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `path` | `string` | `undefined` | The path of the WebSocket stream to connect to. |
| `cb` | [`StreamResultsCb`](../type-aliases/StreamResultsCb.md)\<`T`\> | `undefined` | The function to call with each message received from the stream. |
| `onFail` | () => `void` | `undefined` | The function to call if the stream is closed unexpectedly. |
| `isJson` | `boolean` | `undefined` | Whether the messages should be parsed as JSON. |
| `additionalProtocols` | `string`[] | `[]` | An optional array of additional WebSocket protocols to use. |
| `cluster` | `string` | `''` | - |

## Returns

`Promise`\<`object`\>

An object with a `close` function and a `socket` property.

### close()

```ts
close: () => void;
```

#### Returns

`void`

### socket

```ts
socket: null | WebSocket;
```

## Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:347](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L347)
