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

[lib/util.ts:30](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L30)

___

### DateParam

Ƭ **DateParam**: `string` \| `number` \| `Date`

#### Defined in

[lib/util.ts:28](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L28)

## Variables

### CLUSTER\_ACTION\_GRACE\_PERIOD

• `Const` **CLUSTER\_ACTION\_GRACE\_PERIOD**: ``5000``

#### Defined in

[lib/util.ts:26](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L26)

## Functions

### filterResource

▸ **filterResource**(`item`, `filter`, `matchCriteria?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md) |
| `filter` | [`FilterState`](../interfaces/lib_util.FilterState.md) |
| `matchCriteria?` | `string`[] |

#### Returns

`boolean`

#### Defined in

[lib/util.ts:139](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L139)

___

### getCluster

▸ **getCluster**(): `string` \| ``null``

#### Returns

`string` \| ``null``

#### Defined in

[lib/util.ts:208](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L208)

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

[lib/util.ts:200](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L200)

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

[lib/util.ts:88](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L88)

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

[lib/util.ts:97](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L97)

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

[lib/util.ts:115](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L115)

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

[lib/util.ts:105](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L105)

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

[lib/util.ts:101](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L101)

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

[lib/util.ts:72](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L72)

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

[lib/util.ts:43](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L43)

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

[lib/util.ts:220](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L220)

___

### useFilterFunc

▸ **useFilterFunc**(`matchCriteria?`): (`item`: [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md)) => `boolean`

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
| `item` | [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md) |

##### Returns

`boolean`

#### Defined in

[lib/util.ts:195](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L195)

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

[lib/util.ts:245](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L245)

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

[lib/util.ts:249](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/util.ts#L249)
