---
title: "Class: default"
linkTitle: "default"
slug: "lib_k8s_customresource.default"
---

[lib/k8s/customresource](../modules/lib_k8s_customresource.md).default

## Hierarchy

- `any`

  ↳ **`default`**

## Constructors

### constructor

• **new default**(`group`, `version`, `resource`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `group` | `string` |
| `version` | `string` |
| `resource` | `string` |

#### Overrides

makeKubeObject&lt;KubeObject\&gt;(&#x27;CustomResource&#x27;).constructor

#### Defined in

[lib/k8s/customresource.ts:7](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/customresource.ts#L7)

## Properties

### apiEndpoint

• **apiEndpoint**: `Object`

#### Index signature

▪ [other: `string`]: `any`

#### Defined in

[lib/k8s/customresource.ts:6](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/customresource.ts#L6)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeObject\>('CustomResource').className

#### Defined in

[lib/k8s/cluster.ts:71](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L71)

## Methods

### patch

▸ **patch**(`body`, `namespace`, `name`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `body` | `OpPatch`[] |
| `namespace` | `string` |
| `name` | `string` |

#### Returns

`any`

#### Defined in

[lib/k8s/customresource.ts:12](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/customresource.ts#L12)

___

### apiList

▸ `Static` **apiList**(`onList`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `onList` | (`arg`: `any`[]) => `void` |

#### Returns

`any`

#### Inherited from

makeKubeObject<KubeObject\>('CustomResource').apiList

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

makeKubeObject<KubeObject\>('CustomResource').getErrorMessage

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

makeKubeObject<KubeObject\>('CustomResource').useApiGet

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

makeKubeObject<KubeObject\>('CustomResource').useApiList

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

makeKubeObject<KubeObject\>('CustomResource').useList

#### Defined in

[lib/k8s/cluster.ts:66](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L66)
