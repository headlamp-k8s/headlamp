---
title: "Class: default"
linkTitle: "default"
slug: "lib_k8s_secret.default"
---

[lib/k8s/secret](../modules/lib_k8s_secret.md).default

## Hierarchy

- `any`

  ↳ **`default`**

## Constructors

### constructor

• **new default**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeSecret`](../interfaces/lib_k8s_secret.KubeSecret.md) |

#### Inherited from

makeKubeObject<KubeSecret\>('secret').constructor

#### Defined in

[lib/k8s/cluster.ts:70](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L70)

## Properties

### apiEndpoint

▪ `Static` **apiEndpoint**: `Object`

#### Index signature

▪ [other: `string`]: `any`

#### Defined in

[lib/k8s/secret.ts:10](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/secret.ts#L10)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeSecret\>('secret').className

#### Defined in

[lib/k8s/cluster.ts:71](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L71)

## Accessors

### data

• `get` **data**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/secret.ts:12](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/secret.ts#L12)

___

### type

• `get` **type**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/secret.ts:16](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/secret.ts#L16)

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

makeKubeObject<KubeSecret\>('secret').apiList

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

makeKubeObject<KubeSecret\>('secret').getErrorMessage

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

makeKubeObject<KubeSecret\>('secret').useApiGet

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

makeKubeObject<KubeSecret\>('secret').useApiList

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

makeKubeObject<KubeSecret\>('secret').useList

#### Defined in

[lib/k8s/cluster.ts:66](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L66)
