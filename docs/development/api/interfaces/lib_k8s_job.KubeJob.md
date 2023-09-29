---
title: "Interface: KubeJob"
linkTitle: "KubeJob"
slug: "lib_k8s_job.KubeJob"
---

[lib/k8s/job](../modules/lib_k8s_job.md).KubeJob

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeJob`**

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

▪ [otherProps: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `selector` | [`LabelSelector`](lib_k8s_cluster.LabelSelector.md) |
| `template` | { `metadata?`: [`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md) ; `spec`: [`KubePodSpec`](lib_k8s_pod.KubePodSpec.md)  } |
| `template.metadata?` | [`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md) |
| `template.spec` | [`KubePodSpec`](lib_k8s_pod.KubePodSpec.md) |

#### Defined in

[lib/k8s/job.ts:12](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/job.ts#L12)

___

### status

• **status**: `Object`

#### Index signature

▪ [otherProps: `string`]: `any`

#### Defined in

[lib/k8s/job.ts:20](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/job.ts#L20)
