---
title: "Interface: ContainerState"
linkTitle: "ContainerState"
slug: "lib_k8s_cluster.ContainerState"
---

[lib/k8s/cluster](../modules/lib_k8s_cluster.md).ContainerState

## Properties

### running

• **running**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `startedAt` | `string` |

#### Defined in

[lib/k8s/cluster.ts:599](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L599)

___

### terminated

• **terminated**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `containerID` | `string` |
| `exitCode` | `number` |
| `finishedAt` | `string` |
| `message?` | `string` |
| `reason` | `string` |
| `signal?` | `number` |
| `startedAt` | `string` |

#### Defined in

[lib/k8s/cluster.ts:602](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L602)

___

### waiting

• **waiting**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `reason` | `string` |

#### Defined in

[lib/k8s/cluster.ts:611](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L611)
