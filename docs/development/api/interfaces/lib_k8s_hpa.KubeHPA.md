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

[lib/k8s/cluster.ts:24](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L24)

___

### kind

• **kind**: `string`

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[kind](lib_k8s_cluster.KubeObjectInterface.md#kind)

#### Defined in

[lib/k8s/cluster.ts:23](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L23)

___

### metadata

• **metadata**: [`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[metadata](lib_k8s_cluster.KubeObjectInterface.md#metadata)

#### Defined in

[lib/k8s/cluster.ts:25](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L25)

___

### spec

• **spec**: `HpaSpec`

#### Defined in

[lib/k8s/hpa.ts:158](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/hpa.ts#L158)

___

### status

• **status**: `HpaStatus`

#### Defined in

[lib/k8s/hpa.ts:159](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/hpa.ts#L159)
