---
title: "Interface: KubeContainerProbe"
linkTitle: "KubeContainerProbe"
slug: "lib_k8s_cluster.KubeContainerProbe"
---

[lib/k8s/cluster](../modules/lib_k8s_cluster.md).KubeContainerProbe

## Properties

### exec

• `Optional` **exec**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `command` | `string`[] |

#### Defined in

[lib/k8s/cluster.ts:560](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L560)

___

### failureThreshold

• `Optional` **failureThreshold**: `number`

#### Defined in

[lib/k8s/cluster.ts:570](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L570)

___

### httpGet

• `Optional` **httpGet**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `host?` | `string` |
| `path?` | `string` |
| `port` | `number` |
| `scheme` | `string` |

#### Defined in

[lib/k8s/cluster.ts:554](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L554)

___

### initialDelaySeconds

• `Optional` **initialDelaySeconds**: `number`

#### Defined in

[lib/k8s/cluster.ts:566](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L566)

___

### periodSeconds

• `Optional` **periodSeconds**: `number`

#### Defined in

[lib/k8s/cluster.ts:568](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L568)

___

### successThreshold

• `Optional` **successThreshold**: `number`

#### Defined in

[lib/k8s/cluster.ts:569](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L569)

___

### tcpSocket

• `Optional` **tcpSocket**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `port` | `number` |

#### Defined in

[lib/k8s/cluster.ts:563](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L563)

___

### timeoutSeconds

• `Optional` **timeoutSeconds**: `number`

#### Defined in

[lib/k8s/cluster.ts:567](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L567)
