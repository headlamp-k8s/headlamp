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

[lib/k8s/apiProxy.ts:224](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L224)

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

[lib/k8s/apiProxy.ts:223](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L223)

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

[lib/k8s/apiProxy.ts:290](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L290)

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

[lib/k8s/apiProxy.ts:340](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L340)

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

[lib/k8s/apiProxy.ts:794](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L794)

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

[lib/k8s/apiProxy.ts:881](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L881)

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

[lib/k8s/apiProxy.ts:939](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L939)

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

[lib/k8s/apiProxy.ts:836](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L836)

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

[lib/k8s/apiProxy.ts:491](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L491)

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

[lib/k8s/apiProxy.ts:480](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L480)

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

[lib/k8s/apiProxy.ts:502](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L502)

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

[lib/k8s/apiProxy.ts:513](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L513)

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

[lib/k8s/apiProxy.ts:134](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L134)

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

[lib/k8s/apiProxy.ts:872](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L872)

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

[lib/k8s/apiProxy.ts:885](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L885)

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

[lib/k8s/apiProxy.ts:921](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L921)

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

[lib/k8s/apiProxy.ts:670](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L670)

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

[lib/k8s/apiProxy.ts:518](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L518)

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

[lib/k8s/apiProxy.ts:559](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L559)

___

### testAuth

▸ **testAuth**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:865](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/apiProxy.ts#L865)
