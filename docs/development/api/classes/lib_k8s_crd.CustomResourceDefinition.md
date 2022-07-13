---
title: "Class: CustomResourceDefinition"
linkTitle: "CustomResourceDefinition"
slug: "lib_k8s_crd.CustomResourceDefinition"
---

[lib/k8s/crd](../modules/lib_k8s_crd.md).CustomResourceDefinition

## Hierarchy

- `any`

  ↳ **`CustomResourceDefinition`**

## Constructors

### constructor

• **new CustomResourceDefinition**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeCRD`](../interfaces/lib_k8s_crd.KubeCRD.md) |

#### Inherited from

makeKubeObject<KubeCRD\>('crd').constructor

#### Defined in

[lib/k8s/cluster.ts:76](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L76)

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

[lib/k8s/crd.ts:35](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/crd.ts#L35)

## Accessors

### detailsRoute

• `get` **detailsRoute**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/crd.ts:48](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/crd.ts#L48)

___

### listRoute

• `get` **listRoute**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/crd.ts:44](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/crd.ts#L44)

___

### spec

• `get` **spec**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/crd.ts:52](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/crd.ts#L52)

___

### className

• `Static` `get` **className**(): `string`

#### Returns

`string`

#### Overrides

makeKubeObject&lt;KubeCRD\&gt;(&#x27;crd&#x27;).className

#### Defined in

[lib/k8s/crd.ts:40](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/crd.ts#L40)

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

makeKubeObject<KubeCRD\>('crd').apiList

#### Defined in

[lib/k8s/cluster.ts:60](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L60)

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

makeKubeObject<KubeCRD\>('crd').getErrorMessage

#### Defined in

[lib/k8s/cluster.ts:75](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L75)

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

makeKubeObject<KubeCRD\>('crd').useApiGet

#### Defined in

[lib/k8s/cluster.ts:66](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L66)

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

makeKubeObject<KubeCRD\>('crd').useApiList

#### Defined in

[lib/k8s/cluster.ts:61](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L61)

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

makeKubeObject<KubeCRD\>('crd').useList

#### Defined in

[lib/k8s/cluster.ts:72](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L72)
