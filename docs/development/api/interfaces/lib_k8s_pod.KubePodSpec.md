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

[lib/k8s/pod.ts:13](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L13)

___

### initContainers

• `Optional` **initContainers**: `any`[]

#### Defined in

[lib/k8s/pod.ts:18](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L18)

___

### nodeName

• **nodeName**: `string`

#### Defined in

[lib/k8s/pod.ts:14](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L14)

___

### nodeSelector

• `Optional` **nodeSelector**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[lib/k8s/pod.ts:15](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L15)

___

### readinessGates

• `Optional` **readinessGates**: { `conditionType`: `string`  }[]

#### Defined in

[lib/k8s/pod.ts:19](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L19)
