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

[lib/util.ts:32](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L32)

___

### DateParam

Ƭ **DateParam**: `string` \| `number` \| `Date`

#### Defined in

[lib/util.ts:30](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L30)

## Variables

### CLUSTER\_ACTION\_GRACE\_PERIOD

• **CLUSTER\_ACTION\_GRACE\_PERIOD**: ``5000``

#### Defined in

[lib/util.ts:28](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L28)

## Functions

### compareUnits

▸ **compareUnits**(`quantity1`, `quantity2`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `quantity1` | `string` |
| `quantity2` | `string` |

#### Returns

`boolean`

#### Defined in

[lib/util.ts:407](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L407)

___

### filterGeneric

▸ **filterGeneric**<`T`\>(`item`, `filter`, `matchCriteria?`): `boolean`

Filters a generic item based on the filter state.
The item is considered to match if any of the matchCriteria (described as JSONPath) matches the filter.search contents. Case matching is insensitive.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` = { `[key: string]`: `any`;  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `T` | The item to filter. |
| `filter` | [`FilterState`](../interfaces/lib_util.FilterState.md) | The filter state. |
| `matchCriteria?` | `string`[] | The JSONPath criteria to match. |

#### Returns

`boolean`

#### Defined in

[lib/util.ts:195](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L195)

___

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

[lib/util.ts:152](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L152)

___

### formatDuration

▸ **formatDuration**(`duration`, `options?`): `string`

Format a duration in milliseconds to a human-readable string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `duration` | `number` | The duration in milliseconds. |
| `options` | [`TimeAgoOptions`](../interfaces/lib_util.TimeAgoOptions.md) | `format` takes "brief" or "mini". "brief" rounds the date and uses the largest suitable unit (e.g. "4 weeks"). "mini" uses something like "4w" (for 4 weeks). |

#### Returns

`string`

The formatted duration.

#### Defined in

[lib/util.ts:64](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L64)

___

### getCluster

▸ **getCluster**(): `string` \| ``null``

#### Returns

`string` \| ``null``

#### Defined in

[lib/util.ts:262](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L262)

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

[lib/util.ts:254](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L254)

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

[lib/util.ts:101](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L101)

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

[lib/util.ts:110](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L110)

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

[lib/util.ts:128](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L128)

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

[lib/util.ts:118](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L118)

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

[lib/util.ts:114](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L114)

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

[lib/util.ts:84](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L84)

___

### normalizeUnit

▸ **normalizeUnit**(`resourceType`, `quantity`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `resourceType` | `string` |
| `quantity` | `string` |

#### Returns

`string`

#### Defined in

[lib/util.ts:416](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L416)

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

[lib/util.ts:45](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L45)

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

[lib/util.ts:274](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L274)

___

### useFilterFunc

▸ **useFilterFunc**<`T`\>(`matchCriteria?`): (`item`: `T`) => `boolean`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md) \| [`KubeEvent`](../interfaces/lib_k8s_event.KubeEvent.md) \| { `[key: string]`: `any`;  } = [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md) \| [`KubeEvent`](../interfaces/lib_k8s_event.KubeEvent.md) |

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
| `item` | `T` |

##### Returns

`boolean`

#### Defined in

[lib/util.ts:239](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L239)

___

### useId

▸ **useId**(`prefix?`): `undefined` \| `string`

Creates a unique ID, with the given prefix.
If UNDER_TEST is set to true, it will return the same ID every time, so snapshots do not get invalidated.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `prefix` | `string` | `''` |

#### Returns

`undefined` \| `string`

#### Defined in

[lib/util.ts:495](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L495)

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

[lib/util.ts:299](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L299)

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

[lib/util.ts:303](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/util.ts#L303)
