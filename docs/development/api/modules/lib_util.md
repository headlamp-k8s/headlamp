---
title: "Module: lib/util"
linkTitle: "lib/util"
slug: "lib_util"
---

## Namespaces

- [auth](lib_util.auth.md)
- [units](lib_util.units.md)

## Interfaces

- [FilterState](../interfaces/lib_util.FilterState.md)
- [TimeAgoOptions](../interfaces/lib_util.TimeAgoOptions.md)

## Type aliases

### DateFormatOptions

Ƭ **DateFormatOptions**: ``"brief"`` \| ``"mini"``

#### Defined in

[lib/util.ts:32](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L32)

___

### DateParam

Ƭ **DateParam**: `string` \| `number` \| `Date`

#### Defined in

[lib/util.ts:30](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L30)

## Variables

### CLUSTER\_ACTION\_GRACE\_PERIOD

• **CLUSTER\_ACTION\_GRACE\_PERIOD**: ``5000``

#### Defined in

[lib/util.ts:28](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L28)

## Functions

### filterResource

▸ **filterResource**(`item`, `filter`, `matchCriteria?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md) \| [`KubeEvent`](../interfaces/lib_k8s_event.KubeEvent.md) |
| `filter` | [`FilterState`](../interfaces/lib_util.FilterState.md) |
| `matchCriteria?` | `string`[] |

#### Returns

`boolean`

#### Defined in

[lib/util.ts:142](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L142)

___

### getCluster

▸ **getCluster**(): `string` \| ``null``

#### Returns

`string` \| ``null``

#### Defined in

[lib/util.ts:211](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L211)

___

### getClusterPrefixedPath

▸ **getClusterPrefixedPath**(`path?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path?` | ``null`` \| `string` |

#### Returns

`string`

#### Defined in

[lib/util.ts:203](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L203)

___

### getPercentStr

▸ **getPercentStr**(`value`, `total`): ``null`` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |
| `total` | `number` |

#### Returns

``null`` \| `string`

#### Defined in

[lib/util.ts:91](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L91)

___

### getReadyReplicas

▸ **getReadyReplicas**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Workload`](lib_k8s_cluster.md#workload) |

#### Returns

`any`

#### Defined in

[lib/util.ts:100](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L100)

___

### getResourceMetrics

▸ **getResourceMetrics**(`item`, `metrics`, `resourceType`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Node`](../classes/lib_k8s_node.Node.md) |
| `metrics` | [`KubeMetrics`](../interfaces/lib_k8s_cluster.KubeMetrics.md)[] |
| `resourceType` | ``"cpu"`` \| ``"memory"`` |

#### Returns

`any`[]

#### Defined in

[lib/util.ts:118](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L118)

___

### getResourceStr

▸ **getResourceStr**(`value`, `resourceType`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |
| `resourceType` | ``"cpu"`` \| ``"memory"`` |

#### Returns

`string`

#### Defined in

[lib/util.ts:108](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L108)

___

### getTotalReplicas

▸ **getTotalReplicas**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Workload`](lib_k8s_cluster.md#workload) |

#### Returns

`any`

#### Defined in

[lib/util.ts:104](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L104)

___

### localeDate

▸ **localeDate**(`date`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | [`DateParam`](lib_util.md#dateparam) |

#### Returns

`string`

#### Defined in

[lib/util.ts:74](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L74)

___

### timeAgo

▸ **timeAgo**(`date`, `options?`): `string`

Show the time passed since the given date, in the desired format.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | [`DateParam`](lib_util.md#dateparam) | The date since which to calculate the duration. |
| `options` | [`TimeAgoOptions`](../interfaces/lib_util.TimeAgoOptions.md) | `format` takes "brief" or "mini". "brief" rounds the date and uses the largest suitable unit (e.g. "4 weeks"). "mini" uses something like "4w" (for 4 weeks). |

#### Returns

`string`

The formatted date.

#### Defined in

[lib/util.ts:45](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L45)

___

### useErrorState

▸ **useErrorState**(`dependentSetter?`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `dependentSetter?` | (...`args`: `any`) => `void` |

#### Returns

`any`[]

#### Defined in

[lib/util.ts:223](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L223)

___

### useFilterFunc

▸ **useFilterFunc**(`matchCriteria?`): (`item`: [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md) \| [`KubeEvent`](../interfaces/lib_k8s_event.KubeEvent.md)) => `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `matchCriteria?` | `string`[] |

#### Returns

`fn`

▸ (`item`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md) \| [`KubeEvent`](../interfaces/lib_k8s_event.KubeEvent.md) |

##### Returns

`boolean`

#### Defined in

[lib/util.ts:198](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L198)

___

### useURLState

▸ **useURLState**(`key`, `defaultValue`): [`number`, `React.Dispatch`<`React.SetStateAction`<`number`\>\>]

A hook to manage a state variable that is also stored in the URL.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The name of the key in the URL. If empty, then the hook behaves like useState. |
| `defaultValue` | `number` | - |

#### Returns

[`number`, `React.Dispatch`<`React.SetStateAction`<`number`\>\>]

#### Defined in

[lib/util.ts:248](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L248)

▸ **useURLState**(`key`, `valueOrParams`): [`number`, `React.Dispatch`<`React.SetStateAction`<`number`\>\>]

A hook to manage a state variable that is also stored in the URL.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The name of the key in the URL. If empty, then the hook behaves like useState. |
| `valueOrParams` | `number` \| `URLStateParams`<`number`\> | - |

#### Returns

[`number`, `React.Dispatch`<`React.SetStateAction`<`number`\>\>]

#### Defined in

[lib/util.ts:252](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/util.ts#L252)
