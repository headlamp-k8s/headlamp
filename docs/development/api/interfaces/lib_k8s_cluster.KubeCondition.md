---
title: "Interface: KubeCondition"
linkTitle: "KubeCondition"
slug: "lib_k8s_cluster.KubeCondition"
---

[lib/k8s/cluster](../modules/lib_k8s_cluster.md).KubeCondition

## Properties

### lastProbeTime

• **lastProbeTime**: [`Time`](../modules/lib_k8s_cluster.md#time)

Last time we probed the condition.

#### Defined in

[lib/k8s/cluster.ts:827](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L827)

___

### lastTransitionTime

• `Optional` **lastTransitionTime**: [`Time`](../modules/lib_k8s_cluster.md#time)

#### Defined in

[lib/k8s/cluster.ts:828](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L828)

___

### lastUpdateTime

• `Optional` **lastUpdateTime**: [`Time`](../modules/lib_k8s_cluster.md#time)

#### Defined in

[lib/k8s/cluster.ts:829](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L829)

___

### message

• `Optional` **message**: `string`

#### Defined in

[lib/k8s/cluster.ts:830](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L830)

___

### reason

• `Optional` **reason**: `string`

Unique, one-word, CamelCase reason for the condition's last transition.

#### Defined in

[lib/k8s/cluster.ts:832](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L832)

___

### status

• **status**: `string`

Status of the condition, one of True, False, Unknown.

#### Defined in

[lib/k8s/cluster.ts:834](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L834)

___

### type

• **type**: `string`

#### Defined in

[lib/k8s/cluster.ts:835](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L835)
