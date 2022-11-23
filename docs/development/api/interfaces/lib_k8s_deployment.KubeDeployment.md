---
title: "Interface: KubeDeployment"
linkTitle: "KubeDeployment"
slug: "lib_k8s_deployment.KubeDeployment"
---

[lib/k8s/deployment](../modules/lib_k8s_deployment.md).KubeDeployment

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeDeployment`**

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

• **spec**: `Object`

#### Index signature

▪ [otherProps: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `selector?` | [`LabelSelector`](lib_k8s_cluster.LabelSelector.md) |
| `strategy?` | { `[otherProps: string]`: `any`; `type`: `string`  } |
| `strategy.type` | `string` |

#### Defined in

[lib/k8s/deployment.ts:5](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/deployment.ts#L5)

___

### status

• **status**: `Object`

#### Index signature

▪ [otherProps: `string`]: `any`

#### Defined in

[lib/k8s/deployment.ts:13](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/deployment.ts#L13)
