# Function: streamResult()

```ts
function streamResult<T>(
   url: string, 
   name: string, 
   cb: StreamResultsCb<T>, 
   errCb: StreamErrCb, 
   queryParams?: QueryParameters, 
cluster?: string): Promise<() => void>
```

Fetches the data and watches for changes to the data.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`KubeObjectInterface`](../../../../KubeObject/interfaces/KubeObjectInterface.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | The URL of the Kubernetes API endpoint. |
| `name` | `string` | The name of the Kubernetes API resource. |
| `cb` | [`StreamResultsCb`](../type-aliases/StreamResultsCb.md)\<`T`\> | The callback function to execute when the stream receives data. |
| `errCb` | [`StreamErrCb`](../type-aliases/StreamErrCb.md) | The callback function to execute when an error occurs. |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) | The query parameters to include in the API request. |
| `cluster`? | `string` | - |

## Returns

`Promise`\<() => `void`\>

A function to cancel the stream.

## Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:33](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L33)
