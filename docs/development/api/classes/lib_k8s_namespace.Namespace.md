---
title: "Class: Namespace"
linkTitle: "Namespace"
slug: "lib_k8s_namespace.Namespace"
---

[lib/k8s/namespace](../modules/lib_k8s_namespace.md).Namespace

## Hierarchy

- `any`

  ↳ **`Namespace`**

## Constructors

### constructor

• **new Namespace**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeNamespace`](../interfaces/lib_k8s_namespace.KubeNamespace.md) |

#### Inherited from

makeKubeObject<KubeNamespace\>('namespace').constructor

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

[lib/k8s/namespace.ts:11](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/namespace.ts#L11)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeNamespace\>('namespace').className

#### Defined in

[lib/k8s/cluster.ts:108](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L108)

## Accessors

### status

• `get` **status**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/namespace.ts:13](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/namespace.ts#L13)

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

makeKubeObject<KubeNamespace\>('namespace').apiList

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

makeKubeObject<KubeNamespace\>('namespace').getAuthorization

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

makeKubeObject<KubeNamespace\>('namespace').getErrorMessage

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

makeKubeObject<KubeNamespace\>('namespace').useApiGet

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

makeKubeObject<KubeNamespace\>('namespace').useApiList

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

makeKubeObject<KubeNamespace\>('namespace').useGet

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

makeKubeObject<KubeNamespace\>('namespace').useList

#### Defined in

[lib/k8s/cluster.ts:99](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L99)
