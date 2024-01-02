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

[lib/k8s/cluster.ts:1190](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L1190)

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

[lib/k8s/cluster.ts:1193](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L1193)

___

### waiting

• **waiting**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `reason` | `string` |

#### Defined in

[lib/k8s/cluster.ts:1202](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L1202)
