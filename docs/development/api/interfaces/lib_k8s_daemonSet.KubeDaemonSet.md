---
title: "Interface: KubeDaemonSet"
linkTitle: "KubeDaemonSet"
slug: "lib_k8s_daemonSet.KubeDaemonSet"
---

[lib/k8s/daemonSet](../modules/lib_k8s_daemonSet.md).KubeDaemonSet

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeDaemonSet`**

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
| `selector` | [`LabelSelector`](lib_k8s_cluster.LabelSelector.md) |
| `updateStrategy` | { `rollingUpdate`: { `maxUnavailable`: `number`  } ; `type`: `string`  } |
| `updateStrategy.rollingUpdate` | { `maxUnavailable`: `number`  } |
| `updateStrategy.rollingUpdate.maxUnavailable` | `number` |
| `updateStrategy.type` | `string` |

#### Defined in

[lib/k8s/daemonSet.ts:5](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/daemonSet.ts#L5)

___

### status

• **status**: `Object`

#### Index signature

▪ [otherProps: `string`]: `any`

#### Defined in

[lib/k8s/daemonSet.ts:15](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/daemonSet.ts#L15)
