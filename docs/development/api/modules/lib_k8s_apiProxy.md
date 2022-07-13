---
title: "Module: lib/k8s/apiProxy"
linkTitle: "lib/k8s/apiProxy"
slug: "lib_k8s_apiProxy"
---

## Interfaces

- [ApiError](../interfaces/lib_k8s_apiProxy.ApiError.md)
- [ClusterRequest](../interfaces/lib_k8s_apiProxy.ClusterRequest.md)
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

[lib/k8s/apiProxy.ts:212](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L212)

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

[lib/k8s/apiProxy.ts:211](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L211)

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
| `delete` | (`name`: `string`) => `Promise`<`any`\> |
| `get` | (`name`: `string`, `cb`: [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb), `errCb`: [`StreamErrCb`](lib_k8s_apiProxy.md#streamerrcb)) => `Promise`<() => `void`\> |
| `isNamespaced` | `boolean` |
| `list` | (`cb`: [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb), `errCb`: [`StreamErrCb`](lib_k8s_apiProxy.md#streamerrcb)) => `Promise`<() => `void`\> |
| `patch` | (`body`: `OpPatch`[], `name`: `string`) => `Promise`<`any`\> |
| `post` | (`body`: [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md)) => `Promise`<`any`\> |
| `put` | (`body`: [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md)) => `Promise`<`any`\> |

#### Defined in

[lib/k8s/apiProxy.ts:278](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L278)

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

[lib/k8s/apiProxy.ts:323](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L323)

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

[lib/k8s/apiProxy.ts:742](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L742)

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

[lib/k8s/apiProxy.ts:761](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L761)

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

[lib/k8s/apiProxy.ts:455](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L455)

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

[lib/k8s/apiProxy.ts:444](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L444)

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

[lib/k8s/apiProxy.ts:466](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L466)

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

[lib/k8s/apiProxy.ts:477](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L477)

___

### request

▸ **request**(`path`, `params?`, `autoLogoutOnAuthError?`, `useCluster?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `path` | `string` | `undefined` |
| `params` | [`RequestParams`](../interfaces/lib_k8s_apiProxy.RequestParams.md) | `{}` |
| `autoLogoutOnAuthError` | `boolean` | `true` |
| `useCluster` | `boolean` | `true` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:124](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L124)

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

[lib/k8s/apiProxy.ts:797](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L797)

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

[lib/k8s/apiProxy.ts:617](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L617)

___

### streamResult

▸ **streamResult**(`url`, `name`, `cb`, `errCb`): `Promise`<() => `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `name` | `string` |
| `cb` | [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb) |
| `errCb` | [`StreamErrCb`](lib_k8s_apiProxy.md#streamerrcb) |

#### Returns

`Promise`<() => `void`\>

#### Defined in

[lib/k8s/apiProxy.ts:482](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L482)

___

### streamResults

▸ **streamResults**(`url`, `cb`, `errCb`): `Promise`<() => `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `cb` | [`StreamResultsCb`](lib_k8s_apiProxy.md#streamresultscb) |
| `errCb` | [`StreamErrCb`](lib_k8s_apiProxy.md#streamerrcb) |

#### Returns

`Promise`<() => `void`\>

#### Defined in

[lib/k8s/apiProxy.ts:519](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L519)

___

### testAuth

▸ **testAuth**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/apiProxy.ts:790](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L790)
