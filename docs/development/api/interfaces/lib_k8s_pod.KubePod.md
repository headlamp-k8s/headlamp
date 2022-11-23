---
title: "Interface: KubePod"
linkTitle: "KubePod"
slug: "lib_k8s_pod.KubePod"
---

[lib/k8s/pod](../modules/lib_k8s_pod.md).KubePod

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubePod`**

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

#### Type declaration

| Name | Type |
| :------ | :------ |
| `containers` | [`KubeContainer`](lib_k8s_cluster.KubeContainer.md)[] |
| `initContainers?` | `any`[] |
| `nodeName` | `string` |
| `nodeSelector?` | { `[key: string]`: `string`;  } |

#### Defined in

[lib/k8s/pod.ts:13](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/pod.ts#L13)

___

### status

• **status**: `Object`

#### Index signature

▪ [other: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `conditions` | [`KubeCondition`](lib_k8s_cluster.KubeCondition.md)[] |
| `containerStatuses` | [`KubeContainerStatus`](lib_k8s_cluster.KubeContainerStatus.md)[] |
| `hostIP` | `string` |
| `initContainerStatuses?` | [`KubeContainerStatus`](lib_k8s_cluster.KubeContainerStatus.md)[] |
| `message?` | `string` |
| `phase` | `string` |
| `qosClass?` | `string` |
| `reason?` | `string` |
| `startTime` | [`Time`](../modules/lib_k8s_cluster.md#time) |

#### Defined in

[lib/k8s/pod.ts:21](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/pod.ts#L21)
