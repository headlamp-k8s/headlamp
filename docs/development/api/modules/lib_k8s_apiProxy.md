---
title: "Module: lib/k8s/apiProxy"
linkTitle: "lib/k8s/apiProxy"
slug: "lib_k8s_apiProxy"
---

## Interfaces

- [ApiError](../interfaces/lib_k8s_apiProxy.ApiError.md)
- [ApiInfo](../interfaces/lib_k8s_apiProxy.ApiInfo.md)
- [ClusterRequest](../interfaces/lib_k8s_apiProxy.ClusterRequest.md)
- [ClusterRequestParams](../interfaces/lib_k8s_apiProxy.ClusterRequestParams.md)
- [QueryParameters](../interfaces/lib_k8s_apiProxy.QueryParameters.md)
- [RequestParams](../interfaces/lib_k8s_apiProxy.RequestParams.md)
- [StreamArgs](../interfaces/lib_k8s_apiProxy.StreamArgs.md)
- [StreamResultsParams](../interfaces/lib_k8s_apiProxy.StreamResultsParams.md)

## Type aliases

### StreamErrCb

Ƭ **StreamErrCb**: (`err`: `Error` & { `status?`: `number`  }, `cancelStreamFunc?`: () => `void`) => `void`

#### Type declaration

▸ (`err`, `cancelStreamFunc?`): `void`

The callback that's called when there's an error streaming the results.

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` & { `status?`: `number`  } |
| `cancelStreamFunc?` | () => `void` |

##### Returns

`void`

#### Defined in

[lib/k8s/apiProxy.ts:457](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L457)

___

### StreamResultsCb

Ƭ **StreamResultsCb**: (...`args`: `any`[]) => `void`

#### Type declaration

▸ (...`args`): `void`

The callback that's called when some results are streamed in.

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`void`

#### Defined in

[lib/k8s/apiProxy.ts:455](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L455)

## Functions

### apiFactory

▸ **apiFactory**(...`args`): `Object`

Creates an API client for a single or multiple Kubernetes resources.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...args` | [group: string, version: string, resource: string] \| [group: string, version: string, resource: string][] | The arguments to pass to either `singleApiFactory` or `multipleApiFactory`. |

#### Returns

`Object`

An API client for the specified Kubernetes resource(s).

| Name | Type |
| :------ | :------ |
| `apiInfo` | { `group`: `string` ; `resource`: `string` ; `version`: `string`  }[] |
| `delete` | (`name`: `string`, `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md), `cluster?`: `string`) => `Promise`<`any`\> |
| `get` | (`name`: `string`, `cb`: [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb), `errCb`: [`StreamErrCb`](lib_k8s_apiProxy.md#streamerrcb), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md), `cluster?`: `string`) => `Promise`<() => `void`\> |
| `isNamespaced` | `boolean` |
| `list` | (`cb`: [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb), `errCb`: [`StreamErrCb`](lib_k8s_apiProxy.md#streamerrcb), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md), `cluster?`: `string`) => `Promise`<() => `void`\> |
| `patch` | (`body`: `OpPatch`[], `name`: `string`, `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md), `cluster?`: `string`) => `Promise`<`any`\> |
| `post` | (`body`: [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md), `cluster?`: `string`) => `Promise`<`any`\> |
| `put` | (`body`: [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md), `cluster?`: `string`) => `Promise`<`any`\> |

#### Defined in

[lib/k8s/apiProxy.ts:571](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L571)

___

### apiFactoryWithNamespace

