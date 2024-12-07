# Function: streamResultsForCluster()

```ts
function streamResultsForCluster(
   url: string, 
   params: StreamResultsParams, 
queryParams?: QueryParameters): Promise<() => void>
```

## Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |
| `params` | [`StreamResultsParams`](../interfaces/StreamResultsParams.md) |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) |

## Returns

`Promise`\<() => `void`\>

## Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:118](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L118)
