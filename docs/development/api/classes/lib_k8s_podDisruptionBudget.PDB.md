---
title: "Class: PDB"
linkTitle: "PDB"
slug: "lib_k8s_podDisruptionBudget.PDB"
---

[lib/k8s/podDisruptionBudget](../modules/lib_k8s_podDisruptionBudget.md).PDB

## Hierarchy

- `any`

  ↳ **`PDB`**

## Constructors

### constructor

• **new PDB**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubePDB`](../interfaces/lib_k8s_podDisruptionBudget.KubePDB.md) |

#### Inherited from

makeKubeObject<KubePDB\>('podDisruptionBudget').constructor

#### Defined in

[lib/k8s/cluster.ts:107](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L107)

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

[lib/k8s/podDisruptionBudget.ts:40](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/podDisruptionBudget.ts#L40)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubePDB\>('podDisruptionBudget').className

#### Defined in

[lib/k8s/cluster.ts:108](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L108)

## Accessors

### selectors

• `get` **selectors**(): `string`[]

#### Returns

`string`[]

#### Defined in

[lib/k8s/podDisruptionBudget.ts:50](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/podDisruptionBudget.ts#L50)

___

### spec

• `get` **spec**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `maxUnavailable?` | `number` |
| `minAvailable?` | `number` |
| `selector` | { `matchExpressions?`: { `key`: `string` ; `operator`: `string` ; `values`: `string`[]  } ; `matchLabels`: { `[key: string]`: `string`;  }  } |
| `selector.matchExpressions?` | { `key`: `string` ; `operator`: `string` ; `values`: `string`[]  } |
| `selector.matchExpressions.key` | `string` |
| `selector.matchExpressions.operator` | `string` |
| `selector.matchExpressions.values` | `string`[] |
| `selector.matchLabels` | { `[key: string]`: `string`;  } |

#### Defined in

[lib/k8s/podDisruptionBudget.ts:42](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/podDisruptionBudget.ts#L42)

___

### status

• `get` **status**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `conditions` | { `lastTransitionTime`: `string` ; `message`: `string` ; `observedGeneration`: `number` ; `reason`: `string` ; `status`: `string` ; `type`: `string`  }[] |
| `currentHealthy` | `number` |
| `desiredHealthy` | `number` |
| `disruptedPods?` | { `[key: string]`: `string`;  } |
| `disruptionsAllowed` | `number` |
| `expectedPods` | `number` |
| `observedGeneration` | `number` |

#### Defined in

[lib/k8s/podDisruptionBudget.ts:46](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/podDisruptionBudget.ts#L46)

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

makeKubeObject<KubePDB\>('podDisruptionBudget').apiList

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

makeKubeObject<KubePDB\>('podDisruptionBudget').getAuthorization

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

makeKubeObject<KubePDB\>('podDisruptionBudget').getErrorMessage

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

makeKubeObject<KubePDB\>('podDisruptionBudget').useApiGet

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

makeKubeObject<KubePDB\>('podDisruptionBudget').useApiList

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

makeKubeObject<KubePDB\>('podDisruptionBudget').useGet

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

makeKubeObject<KubePDB\>('podDisruptionBudget').useList

#### Defined in

[lib/k8s/cluster.ts:99](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L99)
