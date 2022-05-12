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

[lib/k8s/cluster.ts:479](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L479)

___

### image

• **image**: `string`

#### Defined in

[lib/k8s/cluster.ts:480](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L480)

___

### imageID

• **imageID**: `string`

#### Defined in

[lib/k8s/cluster.ts:481](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L481)

___

### lastState

• **lastState**: `string`

#### Defined in

[lib/k8s/cluster.ts:482](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L482)

___

### name

• **name**: `string`

#### Defined in

[lib/k8s/cluster.ts:483](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L483)

___

### ready

• **ready**: `boolean`

#### Defined in

[lib/k8s/cluster.ts:484](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L484)

___

### restartCount

• **restartCount**: `number`

#### Defined in

[lib/k8s/cluster.ts:485](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L485)

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

[lib/k8s/cluster.ts:486](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L486)