▸ **apiFactoryWithNamespace**(...`args`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [group: string, version: string, resource: string, includeScale: boolean] \| [group: string, version: string, resource: string, includeScale: boolean][] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `scale?` | { `get`: (`namespace`: `string`, `name`: `string`, `clusterName?`: `string`) => `Promise`<`any`\> ; `put`: (`body`: { `metadata`: [`KubeMetadata`](../interfaces/lib_k8s_cluster.KubeMetadata.md) ; `spec`: { `replicas`: `number`  }  }, `clusterName?`: `string`) => `Promise`<`any`\>  } |
| `scale.get` | (`namespace`: `string`, `name`: `string`, `clusterName?`: `string`) => `Promise`<`any`\> |
| `scale.put` | (`body`: { `metadata`: [`KubeMetadata`](../interfaces/lib_k8s_cluster.KubeMetadata.md) ; `spec`: { `replicas`: `number`  }  }, `clusterName?`: `string`) => `Promise`<`any`\> |

#### Defined in

[lib/k8s/apiProxy.ts:700](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L700)

___

### apply

▸ **apply**(`body`, `clusterName?`): `Promise`<`JSON`\>

Applies the provided body to the Kubernetes API.

Tries to POST, and if there's a conflict it does a PUT to the api endpoint.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `body` | [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md) | The kubernetes object body to apply. |
| `clusterName?` | `string` | The cluster to apply the body to. By default uses the current cluster (URL defined). |

#### Returns

`Promise`<`JSON`\>

The response from the kubernetes API server.

#### Defined in

[lib/k8s/apiProxy.ts:1521](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1521)

___

### clusterRequest

▸ **clusterRequest**(`path`, `params?`, `queryParams?`): `Promise`<`any`\>

Sends a request to the backend. If the cluster is required in the params parameter, it will
be used as a request to the respective Kubernetes server.

**`throws`** An ApiError if the response status is not ok.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` | The path to the API endpoint. |
| `params` | [`ClusterRequestParams`](../interfaces/lib_k8s_apiProxy.ClusterRequestParams.md) | Optional parameters for the request. |
| `queryParams?` | [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md) | Optional query parameters for the k8s request. |

#### Returns

`Promise`<`any`\>

A Promise that resolves to the JSON response from the API server.

#### Defined in

[lib/k8s/apiProxy.ts:339](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L339)

___

### deleteCluster

▸ **deleteCluster**(`cluster`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cluster` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:1673](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1673)

___

### deletePlugin

▸ **deletePlugin**(`name`): `Promise`<`any`\>

Deletes the plugin with the specified name from the system.

This function sends a DELETE request to the server's plugin management
endpoint, targeting the plugin identified by its name.
The function handles the request asynchronously and returns a promise that
resolves with the server's response to the DELETE operation.

**`throws`** — An ApiError if the response status is not ok.

**`example`**
// Call to delete a plugin named 'examplePlugin'
deletePlugin('examplePlugin')
  .then(response => console.log('Plugin deleted successfully', response))
  .catch(error => console.error('Failed to delete plugin', error));

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The unique name of the plugin to delete.  This identifier is used to construct the URL for the DELETE request. |

#### Returns

`Promise`<`any`\>

— A Promise that resolves to the JSON response from the API server.

#### Defined in

[lib/k8s/apiProxy.ts:1925](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1925)

___

### drainNode

▸ **drainNode**(`cluster`, `nodeName`): `Promise`<`any`\>

Drain a node

**`throws`** {Error} if the request fails

**`throws`** {Error} if the response is not ok

This function is used to drain a node. It is used in the node detail page.
As draining a node is a long running process, we get the request received
message if the request is successful. And then we poll the drain node status endpoint
to get the status of the drain node process.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cluster` | `string` | The cluster to drain the node |
| `nodeName` | `string` | The node name to drain |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:1810](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1810)

___

### drainNodeStatus

▸ **drainNodeStatus**(`cluster`, `nodeName`): `Promise`<`DrainNodeStatus`\>

Get the status of the drain node process.

It is used in the node detail page.
As draining a node is a long running process, we poll this endpoint to get
the status of the drain node process.

**`throws`** {Error} if the request fails

**`throws`** {Error} if the response is not ok

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cluster` | `string` | The cluster to get the status of the drain node process for. |
| `nodeName` | `string` | The node name to get the status of the drain node process for. |

#### Returns

`Promise`<`DrainNodeStatus`\>

- The response from the API. @todo: what response?

#### Defined in

[lib/k8s/apiProxy.ts:1852](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1852)

___

### listPortForward

▸ **listPortForward**(`cluster`): `Promise`<`any`\>

