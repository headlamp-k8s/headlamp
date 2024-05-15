---
title: "Interface: KubePodSpec"
linkTitle: "KubePodSpec"
slug: "lib_k8s_pod.KubePodSpec"
---

[lib/k8s/pod](../modules/lib_k8s_pod.md).KubePodSpec

## Properties

### containers

• **containers**: [`KubeContainer`](lib_k8s_cluster.KubeContainer.md)[]

#### Defined in

[lib/k8s/pod.ts:18](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/pod.ts#L18)

___

### ephemeralContainers

• `Optional` **ephemeralContainers**: [`KubeContainer`](lib_k8s_cluster.KubeContainer.md)[]

#### Defined in

[lib/k8s/pod.ts:24](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/pod.ts#L24)

___

### initContainers

• `Optional` **initContainers**: [`KubeContainer`](lib_k8s_cluster.KubeContainer.md)[]

#### Defined in

[lib/k8s/pod.ts:23](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/pod.ts#L23)

___

### nodeName

• **nodeName**: `string`

#### Defined in

[lib/k8s/pod.ts:19](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/pod.ts#L19)

___

### nodeSelector

• `Optional` **nodeSelector**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[lib/k8s/pod.ts:20](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/pod.ts#L20)

___

### readinessGates

• `Optional` **readinessGates**: { `conditionType`: `string`  }[]

#### Defined in

[lib/k8s/pod.ts:25](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/pod.ts#L25)

___

### volumes

• `Optional` **volumes**: [`KubeVolume`](lib_k8s_pod.KubeVolume.md)[]

#### Defined in

[lib/k8s/pod.ts:28](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/pod.ts#L28)
