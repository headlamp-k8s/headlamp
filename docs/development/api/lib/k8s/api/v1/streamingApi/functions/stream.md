# Function: stream()

```ts
function stream<T>(
   url: string, 
   cb: StreamResultsCb<T>, 
   args: StreamArgs): object
```

Establishes a WebSocket connection to the specified URL and streams the results
to the provided callback function.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | The URL to connect to. |
| `cb` | [`StreamResultsCb`](../type-aliases/StreamResultsCb.md)\<`T`\> | The callback function to receive the streamed results. |
| `args` | [`StreamArgs`](../interfaces/StreamArgs.md) | Additional arguments to configure the stream. |

## Returns

`object`

An object with two functions: `cancel`, which can be called to cancel
the stream, and `getSocket`, which returns the WebSocket object.

### cancel()

```ts
cancel: () => void;
```

#### Returns

`void`

### getSocket()

```ts
getSocket: () => null | WebSocket;
```

#### Returns

`null` \| `WebSocket`

## Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:276](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L276)
