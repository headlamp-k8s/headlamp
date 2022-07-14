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

[lib/k8s/cluster.ts:462](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L462)

___

### failureThreshold

• `Optional` **failureThreshold**: `number`

#### Defined in

[lib/k8s/cluster.ts:472](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L472)

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

[lib/k8s/cluster.ts:456](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L456)

___

### initialDelaySeconds

• `Optional` **initialDelaySeconds**: `number`

#### Defined in

[lib/k8s/cluster.ts:468](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L468)

___

### periodSeconds

• `Optional` **periodSeconds**: `number`

#### Defined in

[lib/k8s/cluster.ts:470](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L470)

___

### successThreshold

• `Optional` **successThreshold**: `number`

#### Defined in

[lib/k8s/cluster.ts:471](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L471)

___

### tcpSocket

• `Optional` **tcpSocket**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `port` | `number` |

#### Defined in

[lib/k8s/cluster.ts:465](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L465)

___

### timeoutSeconds

• `Optional` **timeoutSeconds**: `number`

#### Defined in

[lib/k8s/cluster.ts:469](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L469)
