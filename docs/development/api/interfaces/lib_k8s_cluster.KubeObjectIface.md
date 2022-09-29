---
title: "Interface: KubeObjectIface<T>"
linkTitle: "KubeObjectIface"
slug: "lib_k8s_cluster.KubeObjectIface"
---

[lib/k8s/cluster](../modules/lib_k8s_cluster.md).KubeObjectIface

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md) \| [`KubeEvent`](lib_k8s_event.KubeEvent.md) |

## Indexable

▪ [prop: `string`]: `any`

## Constructors

### constructor

• **new KubeObjectIface**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `T` |

#### Defined in

[lib/k8s/cluster.ts:76](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L76)

## Properties

### className

• **className**: `string`

#### Defined in

[lib/k8s/cluster.ts:77](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L77)

## Methods

### apiList

▸ **apiList**(`onList`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `onList` | (`arg`: `any`[]) => `void` |

#### Returns

`any`

#### Defined in

[lib/k8s/cluster.ts:60](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L60)

___

### getErrorMessage

▸ **getErrorMessage**(`err?`): ``null`` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err?` | ``null`` \| [`ApiError`](lib_k8s_apiProxy.ApiError.md) |

#### Returns

``null`` \| `string`

#### Defined in

[lib/k8s/cluster.ts:75](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L75)

___

### useApiGet

▸ **useApiGet**(`onGet`, `name`, `namespace?`, `onError?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `onGet` | (...`args`: `any`) => `void` |
| `name` | `string` |
| `namespace?` | `string` |
| `onError?` | (`err`: [`ApiError`](lib_k8s_apiProxy.ApiError.md)) => `void` |

#### Returns

`void`

#### Defined in

[lib/k8s/cluster.ts:66](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L66)

___

### useApiList

▸ **useApiList**(`onList`, `onError?`, `opts?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `onList` | (`arg`: `any`[]) => `void` |
| `onError?` | (`err`: [`ApiError`](lib_k8s_apiProxy.ApiError.md)) => `void` |
| `opts?` | [`ApiListOptions`](lib_k8s_cluster.ApiListOptions.md) |

#### Returns

`any`

#### Defined in

[lib/k8s/cluster.ts:61](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L61)

___

### useList

▸ **useList**(`opts?`): [`any`[], ``null`` \| [`ApiError`](lib_k8s_apiProxy.ApiError.md), (`items`: `any`[]) => `void`, (`err`: ``null`` \| [`ApiError`](lib_k8s_apiProxy.ApiError.md)) => `void`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | [`ApiListOptions`](lib_k8s_cluster.ApiListOptions.md) |

#### Returns

[`any`[], ``null`` \| [`ApiError`](lib_k8s_apiProxy.ApiError.md), (`items`: `any`[]) => `void`, (`err`: ``null`` \| [`ApiError`](lib_k8s_apiProxy.ApiError.md)) => `void`]

#### Defined in

[lib/k8s/cluster.ts:72](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L72)
