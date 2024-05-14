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

[lib/k8s/cluster.ts:864](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L864)

___

### lastTransitionTime

• `Optional` **lastTransitionTime**: [`Time`](../modules/lib_k8s_cluster.md#time)

#### Defined in

[lib/k8s/cluster.ts:865](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L865)

___

### lastUpdateTime

• `Optional` **lastUpdateTime**: [`Time`](../modules/lib_k8s_cluster.md#time)

#### Defined in

[lib/k8s/cluster.ts:866](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L866)

___

### message

• `Optional` **message**: `string`

#### Defined in

[lib/k8s/cluster.ts:867](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L867)

___

### reason

• `Optional` **reason**: `string`

Unique, one-word, CamelCase reason for the condition's last transition.

#### Defined in

[lib/k8s/cluster.ts:869](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L869)

___

### status

• **status**: `string`

Status of the condition, one of True, False, Unknown.

#### Defined in

[lib/k8s/cluster.ts:871](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L871)

___

### type

• **type**: `string`

#### Defined in

[lib/k8s/cluster.ts:872](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L872)
