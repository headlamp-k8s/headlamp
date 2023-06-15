---
title: "Class: Job"
linkTitle: "Job"
slug: "lib_k8s_job.Job"
---

[lib/k8s/job](../modules/lib_k8s_job.md).Job

## Hierarchy

- `any`

  ↳ **`Job`**

## Constructors

### constructor

• **new Job**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeJob`](../interfaces/lib_k8s_job.KubeJob.md) |

#### Inherited from

makeKubeObject<KubeJob\>('Job').constructor

#### Defined in

[lib/k8s/cluster.ts:106](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/cluster.ts#L106)

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

[lib/k8s/job.ts:15](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/job.ts#L15)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeJob\>('Job').className

#### Defined in

[lib/k8s/cluster.ts:107](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/cluster.ts#L107)

## Accessors

### spec

• `get` **spec**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/job.ts:17](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/job.ts#L17)

___

### status

• `get` **status**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/job.ts:21](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/job.ts#L21)

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

makeKubeObject<KubeJob\>('Job').apiList

#### Defined in

[lib/k8s/cluster.ts:86](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/cluster.ts#L86)

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

makeKubeObject<KubeJob\>('Job').getAuthorization

#### Defined in

[lib/k8s/cluster.ts:109](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/cluster.ts#L109)

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

makeKubeObject<KubeJob\>('Job').getErrorMessage

#### Defined in

[lib/k8s/cluster.ts:105](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/cluster.ts#L105)

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

makeKubeObject<KubeJob\>('Job').useApiGet

#### Defined in

[lib/k8s/cluster.ts:92](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/cluster.ts#L92)

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

makeKubeObject<KubeJob\>('Job').useApiList

#### Defined in

[lib/k8s/cluster.ts:87](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/cluster.ts#L87)

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

makeKubeObject<KubeJob\>('Job').useGet

#### Defined in

[lib/k8s/cluster.ts:101](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/cluster.ts#L101)

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

makeKubeObject<KubeJob\>('Job').useList

#### Defined in

[lib/k8s/cluster.ts:98](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/cluster.ts#L98)
