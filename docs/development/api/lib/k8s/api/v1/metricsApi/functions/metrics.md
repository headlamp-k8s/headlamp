# Function: metrics()

```ts
function metrics(
   url: string, 
   onMetrics: (arg: KubeMetrics[]) => void, 
   onError?: (err: ApiError) => void, 
cluster?: string): Promise<() => void>
```

Gets the metrics for the specified resource. Gets new metrics every 10 seconds.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | The url of the resource to get metrics for. |
| `onMetrics` | (`arg`: [`KubeMetrics`](../../../../cluster/interfaces/KubeMetrics.md)[]) => `void` | The function to call with the metrics. |
| `onError`? | (`err`: [`ApiError`](../../clusterRequests/interfaces/ApiError.md)) => `void` | The function to call if there's an error. |
| `cluster`? | `string` | The cluster to get metrics for. By default uses the current cluster (URL defined). |

## Returns

`Promise`\<() => `void`\>

A function to cancel the metrics request.

## Defined in

[frontend/src/lib/k8s/api/v1/metricsApi.ts:16](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/metricsApi.ts#L16)
