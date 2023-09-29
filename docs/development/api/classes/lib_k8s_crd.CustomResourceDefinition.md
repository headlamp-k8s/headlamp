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

[lib/k8s/cluster.ts:107](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L107)

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

#### Defined in

[lib/k8s/crd.ts:34](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/crd.ts#L34)

## Accessors

### isNamespaced

• `get` **isNamespaced**(): `boolean`

#### Returns

`boolean`

#### Defined in

[lib/k8s/crd.ts:75](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/crd.ts#L75)

___

### plural

• `get` **plural**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/crd.ts:51](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/crd.ts#L51)

___

### spec

• `get` **spec**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `group` | `string` |
| `names` | { `kind`: `string` ; `listKind`: `string` ; `plural`: `string` ; `singular`: `string`  } |
| `names.kind` | `string` |
| `names.listKind` | `string` |
| `names.plural` | `string` |
| `names.singular` | `string` |
| `scope` | `string` |
| `version` | `string` |
| `versions` | { `additionalPrinterColumns`: { `description?`: `string` ; `format?`: `string` ; `jsonPath`: `string` ; `name`: `string` ; `priority?`: `number` ; `type`: `string`  }[] ; `name`: `string` ; `served`: `boolean` ; `storage`: `boolean`  }[] |

#### Defined in

[lib/k8s/crd.ts:47](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/crd.ts#L47)

___

### className

• `Static` `get` **className**(): `string`

#### Returns

`string`

#### Overrides

makeKubeObject&lt;KubeCRD\&gt;(&#x27;crd&#x27;).className

#### Defined in

[lib/k8s/crd.ts:39](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/crd.ts#L39)

___

### detailsRoute

• `Static` `get` **detailsRoute**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/crd.ts:43](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/crd.ts#L43)

## Methods

### getMainAPIGroup

▸ **getMainAPIGroup**(): [`string`, `string`, `string`]

#### Returns

[`string`, `string`, `string`]

#### Defined in

[lib/k8s/crd.ts:55](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/crd.ts#L55)

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

makeKubeObject<KubeCRD\>('crd').apiList

#### Defined in

[lib/k8s/cluster.ts:87](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L87)

___

### getAuthorization

▸ `Static` `Optional` **getAuthorization**(`arg`, `resourceAttrs?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | `string` |
| `resourceAttrs?` | [`AuthRequestResourceAttrs`](../interfaces/lib_k8s_cluster.AuthRequestResourceAttrs.md) |

#### Returns

`any`

#### Inherited from

makeKubeObject<KubeCRD\>('crd').getAuthorization

#### Defined in

[lib/k8s/cluster.ts:110](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L110)

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

[lib/k8s/cluster.ts:106](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L106)

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

[lib/k8s/cluster.ts:93](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L93)

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

[lib/k8s/cluster.ts:88](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L88)

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

makeKubeObject<KubeCRD\>('crd').useGet

#### Defined in

[lib/k8s/cluster.ts:102](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L102)

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

[lib/k8s/cluster.ts:99](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L99)
