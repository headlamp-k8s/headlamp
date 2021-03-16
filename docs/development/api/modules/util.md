---
title: "Module: util"
linkTitle: "util"
slug: "util"
---

## Table of contents

### Interfaces

- [FilterState](../interfaces/util.filterstate.md)

## Variables

### CLUSTER\_ACTION\_GRACE\_PERIOD

• `Const` **CLUSTER\_ACTION\_GRACE\_PERIOD**: *5000*= 5000

Defined in: [util.ts:15](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/util.ts#L15)

## Functions

### filterResource

▸ **filterResource**(`item`: KubeObjectInterface, `filter`: [*FilterState*](../interfaces/util.filterstate.md)): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`item` | KubeObjectInterface |
`filter` | [*FilterState*](../interfaces/util.filterstate.md) |

**Returns:** *boolean*

Defined in: [util.ts:78](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/util.ts#L78)

___

### getCluster

▸ **getCluster**(): *string* \| *null*

**Returns:** *string* \| *null*

Defined in: [util.ts:113](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/util.ts#L113)

___

### getClusterPrefixedPath

▸ **getClusterPrefixedPath**(`path?`: *string* \| *null*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`path?` | *string* \| *null* |

**Returns:** *string*

Defined in: [util.ts:105](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/util.ts#L105)

___

### getPercentStr

▸ **getPercentStr**(`value`: *number*, `total`: *number*): *null* \| *string*

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *number* |
`total` | *number* |

**Returns:** *null* \| *string*

Defined in: [util.ts:27](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/util.ts#L27)

___

### getReadyReplicas

▸ **getReadyReplicas**(`item`: Workload): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`item` | Workload |

**Returns:** *any*

Defined in: [util.ts:36](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/util.ts#L36)

___

### getResourceMetrics

▸ **getResourceMetrics**(`item`: Node, `metrics`: KubeMetrics[], `resourceType`: *cpu* \| *memory*): *any*[]

#### Parameters:

Name | Type |
:------ | :------ |
`item` | Node |
`metrics` | KubeMetrics[] |
`resourceType` | *cpu* \| *memory* |

**Returns:** *any*[]

Defined in: [util.ts:54](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/util.ts#L54)

___

### getResourceStr

▸ **getResourceStr**(`value`: *number*, `resourceType`: *cpu* \| *memory*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *number* |
`resourceType` | *cpu* \| *memory* |

**Returns:** *string*

Defined in: [util.ts:44](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/util.ts#L44)

___

### getTotalReplicas

▸ **getTotalReplicas**(`item`: Workload): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`item` | Workload |

**Returns:** *any*

Defined in: [util.ts:40](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/util.ts#L40)

___

### localeDate

▸ **localeDate**(`date`: DateParam): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`date` | DateParam |

**Returns:** *string*

Defined in: [util.ts:23](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/util.ts#L23)

___

### timeAgo

▸ **timeAgo**(`date`: DateParam): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`date` | DateParam |

**Returns:** *string*

Defined in: [util.ts:19](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/util.ts#L19)

___

### useErrorState

▸ **useErrorState**(`dependentSetter?`: (...`args`: *any*) => *void*): *any*[]

#### Parameters:

Name | Type |
:------ | :------ |
`dependentSetter?` | (...`args`: *any*) => *void* |

**Returns:** *any*[]

Defined in: [util.ts:125](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/util.ts#L125)

___

### useFilterFunc

▸ **useFilterFunc**(): *function*

**Returns:** (`item`: KubeObjectInterface) => *boolean*

Defined in: [util.ts:100](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/util.ts#L100)
