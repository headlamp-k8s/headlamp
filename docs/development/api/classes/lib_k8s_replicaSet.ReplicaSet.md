---
title: "Class: ReplicaSet"
linkTitle: "ReplicaSet"
slug: "lib_k8s_replicaSet.ReplicaSet"
---

[lib/k8s/replicaSet](../modules/lib_k8s_replicaSet.md).ReplicaSet

## Hierarchy

- `any`

  ↳ **`ReplicaSet`**

## Constructors

### constructor

• **new ReplicaSet**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeReplicaSet`](../interfaces/lib_k8s_replicaSet.KubeReplicaSet.md) |

#### Inherited from

makeKubeObject<KubeReplicaSet\>('ReplicaSet').constructor

#### Defined in

[lib/k8s/cluster.ts:93](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L93)

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

[lib/k8s/replicaSet.ts:22](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/replicaSet.ts#L22)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeReplicaSet\>('ReplicaSet').className

#### Defined in

[lib/k8s/cluster.ts:94](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L94)

## Accessors

### spec

• `get` **spec**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `minReadySeconds` | `number` |
| `replicas` | `number` |
| `selector` | [`LabelSelector`](../interfaces/lib_k8s_cluster.LabelSelector.md) |

#### Defined in

[lib/k8s/replicaSet.ts:24](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/replicaSet.ts#L24)

___

### status

• `get` **status**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `availableReplicas` | `number` |
| `conditions` | `Omit`<[`KubeCondition`](../interfaces/lib_k8s_cluster.KubeCondition.md), ``"lastProbeTime"`` \| ``"lastUpdateTime"``\>[] |
| `fullyLabeledReplicas` | `number` |
| `observedGeneration` | `number` |
| `readyReplicas` | `number` |
| `replicas` | `number` |

#### Defined in

[lib/k8s/replicaSet.ts:28](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/replicaSet.ts#L28)

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

makeKubeObject<KubeReplicaSet\>('ReplicaSet').apiList

#### Defined in

[lib/k8s/cluster.ts:73](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L73)

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

makeKubeObject<KubeReplicaSet\>('ReplicaSet').getErrorMessage

#### Defined in

[lib/k8s/cluster.ts:92](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L92)

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

makeKubeObject<KubeReplicaSet\>('ReplicaSet').useApiGet

#### Defined in

[lib/k8s/cluster.ts:79](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L79)

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

makeKubeObject<KubeReplicaSet\>('ReplicaSet').useApiList

#### Defined in

[lib/k8s/cluster.ts:74](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L74)

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

makeKubeObject<KubeReplicaSet\>('ReplicaSet').useGet

#### Defined in

[lib/k8s/cluster.ts:88](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L88)

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

makeKubeObject<KubeReplicaSet\>('ReplicaSet').useList

#### Defined in

[lib/k8s/cluster.ts:85](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L85)