Lists the port forwards for the specified cluster.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cluster` | `string` | The cluster to list the port forwards. |

#### Returns

`Promise`<`any`\>

the list of port forwards for the cluster.

#### Defined in

[lib/k8s/apiProxy.ts:1787](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1787)

___

### metrics

▸ **metrics**(`url`, `onMetrics`, `onError?`, `cluster?`): `Promise`<() => `void`\>

Gets the metrics for the specified resource. Gets new metrics every 10 seconds.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The url of the resource to get metrics for. |
| `onMetrics` | (`arg`: [`KubeMetrics`](../interfaces/lib_k8s_cluster.KubeMetrics.md)[]) => `void` | The function to call with the metrics. |
| `onError?` | (`err`: [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void` | The function to call if there's an error. |
| `cluster?` | `string` | The cluster to get metrics for. By default uses the current cluster (URL defined). |

#### Returns

`Promise`<() => `void`\>

A function to cancel the metrics request.

#### Defined in

[lib/k8s/apiProxy.ts:1583](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1583)

___

### patch

▸ **patch**(`url`, `json`, `autoLogoutOnAuthError?`, `options?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `url` | `string` | `undefined` |
| `json` | `any` | `undefined` |
| `autoLogoutOnAuthError` | `boolean` | `true` |
| `options` | [`ClusterRequestParams`](../interfaces/lib_k8s_apiProxy.ClusterRequestParams.md) | `{}` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:976](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L976)

___

### post

▸ **post**(`url`, `json`, `autoLogoutOnAuthError?`, `options?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `url` | `string` | `undefined` |
| `json` | `object` \| [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md) \| `JSON` | `undefined` |
| `autoLogoutOnAuthError` | `boolean` | `true` |
| `options` | [`ClusterRequestParams`](../interfaces/lib_k8s_apiProxy.ClusterRequestParams.md) | `{}` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:957](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L957)

___

### put

▸ **put**(`url`, `json`, `autoLogoutOnAuthError?`, `requestOptions?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `url` | `string` | `undefined` |
| `json` | `Partial`<[`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md)\> | `undefined` |
| `autoLogoutOnAuthError` | `boolean` | `true` |
| `requestOptions` | [`ClusterRequestParams`](../interfaces/lib_k8s_apiProxy.ClusterRequestParams.md) | `{}` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:996](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L996)

___

### remove

