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

[lib/k8s/apiProxy.ts:225](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L225)

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

[lib/k8s/apiProxy.ts:224](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L224)

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

[lib/k8s/apiProxy.ts:291](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L291)

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

[lib/k8s/apiProxy.ts:341](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L341)

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

[lib/k8s/apiProxy.ts:795](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L795)

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

[lib/k8s/apiProxy.ts:886](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L886)

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

[lib/k8s/apiProxy.ts:968](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L968)

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

[lib/k8s/apiProxy.ts:1000](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L1000)

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

[lib/k8s/apiProxy.ts:949](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L949)

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

[lib/k8s/apiProxy.ts:837](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L837)

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

[lib/k8s/apiProxy.ts:492](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L492)

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

[lib/k8s/apiProxy.ts:481](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L481)

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

[lib/k8s/apiProxy.ts:503](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L503)

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

[lib/k8s/apiProxy.ts:514](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L514)

___

### request

▸ **request**(`path`, `params?`, `autoLogoutOnAuthError?`, `useCluster?`, `queryParams?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `path` | `string` | `undefined` |
| `params` | [`RequestParams`](../interfaces/lib_k8s_apiProxy.RequestParams.md) | `{}` |
| `autoLogoutOnAuthError` | `boolean` | `true` |
| `useCluster` | `boolean` | `true` |
| `queryParams?` | [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md) | `undefined` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:135](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L135)

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

[lib/k8s/apiProxy.ts:873](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L873)

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

[lib/k8s/apiProxy.ts:895](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L895)

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

[lib/k8s/apiProxy.ts:931](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L931)

___

### stream

▸ **stream**(`url`, `cb`, `args`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `cb` | [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb) |
| `args` | [`StreamArgs`](../interfaces/lib_k8s_apiProxy.StreamArgs.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `cancel` | () => `void` |
| `getSocket` | () => ``null`` \| `WebSocket` |

#### Defined in

[lib/k8s/apiProxy.ts:671](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L671)

___

### streamResult

▸ **streamResult**(`url`, `name`, `cb`, `errCb`, `queryParams?`): `Promise`<() => `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `name` | `string` |
| `cb` | [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb) |
| `errCb` | [`StreamErrCb`](lib_k8s_apiProxy.md#streamerrcb) |
| `queryParams?` | [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md) |

#### Returns

`Promise`<() => `void`\>

#### Defined in

[lib/k8s/apiProxy.ts:519](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L519)

___

### streamResults

▸ **streamResults**(`url`, `cb`, `errCb`, `queryParams`): `Promise`<() => `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `cb` | [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb) |
| `errCb` | [`StreamErrCb`](lib_k8s_apiProxy.md#streamerrcb) |
| `queryParams` | `undefined` \| [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md) |

#### Returns

`Promise`<() => `void`\>

#### Defined in

[lib/k8s/apiProxy.ts:560](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L560)

___

### testAuth

▸ **testAuth**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:866](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L866)
