---
title: "Class: default"
linkTitle: "default"
slug: "lib_k8s_clusterRoleBinding.default"
---

[lib/k8s/clusterRoleBinding](../modules/lib_k8s_clusterRoleBinding.md).default

## Hierarchy

- [`default`](lib_k8s_roleBinding.default.md)

  ↳ **`default`**

## Constructors

### constructor

• **new default**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeRoleBinding`](../interfaces/lib_k8s_roleBinding.KubeRoleBinding.md) |

#### Inherited from

[default](lib_k8s_roleBinding.default.md).[constructor](lib_k8s_roleBinding.default.md#constructor)

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

[default](lib_k8s_roleBinding.default.md).[apiEndpoint](lib_k8s_roleBinding.default.md#apiendpoint)

#### Defined in

[lib/k8s/clusterRoleBinding.ts:5](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/clusterRoleBinding.ts#L5)

## Accessors

### detailsRoute

• `get` **detailsRoute**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/clusterRoleBinding.ts:11](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/clusterRoleBinding.ts#L11)

___

### roleRef

• `get` **roleRef**(): `any`

#### Returns

`any`

#### Inherited from

RoleBinding.roleRef

#### Defined in

[lib/k8s/roleBinding.ts:21](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/roleBinding.ts#L21)

___

### subjects

• `get` **subjects**(): `any`

#### Returns

`any`

#### Inherited from

RoleBinding.subjects

#### Defined in

[lib/k8s/roleBinding.ts:25](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/roleBinding.ts#L25)

___

### className

• `Static` `get` **className**(): `string`

#### Returns

`string`

#### Overrides

RoleBinding.className

#### Defined in

[lib/k8s/clusterRoleBinding.ts:7](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/clusterRoleBinding.ts#L7)

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

[default](lib_k8s_roleBinding.default.md).[apiList](lib_k8s_roleBinding.default.md#apilist)

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

[default](lib_k8s_roleBinding.default.md).[getErrorMessage](lib_k8s_roleBinding.default.md#geterrormessage)

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

[default](lib_k8s_roleBinding.default.md).[useApiGet](lib_k8s_roleBinding.default.md#useapiget)

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

[default](lib_k8s_roleBinding.default.md).[useApiList](lib_k8s_roleBinding.default.md#useapilist)

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

[default](lib_k8s_roleBinding.default.md).[useList](lib_k8s_roleBinding.default.md#uselist)

#### Defined in

[lib/k8s/cluster.ts:66](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L66)
