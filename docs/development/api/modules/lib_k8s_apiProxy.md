---
title: "Module: lib/k8s/apiProxy"
linkTitle: "lib/k8s/apiProxy"
slug: "lib_k8s_apiProxy"
---

## Interfaces

- [ApiError](../interfaces/lib_k8s_apiProxy.ApiError.md)
- [ClusterRequest](../interfaces/lib_k8s_apiProxy.ClusterRequest.md)
- [QueryParameters](../interfaces/lib_k8s_apiProxy.QueryParameters.md)
- [RequestParams](../interfaces/lib_k8s_apiProxy.RequestParams.md)
- [StreamArgs](../interfaces/lib_k8s_apiProxy.StreamArgs.md)

## Type aliases

### StreamErrCb

Ƭ **StreamErrCb**: (`err`: `Error` & { `status?`: `number`  }, `cancelStreamFunc?`: () => `void`) => `void`

#### Type declaration

▸ (`err`, `cancelStreamFunc?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` & { `status?`: `number`  } |
| `cancelStreamFunc?` | () => `void` |

##### Returns

`void`

#### Defined in

[lib/k8s/apiProxy.ts:283](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L283)

___

### StreamResultsCb

Ƭ **StreamResultsCb**: (...`args`: `any`[]) => `void`

#### Type declaration

▸ (...`args`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`void`

#### Defined in

[lib/k8s/apiProxy.ts:282](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L282)

## Functions

### apiFactory

▸ **apiFactory**(...`args`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [group: string, version: string, resource: string] \| [group: string, version: string, resource: string][] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `delete` | (`name`: `string`, `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<`any`\> |
| `get` | (`name`: `string`, `cb`: [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb), `errCb`: [`StreamErrCb`](lib_k8s_apiProxy.md#streamerrcb), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<() => `void`\> |
| `isNamespaced` | `boolean` |
| `list` | (`cb`: [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb), `errCb`: [`StreamErrCb`](lib_k8s_apiProxy.md#streamerrcb), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<() => `void`\> |
| `patch` | (`body`: `OpPatch`[], `name`: `string`, `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<`any`\> |
| `post` | (`body`: [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<`any`\> |
| `put` | (`body`: [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<`any`\> |

#### Defined in

[lib/k8s/apiProxy.ts:353](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L353)

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
| `scale?` | { `get`: (`namespace`: `string`, `name`: `string`) => `Promise`<`any`\> ; `put`: (`body`: { `metadata`: [`KubeMetadata`](../interfaces/lib_k8s_cluster.KubeMetadata.md) ; `spec`: { `replicas`: `number`  }  }) => `Promise`<`any`\>  } |
| `scale.get` | (`namespace`: `string`, `name`: `string`) => `Promise`<`any`\> |
| `scale.put` | (`body`: { `metadata`: [`KubeMetadata`](../interfaces/lib_k8s_cluster.KubeMetadata.md) ; `spec`: { `replicas`: `number`  }  }) => `Promise`<`any`\> |

#### Defined in

[lib/k8s/apiProxy.ts:420](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L420)

___

### apply

▸ **apply**(`body`): `Promise`<`JSON`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `body` | [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md) |

#### Returns

`Promise`<`JSON`\>

#### Defined in

[lib/k8s/apiProxy.ts:995](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L995)

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
| `params` | [`RequestParams`](../interfaces/lib_k8s_apiProxy.RequestParams.md) | Optional parameters for the request. |
| `queryParams?` | [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md) | Optional query parameters for the request. |

#### Returns

`Promise`<`any`\>

A Promise that resolves to the JSON response from the API server.

#### Defined in

[lib/k8s/apiProxy.ts:183](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L183)

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

[lib/k8s/apiProxy.ts:1098](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L1098)

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

| Name | Type |
| :------ | :------ |
| `cluster` | `string` |
| `nodeName` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:1180](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L1180)

___

### drainNodeStatus

▸ **drainNodeStatus**(`cluster`, `nodeName`): `Promise`<`any`\>

Get the status of the drain node process

**`throws`** {Error} if the request fails

**`throws`** {Error} if the response is not ok

This function is used to get the status of the drain node process. It is used in the node detail page.
As draining a node is a long running process, we poll this endpoint to get the status of the drain node process.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cluster` | `string` |
| `nodeName` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:1212](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L1212)

___

### listPortForward

▸ **listPortForward**(`cluster`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cluster` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:1161](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L1161)

___

### metrics

▸ **metrics**(`url`, `onMetrics`, `onError?`): `Promise`<() => `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `onMetrics` | (`arg`: [`KubeMetrics`](../interfaces/lib_k8s_cluster.KubeMetrics.md)[]) => `void` |
| `onError?` | (`err`: [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void` |

#### Returns

`Promise`<() => `void`\>

#### Defined in

[lib/k8s/apiProxy.ts:1043](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L1043)

___

### patch

▸ **patch**(`url`, `json`, `autoLogoutOnAuthError?`, `requestOptions?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `url` | `string` | `undefined` |
| `json` | `any` | `undefined` |
| `autoLogoutOnAuthError` | `boolean` | `true` |
| `requestOptions` | `Object` | `{}` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:619](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L619)

___

### post

▸ **post**(`url`, `json`, `autoLogoutOnAuthError?`, `requestOptions?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `url` | `string` | `undefined` |
| `json` | `object` \| [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md) \| `JSON` | `undefined` |
| `autoLogoutOnAuthError` | `boolean` | `true` |
| `requestOptions` | `Object` | `{}` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:608](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L608)

___

### put

▸ **put**(`url`, `json`, `autoLogoutOnAuthError?`, `requestOptions?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `url` | `string` | `undefined` |
| `json` | `Partial`<[`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md)\> | `undefined` |
| `autoLogoutOnAuthError` | `boolean` | `true` |
| `requestOptions` | `Object` | `{}` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:630](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L630)

___

### remove

▸ **remove**(`url`, `requestOptions?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `requestOptions` | `Object` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:641](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L641)

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

[lib/k8s/apiProxy.ts:155](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L155)

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

[lib/k8s/apiProxy.ts:1085](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L1085)

___

### startPortForward

▸ **startPortForward**(`cluster`, `namespace`, `podname`, `containerPort`, `service`, `serviceNamespace`, `port?`, `id?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cluster` | `string` | `undefined` |
| `namespace` | `string` | `undefined` |
| `podname` | `string` | `undefined` |
| `containerPort` | `string` \| `number` | `undefined` |
| `service` | `string` | `undefined` |
| `serviceNamespace` | `string` | `undefined` |
| `port?` | `string` | `undefined` |
| `id` | `string` | `''` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:1107](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L1107)

___

### stopOrDeletePortForward

▸ **stopOrDeletePortForward**(`cluster`, `id`, `stopOrDelete?`): `Promise`<`string`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cluster` | `string` | `undefined` |
| `id` | `string` | `undefined` |
| `stopOrDelete` | `boolean` | `true` |

#### Returns

`Promise`<`string`\>

#### Defined in

[lib/k8s/apiProxy.ts:1143](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L1143)

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

[lib/k8s/apiProxy.ts:860](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L860)

___

### streamResult

▸ **streamResult**(`url`, `name`, `cb`, `errCb`, `queryParams?`): `Promise`<() => `void`\>

Streams the results of a Kubernetes API request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL of the Kubernetes API endpoint. |
| `name` | `string` | The name of the Kubernetes API resource. |
| `cb` | [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb) | The callback function to execute when the stream receives data. |
| `errCb` | [`StreamErrCb`](lib_k8s_apiProxy.md#streamerrcb) | The callback function to execute when an error occurs. |
| `queryParams?` | [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md) | The query parameters to include in the API request. |

#### Returns

`Promise`<() => `void`\>

A function to cancel the stream.

#### Defined in

[lib/k8s/apiProxy.ts:657](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L657)

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

[lib/k8s/apiProxy.ts:718](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L718)

___

### testAuth

▸ **testAuth**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:1074](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L1074)

___

### testClusterHealth

▸ **testClusterHealth**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:1081](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L1081)
