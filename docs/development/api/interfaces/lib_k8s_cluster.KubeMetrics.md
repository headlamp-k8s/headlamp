---
title: "Interface: KubeMetrics"
linkTitle: "KubeMetrics"
slug: "lib_k8s_cluster.KubeMetrics"
---

[lib/k8s/cluster](../modules/lib_k8s_cluster.md).KubeMetrics

## Properties

### metadata

• **metadata**: [`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)

#### Defined in

[lib/k8s/cluster.ts:1213](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L1213)

___

### status

• **status**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `capacity` | { `cpu`: `string` ; `memory`: `string`  } |
| `capacity.cpu` | `string` |
| `capacity.memory` | `string` |

#### Defined in

[lib/k8s/cluster.ts:1218](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L1218)

___

### usage

• **usage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cpu` | `string` |
| `memory` | `string` |

#### Defined in

[lib/k8s/cluster.ts:1214](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L1214)
