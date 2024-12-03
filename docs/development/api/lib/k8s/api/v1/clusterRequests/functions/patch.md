# Function: patch()

```ts
function patch(
   url: string, 
   json: any, 
   autoLogoutOnAuthError: boolean, 
options: ClusterRequestParams): Promise<any>
```

## Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `url` | `string` | `undefined` |
| `json` | `any` | `undefined` |
| `autoLogoutOnAuthError` | `boolean` | `true` |
| `options` | [`ClusterRequestParams`](../interfaces/ClusterRequestParams.md) | `{}` |

## Returns

`Promise`\<`any`\>

## Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:238](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L238)
