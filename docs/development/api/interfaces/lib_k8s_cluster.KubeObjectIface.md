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

[lib/k8s/cluster.ts:107](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L107)

## Properties

### className

• **className**: `string`

#### Defined in

[lib/k8s/cluster.ts:108](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L108)

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

[lib/k8s/cluster.ts:87](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L87)

___

### getAuthorization

▸ `Optional` **getAuthorization**(`arg`, `resourceAttrs?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | `string` |
| `resourceAttrs?` | [`AuthRequestResourceAttrs`](lib_k8s_cluster.AuthRequestResourceAttrs.md) |

#### Returns

`any`

#### Defined in

[lib/k8s/cluster.ts:110](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L110)

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

[lib/k8s/cluster.ts:106](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L106)

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

[lib/k8s/cluster.ts:93](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L93)

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

[lib/k8s/cluster.ts:88](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L88)

___

### useGet

▸ **useGet**(`name`, `namespace?`): [`any`, ``null`` \| [`ApiError`](lib_k8s_apiProxy.ApiError.md), (`item`: `any`) => `void`, (`err`: ``null`` \| [`ApiError`](lib_k8s_apiProxy.ApiError.md)) => `void`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `namespace?` | `string` |

#### Returns

[`any`, ``null`` \| [`ApiError`](lib_k8s_apiProxy.ApiError.md), (`item`: `any`) => `void`, (`err`: ``null`` \| [`ApiError`](lib_k8s_apiProxy.ApiError.md)) => `void`]

#### Defined in

[lib/k8s/cluster.ts:102](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L102)

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

[lib/k8s/cluster.ts:99](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L99)
