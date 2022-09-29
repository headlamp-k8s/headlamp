---
title: "Interface: KubeContainerStatus"
linkTitle: "KubeContainerStatus"
slug: "lib_k8s_cluster.KubeContainerStatus"
---

[lib/k8s/cluster](../modules/lib_k8s_cluster.md).KubeContainerStatus

## Properties

### containerID

• **containerID**: `string`

#### Defined in

[lib/k8s/cluster.ts:520](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L520)

___

### image

• **image**: `string`

#### Defined in

[lib/k8s/cluster.ts:521](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L521)

___

### imageID

• **imageID**: `string`

#### Defined in

[lib/k8s/cluster.ts:522](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L522)

___

### lastState

• **lastState**: `string`

#### Defined in

[lib/k8s/cluster.ts:523](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L523)

___

### name

• **name**: `string`

#### Defined in

[lib/k8s/cluster.ts:524](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L524)

___

### ready

• **ready**: `boolean`

#### Defined in

[lib/k8s/cluster.ts:525](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L525)

___

### restartCount

• **restartCount**: `number`

#### Defined in

[lib/k8s/cluster.ts:526](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L526)

___

### state

• **state**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `running` | { `startedAt`: `number`  } |
| `running.startedAt` | `number` |
| `terminated` | { `containerID`: `string` ; `exitCode`: `number` ; `finishedAt`: `number` ; `message`: `string` ; `reason`: `string` ; `signal`: `number` ; `startedAt`: `number`  } |
| `terminated.containerID` | `string` |
| `terminated.exitCode` | `number` |
| `terminated.finishedAt` | `number` |
| `terminated.message` | `string` |
| `terminated.reason` | `string` |
| `terminated.signal` | `number` |
| `terminated.startedAt` | `number` |
| `waiting` | { `message`: `string` ; `reason`: `string`  } |
| `waiting.message` | `string` |
| `waiting.reason` | `string` |

#### Defined in

[lib/k8s/cluster.ts:527](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L527)
