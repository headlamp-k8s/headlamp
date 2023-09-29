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

[lib/k8s/cluster.ts:611](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L611)

___

### failureThreshold

• `Optional` **failureThreshold**: `number`

#### Defined in

[lib/k8s/cluster.ts:621](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L621)

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

[lib/k8s/cluster.ts:605](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L605)

___

### initialDelaySeconds

• `Optional` **initialDelaySeconds**: `number`

#### Defined in

[lib/k8s/cluster.ts:617](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L617)

___

### periodSeconds

• `Optional` **periodSeconds**: `number`

#### Defined in

[lib/k8s/cluster.ts:619](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L619)

___

### successThreshold

• `Optional` **successThreshold**: `number`

#### Defined in

[lib/k8s/cluster.ts:620](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L620)

___

### tcpSocket

• `Optional` **tcpSocket**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `port` | `number` |

#### Defined in

[lib/k8s/cluster.ts:614](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L614)

___

### timeoutSeconds

• `Optional` **timeoutSeconds**: `number`

#### Defined in

[lib/k8s/cluster.ts:618](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L618)
