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

• **spec**: [`KubePodSpec`](lib_k8s_pod.KubePodSpec.md)

#### Defined in

[lib/k8s/pod.ts:25](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L25)

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

[lib/k8s/pod.ts:26](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L26)
