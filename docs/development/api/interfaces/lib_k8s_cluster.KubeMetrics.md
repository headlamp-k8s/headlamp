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

[lib/k8s/cluster.ts:630](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/cluster.ts#L630)

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

[lib/k8s/cluster.ts:635](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/cluster.ts#L635)

___

### usage

• **usage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cpu` | `string` |
| `memory` | `string` |

#### Defined in

[lib/k8s/cluster.ts:631](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/cluster.ts#L631)
