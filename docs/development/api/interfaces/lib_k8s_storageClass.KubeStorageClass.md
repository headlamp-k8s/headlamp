---
title: "Interface: KubeStorageClass"
linkTitle: "KubeStorageClass"
slug: "lib_k8s_storageClass.KubeStorageClass"
---

[lib/k8s/storageClass](../modules/lib_k8s_storageClass.md).KubeStorageClass

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeStorageClass`**

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

### provisioner

• **provisioner**: `string`

#### Defined in

[lib/k8s/storageClass.ts:5](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/storageClass.ts#L5)

___

### reclaimPolicy

• **reclaimPolicy**: `string`

#### Defined in

[lib/k8s/storageClass.ts:6](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/storageClass.ts#L6)

___

### volumeBindingMode

• **volumeBindingMode**: `string`

#### Defined in

[lib/k8s/storageClass.ts:7](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/storageClass.ts#L7)
