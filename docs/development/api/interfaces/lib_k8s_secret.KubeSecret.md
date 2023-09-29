---
title: "Interface: KubeSecret"
linkTitle: "KubeSecret"
slug: "lib_k8s_secret.KubeSecret"
---

[lib/k8s/secret](../modules/lib_k8s_secret.md).KubeSecret

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeSecret`**

## Properties

### apiVersion

• `Optional` **apiVersion**: `string`

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[apiVersion](lib_k8s_cluster.KubeObjectInterface.md#apiversion)

#### Defined in

[lib/k8s/cluster.ts:37](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L37)

___

### data

• **data**: [`StringDict`](lib_k8s_cluster.StringDict.md)

#### Defined in

[lib/k8s/secret.ts:5](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/secret.ts#L5)

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

### type

• **type**: `string`

#### Defined in

[lib/k8s/secret.ts:6](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/secret.ts#L6)
