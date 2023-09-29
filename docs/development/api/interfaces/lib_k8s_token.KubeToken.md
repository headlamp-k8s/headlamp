---
title: "Interface: KubeToken"
linkTitle: "KubeToken"
slug: "lib_k8s_token.KubeToken"
---

[lib/k8s/token](../modules/lib_k8s_token.md).KubeToken

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeToken`**

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

#### Type declaration

| Name | Type |
| :------ | :------ |
| `audiences` | `string`[] |
| `expirationSeconds` | `number` |

#### Defined in

[lib/k8s/token.ts:8](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/token.ts#L8)

___

### status

• **status**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expirationTimestamp` | `string` |
| `token` | `string` |

#### Defined in

[lib/k8s/token.ts:4](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/token.ts#L4)
