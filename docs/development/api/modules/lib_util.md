---
title: "Module: lib/util"
linkTitle: "lib/util"
slug: "lib_util"
---

## Namespaces

- [auth](lib_util.auth.md)
- [units](lib_util.units.md)

## Interfaces

- [TimeAgoOptions](../interfaces/lib_util.TimeAgoOptions.md)

## Type aliases

### DateFormatOptions

Ƭ **DateFormatOptions**: ``"brief"`` \| ``"mini"``

#### Defined in

[lib/util.ts:33](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L33)

___

### DateParam

Ƭ **DateParam**: `string` \| `number` \| `Date`

#### Defined in

[lib/util.ts:31](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L31)

## Variables

### CLUSTER\_ACTION\_GRACE\_PERIOD

• **CLUSTER\_ACTION\_GRACE\_PERIOD**: ``5000``

#### Defined in

[lib/util.ts:29](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L29)

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

[lib/util.ts:301](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L301)

___

### filterGeneric

▸ **filterGeneric**<`T`\>(`item`, `filter`, `matchCriteria?`): `boolean`

Filters a generic item based on the filter state.

The item is considered to match if any of the matchCriteria (described as JSONPath)
matches the filter.search contents. Case matching is insensitive.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` = { `[key: string]`: `any`;  } |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `T` | The item to filter. |
| `filter` | `FilterState` | The filter state. |
| `matchCriteria?` | `string`[] | The JSONPath criteria to match. |

#### Returns

`boolean`

#### Defined in

[redux/filterSlice.ts:73](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/filterSlice.ts#L73)

___

### filterResource

▸ **filterResource**(`item`, `filter`, `matchCriteria?`): `boolean`

Filters a resource based on the filter state.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md) \| [`KubeEvent`](../interfaces/lib_k8s_event.KubeEvent.md) | The item to filter. |
| `filter` | `FilterState` | The filter state. |
| `matchCriteria?` | `string`[] | The JSONPath criteria to match. |

#### Returns

`boolean`

True if the item matches the filter, false otherwise.

#### Defined in

[redux/filterSlice.ts:27](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/filterSlice.ts#L27)

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

[lib/util.ts:65](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L65)

___

### getCluster

▸ **getCluster**(): `string` \| ``null``

#### Returns

`string` \| ``null``

The current cluster name, or null if not in a cluster context.

#### Defined in

[lib/cluster.ts:20](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/cluster.ts#L20)

___

### getClusterPrefixedPath

▸ **getClusterPrefixedPath**(`path?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path?` | ``null`` \| `string` |

#### Returns

`string`

A path prefixed with cluster path, and the given path.

The given path does not start with a /, it will be added.

#### Defined in

[lib/cluster.ts:9](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/cluster.ts#L9)

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

[lib/util.ts:102](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L102)

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

[lib/util.ts:111](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L111)

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

[lib/util.ts:129](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L129)

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

[lib/util.ts:119](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L119)

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

[lib/util.ts:115](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L115)

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

[lib/util.ts:85](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L85)

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

[lib/util.ts:310](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L310)

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

[lib/util.ts:46](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L46)

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

[lib/util.ts:168](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L168)

___

### useFilterFunc

▸ **useFilterFunc**<`T`\>(`matchCriteria?`): (`item`: `T`) => `boolean`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md) \| [`KubeEvent`](../interfaces/lib_k8s_event.KubeEvent.md) \| { `[key: string]`: `any`;  } = [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md) \| [`KubeEvent`](../interfaces/lib_k8s_event.KubeEvent.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `matchCriteria?` | `string`[] | The JSONPath criteria to match. |

#### Returns

`fn`

A filter function that can be used to filter a list of items.

▸ (`item`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `T` |

##### Returns

`boolean`

#### Defined in

[lib/util.ts:153](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L153)

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

[lib/util.ts:389](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L389)

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

[lib/util.ts:193](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L193)

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

[lib/util.ts:197](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/util.ts#L197)
