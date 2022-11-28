---
title: "Class: ClusterRoleBinding"
linkTitle: "ClusterRoleBinding"
slug: "lib_k8s_clusterRoleBinding.ClusterRoleBinding"
---

[lib/k8s/clusterRoleBinding](../modules/lib_k8s_clusterRoleBinding.md).ClusterRoleBinding

## Hierarchy

- [`RoleBinding`](lib_k8s_roleBinding.RoleBinding.md)

  ↳ **`ClusterRoleBinding`**

## Constructors

### constructor

• **new ClusterRoleBinding**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeRoleBinding`](../interfaces/lib_k8s_roleBinding.KubeRoleBinding.md) |

#### Inherited from

[RoleBinding](lib_k8s_roleBinding.RoleBinding.md).[constructor](lib_k8s_roleBinding.RoleBinding.md#constructor)

#### Defined in

[lib/k8s/cluster.ts:93](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L93)

## Properties

### apiEndpoint

▪ `Static` **apiEndpoint**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `delete` | (`name`: `string`, `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<`any`\> |
| `get` | (`name`: `string`, `cb`: [`StreamResultsCb`](../modules/lib_k8s_apiProxy.md#streamresultscb), `errCb`: [`StreamErrCb`](../modules/lib_k8s_apiProxy.md#streamerrcb), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<() => `void`\> |
| `isNamespaced` | `boolean` |
| `list` | (`cb`: [`StreamResultsCb`](../modules/lib_k8s_apiProxy.md#streamresultscb), `errCb`: [`StreamErrCb`](../modules/lib_k8s_apiProxy.md#streamerrcb), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<() => `void`\> |
| `patch` | (`body`: `OpPatch`[], `name`: `string`, `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<`any`\> |
| `post` | (`body`: [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<`any`\> |
| `put` | (`body`: [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<`any`\> |

#### Overrides

[RoleBinding](lib_k8s_roleBinding.RoleBinding.md).[apiEndpoint](lib_k8s_roleBinding.RoleBinding.md#apiendpoint)

#### Defined in

[lib/k8s/clusterRoleBinding.ts:5](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/clusterRoleBinding.ts#L5)

## Accessors

### detailsRoute

• `get` **detailsRoute**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/clusterRoleBinding.ts:11](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/clusterRoleBinding.ts#L11)

___

### roleRef

• `get` **roleRef**(): `any`

#### Returns

`any`

#### Inherited from

RoleBinding.roleRef

#### Defined in

[lib/k8s/roleBinding.ts:21](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/roleBinding.ts#L21)

___

### subjects

• `get` **subjects**(): `any`

#### Returns

`any`

#### Inherited from

RoleBinding.subjects

#### Defined in

[lib/k8s/roleBinding.ts:25](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/roleBinding.ts#L25)

___

### className

• `Static` `get` **className**(): `string`

#### Returns

`string`

#### Overrides

RoleBinding.className

#### Defined in

[lib/k8s/clusterRoleBinding.ts:7](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/clusterRoleBinding.ts#L7)

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

[RoleBinding](lib_k8s_roleBinding.RoleBinding.md).[apiList](lib_k8s_roleBinding.RoleBinding.md#apilist)

#### Defined in

[lib/k8s/cluster.ts:73](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L73)

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

[RoleBinding](lib_k8s_roleBinding.RoleBinding.md).[getErrorMessage](lib_k8s_roleBinding.RoleBinding.md#geterrormessage)

#### Defined in

[lib/k8s/cluster.ts:92](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L92)

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

[RoleBinding](lib_k8s_roleBinding.RoleBinding.md).[useApiGet](lib_k8s_roleBinding.RoleBinding.md#useapiget)

#### Defined in

[lib/k8s/cluster.ts:79](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L79)

___

### useApiList

▸ `Static` **useApiList**(`onList`, `onError?`, `opts?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `onList` | (`arg`: `any`[]) => `void` |
| `onError?` | (`err`: [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void` |
| `opts?` | [`ApiListOptions`](../interfaces/lib_k8s_cluster.ApiListOptions.md) |

#### Returns

`any`

#### Inherited from

[RoleBinding](lib_k8s_roleBinding.RoleBinding.md).[useApiList](lib_k8s_roleBinding.RoleBinding.md#useapilist)

#### Defined in

[lib/k8s/cluster.ts:74](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L74)

___

### useGet

▸ `Static` **useGet**(`name`, `namespace?`): [`any`, ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md), (`item`: `any`) => `void`, (`err`: ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `namespace?` | `string` |

#### Returns

[`any`, ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md), (`item`: `any`) => `void`, (`err`: ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void`]

#### Inherited from

[RoleBinding](lib_k8s_roleBinding.RoleBinding.md).[useGet](lib_k8s_roleBinding.RoleBinding.md#useget)

#### Defined in

[lib/k8s/cluster.ts:88](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L88)

___

### useList

▸ `Static` **useList**(`opts?`): [`any`[], ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md), (`items`: `any`[]) => `void`, (`err`: ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | [`ApiListOptions`](../interfaces/lib_k8s_cluster.ApiListOptions.md) |

#### Returns

[`any`[], ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md), (`items`: `any`[]) => `void`, (`err`: ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void`]

#### Inherited from

[RoleBinding](lib_k8s_roleBinding.RoleBinding.md).[useList](lib_k8s_roleBinding.RoleBinding.md#uselist)

#### Defined in

[lib/k8s/cluster.ts:85](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L85)
