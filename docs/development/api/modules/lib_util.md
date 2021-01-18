---
title: "Module: lib/util"
linkTitle: "lib/util"
slug: "lib_util"
---

## Table of contents

### Interfaces

- [FilterState](../interfaces/lib_util.filterstate.md)

## Variables

### CLUSTER\_ACTION\_GRACE\_PERIOD

• `Const` **CLUSTER\_ACTION\_GRACE\_PERIOD**: *5000*= 5000

Defined in: lib/util.ts:18

## Functions

### filterResource

▸ **filterResource**(`item`: KubeObjectInterface, `filter`: [*FilterState*](../interfaces/lib_util.filterstate.md)): *boolean*

#### Parameters:

Name | Type |
:------ | :------ |
`item` | KubeObjectInterface |
`filter` | [*FilterState*](../interfaces/lib_util.filterstate.md) |

**Returns:** *boolean*

Defined in: lib/util.ts:81

___

### getCluster

▸ **getCluster**(): *string* \| *null*

**Returns:** *string* \| *null*

Defined in: lib/util.ts:116

___

### getClusterPrefixedPath

▸ **getClusterPrefixedPath**(`path?`: *string* \| *null*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`path?` | *string* \| *null* |

**Returns:** *string*

Defined in: lib/util.ts:108

___

### getPercentStr

▸ **getPercentStr**(`value`: *number*, `total`: *number*): *null* \| *string*

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *number* |
`total` | *number* |

**Returns:** *null* \| *string*

Defined in: lib/util.ts:30

___

### getReadyReplicas

▸ **getReadyReplicas**(`item`: Workload): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`item` | Workload |

**Returns:** *any*

Defined in: lib/util.ts:39

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

Defined in: lib/util.ts:57

___

### getResourceStr

▸ **getResourceStr**(`value`: *number*, `resourceType`: *cpu* \| *memory*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`value` | *number* |
`resourceType` | *cpu* \| *memory* |

**Returns:** *string*

Defined in: lib/util.ts:47

___

### getTotalReplicas

▸ **getTotalReplicas**(`item`: Workload): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`item` | Workload |

**Returns:** *any*

Defined in: lib/util.ts:43

___

### localeDate

▸ **localeDate**(`date`: DateParam): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`date` | DateParam |

**Returns:** *string*

Defined in: lib/util.ts:26

___

### timeAgo

▸ **timeAgo**(`date`: DateParam): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`date` | DateParam |

**Returns:** *string*

Defined in: lib/util.ts:22

___

### useErrorState

▸ **useErrorState**(`dependentSetter?`: (...`args`: *any*) => *void*): *any*[]

#### Parameters:

Name | Type |
:------ | :------ |
`dependentSetter?` | (...`args`: *any*) => *void* |

**Returns:** *any*[]

Defined in: lib/util.ts:128

___

### useFilterFunc

▸ **useFilterFunc**(): *function*

**Returns:** (`item`: KubeObjectInterface) => *boolean*

Defined in: lib/util.ts:103
