---
title: "Interface: KubeNode"
linkTitle: "KubeNode"
slug: "lib_k8s_node.KubeNode"
---

[lib/k8s/node](../modules/lib_k8s_node.md).KubeNode

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeNode`**

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
| `podCIDR` | `string` |

#### Defined in

[lib/k8s/node.ts:33](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/node.ts#L33)

___

### status

• **status**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addresses` | { `address`: `string` ; `type`: `string`  }[] |
| `capacity` | { `cpu`: `any` ; `memory`: `any`  } |
| `capacity.cpu` | `any` |
| `capacity.memory` | `any` |
| `conditions` | `Omit`<[`KubeCondition`](lib_k8s_cluster.KubeCondition.md), ``"lastProbeTime"`` \| ``"lastUpdateTime"``\> & { `lastHeartbeatTime`: `string`  }[] |
| `nodeInfo` | { `architecture`: `string` ; `bootID`: `string` ; `containerRuntimeVersion`: `string` ; `kernelVersion`: `string` ; `kubeProxyVersion`: `string` ; `kubeletVersion`: `string` ; `machineID`: `string` ; `operatingSystem`: `string` ; `osImage`: `string` ; `systemUUID`: `string`  } |
| `nodeInfo.architecture` | `string` |
| `nodeInfo.bootID` | `string` |
| `nodeInfo.containerRuntimeVersion` | `string` |
| `nodeInfo.kernelVersion` | `string` |
| `nodeInfo.kubeProxyVersion` | `string` |
| `nodeInfo.kubeletVersion` | `string` |
| `nodeInfo.machineID` | `string` |
| `nodeInfo.operatingSystem` | `string` |
| `nodeInfo.osImage` | `string` |
| `nodeInfo.systemUUID` | `string` |

#### Defined in

[lib/k8s/node.ts:8](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/node.ts#L8)
