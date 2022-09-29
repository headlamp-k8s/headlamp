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

[lib/k8s/cluster.ts:481](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L481)

___

### failureThreshold

• `Optional` **failureThreshold**: `number`

#### Defined in

[lib/k8s/cluster.ts:491](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L491)

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

[lib/k8s/cluster.ts:475](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L475)

___

### initialDelaySeconds

• `Optional` **initialDelaySeconds**: `number`

#### Defined in

[lib/k8s/cluster.ts:487](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L487)

___

### periodSeconds

• `Optional` **periodSeconds**: `number`

#### Defined in

[lib/k8s/cluster.ts:489](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L489)

___

### successThreshold

• `Optional` **successThreshold**: `number`

#### Defined in

[lib/k8s/cluster.ts:490](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L490)

___

### tcpSocket

• `Optional` **tcpSocket**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `port` | `number` |

#### Defined in

[lib/k8s/cluster.ts:484](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L484)

___

### timeoutSeconds

• `Optional` **timeoutSeconds**: `number`

#### Defined in

[lib/k8s/cluster.ts:488](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L488)
