---
title: "Interface: KubePersistentVolume"
linkTitle: "KubePersistentVolume"
slug: "lib_k8s_persistentVolume.KubePersistentVolume"
---

[lib/k8s/persistentVolume](../modules/lib_k8s_persistentVolume.md).KubePersistentVolume

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubePersistentVolume`**

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

• **spec**: `Object`

#### Index signature

▪ [other: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `capacity` | { `storage`: `string`  } |
| `capacity.storage` | `string` |

#### Defined in

[lib/k8s/persistentVolume.ts:5](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/persistentVolume.ts#L5)

___

### status

• **status**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `phase` | `string` |
| `reason` | `string` |

#### Defined in

[lib/k8s/persistentVolume.ts:11](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/persistentVolume.ts#L11)
