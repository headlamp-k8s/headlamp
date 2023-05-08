---
title: "Class: StatefulSet"
linkTitle: "StatefulSet"
slug: "lib_k8s_statefulSet.StatefulSet"
---

[lib/k8s/statefulSet](../modules/lib_k8s_statefulSet.md).StatefulSet

## Hierarchy

- `any`

  ↳ **`StatefulSet`**

## Constructors

### constructor

• **new StatefulSet**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeStatefulSet`](../interfaces/lib_k8s_statefulSet.KubeStatefulSet.md) |

#### Inherited from

makeKubeObject<KubeStatefulSet\>('StatefulSet').constructor

#### Defined in

[lib/k8s/cluster.ts:106](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L106)

## Properties

### apiEndpoint

▪ `Static` **apiEndpoint**: `Object`

#### Index signature

▪ [other: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `scale?` | { `get`: (`namespace`: `string`, `name`: `string`) => `Promise`<`any`\> ; `put`: (`body`: { `metadata`: [`KubeMetadata`](../interfaces/lib_k8s_cluster.KubeMetadata.md) ; `spec`: { `replicas`: `number`  }  }) => `Promise`<`any`\>  } |
| `scale.get` | (`namespace`: `string`, `name`: `string`) => `Promise`<`any`\> |
| `scale.put` | (`body`: { `metadata`: [`KubeMetadata`](../interfaces/lib_k8s_cluster.KubeMetadata.md) ; `spec`: { `replicas`: `number`  }  }) => `Promise`<`any`\> |

#### Defined in

[lib/k8s/statefulSet.ts:21](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/statefulSet.ts#L21)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeStatefulSet\>('StatefulSet').className

#### Defined in

[lib/k8s/cluster.ts:107](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L107)

## Accessors

### spec

• `get` **spec**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/statefulSet.ts:23](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/statefulSet.ts#L23)

___

### status

• `get` **status**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/statefulSet.ts:27](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/statefulSet.ts#L27)

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

makeKubeObject<KubeStatefulSet\>('StatefulSet').apiList

#### Defined in

[lib/k8s/cluster.ts:86](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L86)

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

makeKubeObject<KubeStatefulSet\>('StatefulSet').getAuthorization

#### Defined in

[lib/k8s/cluster.ts:109](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L109)

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

makeKubeObject<KubeStatefulSet\>('StatefulSet').getErrorMessage

#### Defined in

[lib/k8s/cluster.ts:105](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L105)

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

makeKubeObject<KubeStatefulSet\>('StatefulSet').useApiGet

#### Defined in

[lib/k8s/cluster.ts:92](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L92)

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

makeKubeObject<KubeStatefulSet\>('StatefulSet').useApiList

#### Defined in

[lib/k8s/cluster.ts:87](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L87)

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

makeKubeObject<KubeStatefulSet\>('StatefulSet').useGet

#### Defined in

[lib/k8s/cluster.ts:101](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L101)

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

makeKubeObject<KubeStatefulSet\>('StatefulSet').useList

#### Defined in

[lib/k8s/cluster.ts:98](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L98)
