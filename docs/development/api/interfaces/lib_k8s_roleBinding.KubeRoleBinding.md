---
title: "Interface: KubeRoleBinding"
linkTitle: "KubeRoleBinding"
slug: "lib_k8s_roleBinding.KubeRoleBinding"
---

[lib/k8s/roleBinding](../modules/lib_k8s_roleBinding.md).KubeRoleBinding

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeRoleBinding`**

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

### roleRef

• **roleRef**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apiGroup` | `string` |
| `kind` | `string` |
| `name` | `string` |

#### Defined in

[lib/k8s/roleBinding.ts:5](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/roleBinding.ts#L5)

___

### subjects

• **subjects**: { `apiGroup`: `string` ; `kind`: `string` ; `name`: `string` ; `namespace`: `string`  }[]

#### Defined in

[lib/k8s/roleBinding.ts:10](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/roleBinding.ts#L10)
