# Function: request()

```ts
function request(
   path: string, 
   params: RequestParams, 
   autoLogoutOnAuthError: boolean, 
   useCluster: boolean, 
queryParams?: QueryParameters): Promise<any>
```

Sends a request to the backend. If the useCluster parameter is true (which it is, by default), it will be
treated as a request to the Kubernetes server of the currently defined (in the URL) cluster.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `path` | `string` | `undefined` | The path to the API endpoint. |
| `params` | [`RequestParams`](../interfaces/RequestParams.md) | `{}` | Optional parameters for the request. |
| `autoLogoutOnAuthError` | `boolean` | `true` | Whether to automatically log out the user if there is an authentication error. |
| `useCluster` | `boolean` | `true` | Whether to use the current cluster for the request. |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) | `undefined` | Optional query parameters for the request. |

## Returns

`Promise`\<`any`\>

A Promise that resolves to the JSON response from the API server.

## Throws

An ApiError if the response status is not ok.

## Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:78](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L78)
