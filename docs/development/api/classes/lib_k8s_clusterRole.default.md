---
title: "Class: default"
linkTitle: "default"
slug: "lib_k8s_clusterRole.default"
---

[lib/k8s/clusterRole](../modules/lib_k8s_clusterRole.md).default

## Hierarchy

- [`default`](lib_k8s_role.default.md)

  ↳ **`default`**

## Constructors

### constructor

• **new default**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeRole`](../interfaces/lib_k8s_role.KubeRole.md) |

#### Inherited from

[default](lib_k8s_role.default.md).[constructor](lib_k8s_role.default.md#constructor)

#### Defined in

[lib/k8s/cluster.ts:70](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L70)

## Properties

### apiEndpoint

▪ `Static` **apiEndpoint**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `delete` | (`name`: `string`) => `Promise`<`any`\> |
| `get` | (`name`: `string`, `cb`: [`StreamResultsCb`](../modules/lib_k8s_apiProxy.md#streamresultscb), `errCb`: [`StreamErrCb`](../modules/lib_k8s_apiProxy.md#streamerrcb)) => `Promise`<() => `void`\> |
| `isNamespaced` | `boolean` |
| `list` | (`cb`: [`StreamResultsCb`](../modules/lib_k8s_apiProxy.md#streamresultscb), `errCb`: [`StreamErrCb`](../modules/lib_k8s_apiProxy.md#streamerrcb)) => `Promise`<() => `void`\> |
| `patch` | (`body`: `OpPatch`[], `name`: `string`) => `Promise`<`any`\> |
| `post` | (`body`: [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md)) => `Promise`<`any`\> |
| `put` | (`body`: [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md)) => `Promise`<`any`\> |

#### Overrides

[default](lib_k8s_role.default.md).[apiEndpoint](lib_k8s_role.default.md#apiendpoint)

#### Defined in

[lib/k8s/clusterRole.ts:5](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/clusterRole.ts#L5)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

[default](lib_k8s_role.default.md).[className](lib_k8s_role.default.md#classname)

#### Defined in

[lib/k8s/cluster.ts:71](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L71)

## Accessors

### detailsRoute

• `get` **detailsRoute**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/clusterRole.ts:7](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/clusterRole.ts#L7)

___

### rules

• `get` **rules**(): `any`

#### Returns

`any`

#### Inherited from

Role.rules

#### Defined in

[lib/k8s/role.ts:17](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/role.ts#L17)

## Methods

### apiList

▸ `Static` **apiList**(`onList`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `onList` | (`arg`: `any`[]) => `void` |

#### Returns

`any`

#### Inherited from

[default](lib_k8s_role.default.md).[apiList](lib_k8s_role.default.md#apilist)

#### Defined in

[lib/k8s/cluster.ts:55](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L55)

___

### getErrorMessage

▸ `Static` **getErrorMessage**(`err?`): ``null`` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err?` | ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md) |

#### Returns

``null`` \| `string`

#### Inherited from

[default](lib_k8s_role.default.md).[getErrorMessage](lib_k8s_role.default.md#geterrormessage)

#### Defined in

[lib/k8s/cluster.ts:69](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L69)

___

### useApiGet

▸ `Static` **useApiGet**(`onGet`, `name`, `namespace?`, `onError?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `onGet` | (...`args`: `any`) => `void` |
| `name` | `string` |
| `namespace?` | `string` |
| `onError?` | (`err`: [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void` |

#### Returns

`void`

#### Inherited from

[default](lib_k8s_role.default.md).[useApiGet](lib_k8s_role.default.md#useapiget)

#### Defined in

[lib/k8s/cluster.ts:60](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L60)

___

### useApiList

▸ `Static` **useApiList**(`onList`, `onError?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `onList` | (`arg`: `any`[]) => `void` |
| `onError?` | (`err`: [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void` |

#### Returns

`any`

#### Inherited from

[default](lib_k8s_role.default.md).[useApiList](lib_k8s_role.default.md#useapilist)

#### Defined in

[lib/k8s/cluster.ts:56](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L56)

___

### useList

▸ `Static` **useList**(`onList?`): [`any`[], ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md), (`items`: `any`[]) => `void`, (`err`: ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `onList?` | (...`arg`: `any`[]) => `any` |

#### Returns

[`any`[], ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md), (`items`: `any`[]) => `void`, (`err`: ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void`]

#### Inherited from

[default](lib_k8s_role.default.md).[useList](lib_k8s_role.default.md#uselist)

#### Defined in

[lib/k8s/cluster.ts:66](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L66)
