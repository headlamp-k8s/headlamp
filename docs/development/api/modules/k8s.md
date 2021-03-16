---
title: "Module: k8s"
linkTitle: "k8s"
slug: "k8s"
---

## Variables

### ResourceClasses

• `Const` **ResourceClasses**: *object*

#### Type declaration:

Defined in: [k8s/index.ts:71](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/k8s/index.ts#L71)

## Functions

### getVersion

▸ **getVersion**(): *Promise*<StringDict\>

**Returns:** *Promise*<StringDict\>

Defined in: [k8s/index.ts:143](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/k8s/index.ts#L143)

___

### useCluster

▸ **useCluster**(): *null* \| *string*

**Returns:** *null* \| *string*

Defined in: [k8s/index.ts:126](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/k8s/index.ts#L126)

___

### useClustersConf

▸ **useClustersConf**(): ConfigState[*clusters*]

**Returns:** ConfigState[*clusters*]

Defined in: [k8s/index.ts:78](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/k8s/index.ts#L78)

___

### useConnectApi

▸ **useConnectApi**(...`apiCalls`: () => CancellablePromise[]): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`...apiCalls` | () => CancellablePromise[] |

**Returns:** *void*

Defined in: [k8s/index.ts:149](https://github.com/kinvolk/headlamp/blob/b1d8df6/frontend/src/lib/k8s/index.ts#L149)
