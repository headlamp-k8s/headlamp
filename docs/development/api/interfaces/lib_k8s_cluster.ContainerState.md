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

[lib/k8s/cluster.ts:650](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L650)

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

[lib/k8s/cluster.ts:653](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L653)

___

### waiting

• **waiting**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `reason` | `string` |

#### Defined in

[lib/k8s/cluster.ts:662](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L662)
