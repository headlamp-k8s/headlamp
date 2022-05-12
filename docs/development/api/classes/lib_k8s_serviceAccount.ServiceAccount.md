---
title: "Class: ServiceAccount"
linkTitle: "ServiceAccount"
slug: "lib_k8s_serviceAccount.ServiceAccount"
---

[lib/k8s/serviceAccount](../modules/lib_k8s_serviceAccount.md).ServiceAccount

## Hierarchy

- `any`

  ↳ **`ServiceAccount`**

## Constructors

### constructor

• **new ServiceAccount**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeServiceAccount`](../interfaces/lib_k8s_serviceAccount.KubeServiceAccount.md) |

#### Inherited from

makeKubeObject<KubeServiceAccount\>('serviceAccount').constructor

#### Defined in

[lib/k8s/cluster.ts:76](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L76)

## Properties

### apiEndpoint

▪ `Static` **apiEndpoint**: `Object`

#### Index signature

▪ [other: `string`]: `any`

#### Defined in

[lib/k8s/serviceAccount.ts:16](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/serviceAccount.ts#L16)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeServiceAccount\>('serviceAccount').className

#### Defined in

[lib/k8s/cluster.ts:77](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L77)

## Accessors

### secrets

• `get` **secrets**(): { `apiVersion`: `string` ; `fieldPath`: `string` ; `kind`: `string` ; `name`: `string` ; `namespace`: `string` ; `uid`: `string`  }[]

#### Returns

{ `apiVersion`: `string` ; `fieldPath`: `string` ; `kind`: `string` ; `name`: `string` ; `namespace`: `string` ; `uid`: `string`  }[]

#### Defined in

[lib/k8s/serviceAccount.ts:18](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/serviceAccount.ts#L18)

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

makeKubeObject<KubeServiceAccount\>('serviceAccount').apiList

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

makeKubeObject<KubeServiceAccount\>('serviceAccount').getErrorMessage

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

makeKubeObject<KubeServiceAccount\>('serviceAccount').useApiGet

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

makeKubeObject<KubeServiceAccount\>('serviceAccount').useApiList

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

makeKubeObject<KubeServiceAccount\>('serviceAccount').useList

#### Defined in

[lib/k8s/cluster.ts:72](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L72)
