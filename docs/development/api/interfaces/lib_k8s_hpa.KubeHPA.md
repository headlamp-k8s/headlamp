---
title: "Interface: KubeHPA"
linkTitle: "KubeHPA"
slug: "lib_k8s_hpa.KubeHPA"
---

[lib/k8s/hpa](../modules/lib_k8s_hpa.md).KubeHPA

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeHPA`**

## Properties

### apiVersion

• `Optional` **apiVersion**: `string`

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[apiVersion](lib_k8s_cluster.KubeObjectInterface.md#apiversion)

#### Defined in

[lib/k8s/cluster.ts:37](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L37)

___

### kind

• **kind**: `string`

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[kind](lib_k8s_cluster.KubeObjectInterface.md#kind)

#### Defined in

[lib/k8s/cluster.ts:36](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L36)

___

### metadata

• **metadata**: [`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[metadata](lib_k8s_cluster.KubeObjectInterface.md#metadata)

#### Defined in

[lib/k8s/cluster.ts:38](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L38)

___

### spec

• **spec**: `HpaSpec`

#### Defined in

[lib/k8s/hpa.ts:158](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/hpa.ts#L158)

___

### status

• **status**: `HpaStatus`

#### Defined in

[lib/k8s/hpa.ts:159](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/hpa.ts#L159)
