# Function: connectStreamWithParams()

```ts
function connectStreamWithParams<T>(
   path: string, 
   cb: StreamResultsCb<T>, 
   onFail: () => void, 
params?: StreamParams): Promise<object>
```

connectStreamWithParams is a wrapper around connectStream that allows for more
flexibility in the parameters that can be passed to the WebSocket connection.

This is an async function because it may need to fetch the kubeconfig for the
cluster if the cluster is specified in the params. If kubeconfig is found, it
sends the X-HEADLAMP-USER-ID header with the user ID from the localStorage.
It is sent as a base64url encoded string in protocal format:
`base64url.headlamp.authorization.k8s.io.${userID}`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `path` | `string` | The path of the WebSocket stream to connect to. |
| `cb` | [`StreamResultsCb`](../type-aliases/StreamResultsCb.md)\<`T`\> | The function to call with each message received from the stream. |
| `onFail` | () => `void` | The function to call if the stream is closed unexpectedly. |
| `params`? | `StreamParams` | Stream parameters to configure the connection. |

## Returns

`Promise`\<`object`\>

A promise that resolves to an object with a `close` function and a `socket` property.

### close()

```ts
close: () => void;
```

#### Returns

`void`

### socket

```ts
socket: WebSocket | null;
```

## Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:387](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L387)