▸ **remove**(`url`, `requestOptions?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `requestOptions` | [`ClusterRequestParams`](../interfaces/lib_k8s_apiProxy.ClusterRequestParams.md) |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:1015](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1015)

___

### request

▸ **request**(`path`, `params?`, `autoLogoutOnAuthError?`, `useCluster?`, `queryParams?`): `Promise`<`any`\>

Sends a request to the backend. If the useCluster parameter is true (which it is, by default), it will be
treated as a request to the Kubernetes server of the currently defined (in the URL) cluster.

**`throws`** An ApiError if the response status is not ok.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `path` | `string` | `undefined` | The path to the API endpoint. |
| `params` | [`RequestParams`](../interfaces/lib_k8s_apiProxy.RequestParams.md) | `{}` | Optional parameters for the request. |
| `autoLogoutOnAuthError` | `boolean` | `true` | Whether to automatically log out the user if there is an authentication error. |
| `useCluster` | `boolean` | `true` | Whether to use the current cluster for the request. |
| `queryParams?` | [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md) | `undefined` | Optional query parameters for the request. |

#### Returns

`Promise`<`any`\>

A Promise that resolves to the JSON response from the API server.

#### Defined in

[lib/k8s/apiProxy.ts:303](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L303)

___

### setCluster

▸ **setCluster**(`clusterReq`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `clusterReq` | [`ClusterRequest`](../interfaces/lib_k8s_apiProxy.ClusterRequest.md) |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:1635](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1635)

___

### startPortForward

▸ **startPortForward**(`cluster`, `namespace`, `podname`, `containerPort`, `service`, `serviceNamespace`, `port?`, `address?`, `id?`): `Promise`<`any`\>

Starts a portforward with the given details.

**`throws`** {Error} if the request fails.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cluster` | `string` | `undefined` | The cluster to portforward for. |
| `namespace` | `string` | `undefined` | The namespace to portforward for. |
| `podname` | `string` | `undefined` | The pod to portforward for. |
| `containerPort` | `string` \| `number` | `undefined` | The container port to portforward for. |
| `service` | `string` | `undefined` | The service to portforward for. |
| `serviceNamespace` | `string` | `undefined` | The service namespace to portforward for. |
| `port?` | `string` | `undefined` | The port to portforward for. |
| `address` | `string` | `''` | - |
| `id` | `string` | `''` | The id to portforward for. |

#### Returns

`Promise`<`any`\>

The response from the API.

#### Defined in

[lib/k8s/apiProxy.ts:1710](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1710)

___

### stopOrDeletePortForward

▸ **stopOrDeletePortForward**(`cluster`, `id`, `stopOrDelete?`): `Promise`<`string`\>

Stops or deletes a portforward with the specified details.

**`throws`** {Error} if the request fails.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cluster` | `string` | `undefined` | The cluster to portforward for. |
| `id` | `string` | `undefined` | The id to portforward for. |
| `stopOrDelete` | `boolean` | `true` | Whether to stop or delete the portforward. True for stop, false for delete. |

#### Returns

`Promise`<`string`\>

The response from the API.

#### Defined in

[lib/k8s/apiProxy.ts:1760](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1760)

___

### stream

▸ **stream**(`url`, `cb`, `args`): `Object`

Establishes a WebSocket connection to the specified URL and streams the results
to the provided callback function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL to connect to. |
| `cb` | [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb) | The callback function to receive the streamed results. |
| `args` | [`StreamArgs`](../interfaces/lib_k8s_apiProxy.StreamArgs.md) | Additional arguments to configure the stream. |

#### Returns

`Object`

An object with two functions: `cancel`, which can be called to cancel
the stream, and `getSocket`, which returns the WebSocket object.

| Name | Type |
| :------ | :------ |
| `cancel` | () => `void` |
| `getSocket` | () => ``null`` \| `WebSocket` |

#### Defined in

[lib/k8s/apiProxy.ts:1287](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1287)

___

### streamResult

▸ **streamResult**(`url`, `name`, `cb`, `errCb`, `queryParams?`, `cluster?`): `Promise`<() => `void`\>

Streams the results of a Kubernetes API request into a 'cb' callback.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL of the Kubernetes API endpoint. |
| `name` | `string` | The name of the Kubernetes API resource. |
| `cb` | [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb) | The callback function to execute when the stream receives data. |
| `errCb` | [`StreamErrCb`](lib_k8s_apiProxy.md#streamerrcb) | The callback function to execute when an error occurs. |
| `queryParams?` | [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md) | The query parameters to include in the API request. |
| `cluster?` | `string` | - |

#### Returns

`Promise`<() => `void`\>

A function to cancel the stream.

#### Defined in

[lib/k8s/apiProxy.ts:1033](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1033)

___

### streamResults

▸ **streamResults**(`url`, `cb`, `errCb`, `queryParams`): `Promise`<() => `void`\>

Streams the results of a Kubernetes API request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL of the Kubernetes API endpoint. |
| `cb` | [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb) | The callback function to execute when the stream receives data. |
| `errCb` | [`StreamErrCb`](lib_k8s_apiProxy.md#streamerrcb) | The callback function to execute when an error occurs. |
| `queryParams` | `undefined` \| [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md) | The query parameters to include in the API request. |

#### Returns

`Promise`<() => `void`\>

A function to cancel the stream.

#### Defined in

[lib/k8s/apiProxy.ts:1100](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1100)

___

### streamResultsForCluster

▸ **streamResultsForCluster**(`url`, `params`, `queryParams`): `Promise`<() => `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `params` | [`StreamResultsParams`](../interfaces/lib_k8s_apiProxy.StreamResultsParams.md) |
| `queryParams` | `undefined` \| [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md) |

#### Returns

`Promise`<() => `void`\>

#### Defined in

[lib/k8s/apiProxy.ts:1121](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1121)

___

### testAuth

▸ **testAuth**(`cluster?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cluster` | `string` | `''` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:1620](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1620)

___

### testClusterHealth

▸ **testClusterHealth**(`cluster?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cluster?` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:1630](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1630)
