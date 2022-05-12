---
title: "Class: StorageClass"
linkTitle: "StorageClass"
slug: "lib_k8s_storageClass.StorageClass"
---

[lib/k8s/storageClass](../modules/lib_k8s_storageClass.md).StorageClass

## Hierarchy

- `any`

  ↳ **`StorageClass`**

## Constructors

### constructor

• **new StorageClass**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeStorageClass`](../interfaces/lib_k8s_storageClass.KubeStorageClass.md) |

#### Inherited from

makeKubeObject<KubeStorageClass\>('storageClass').constructor

#### Defined in

[lib/k8s/cluster.ts:76](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L76)

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

#### Defined in

[lib/k8s/storageClass.ts:11](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/storageClass.ts#L11)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeStorageClass\>('storageClass').className

#### Defined in

[lib/k8s/cluster.ts:77](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L77)

## Accessors

### listRoute

• `get` **listRoute**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/storageClass.ts:25](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/storageClass.ts#L25)

___

### provisioner

• `get` **provisioner**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/storageClass.ts:13](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/storageClass.ts#L13)

___

### reclaimPolicy

• `get` **reclaimPolicy**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/storageClass.ts:17](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/storageClass.ts#L17)

___

### volumeBindingMode

• `get` **volumeBindingMode**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/storageClass.ts:21](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/storageClass.ts#L21)

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

makeKubeObject<KubeStorageClass\>('storageClass').apiList

#### Defined in

[lib/k8s/cluster.ts:60](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L60)

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

makeKubeObject<KubeStorageClass\>('storageClass').getErrorMessage

#### Defined in

[lib/k8s/cluster.ts:75](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L75)

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

makeKubeObject<KubeStorageClass\>('storageClass').useApiGet

#### Defined in

[lib/k8s/cluster.ts:66](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L66)

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

makeKubeObject<KubeStorageClass\>('storageClass').useApiList

#### Defined in

[lib/k8s/cluster.ts:61](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L61)

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

makeKubeObject<KubeStorageClass\>('storageClass').useList

#### Defined in

[lib/k8s/cluster.ts:72](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L72)
