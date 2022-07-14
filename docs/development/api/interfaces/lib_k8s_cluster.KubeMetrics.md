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

[lib/k8s/cluster.ts:487](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L487)

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

[lib/k8s/cluster.ts:492](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L492)

___

### usage

• **usage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cpu` | `string` |
| `memory` | `string` |

#### Defined in

[lib/k8s/cluster.ts:488](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L488)
