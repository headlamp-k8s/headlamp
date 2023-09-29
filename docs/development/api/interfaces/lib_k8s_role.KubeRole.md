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

[lib/k8s/role.ts:5](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/role.ts#L5)
