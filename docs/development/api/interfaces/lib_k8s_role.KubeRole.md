---
title: "Interface: KubeRole"
linkTitle: "KubeRole"
slug: "lib_k8s_role.KubeRole"
---

[lib/k8s/role](../modules/lib_k8s_role.md).KubeRole

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeRole`**

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

### rules

• **rules**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apiGroups` | `string`[] |
| `nonResourceURLs` | `string`[] |
| `resourceNames` | `string`[] |
| `resources` | `string`[] |
| `verbs` | `string`[] |

#### Defined in

[lib/k8s/role.ts:5](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/role.ts#L5)
