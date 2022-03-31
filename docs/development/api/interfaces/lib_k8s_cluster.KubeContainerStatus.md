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

[lib/k8s/cluster.ts:418](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L418)

___

### image

• **image**: `string`

#### Defined in

[lib/k8s/cluster.ts:419](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L419)

___

### imageID

• **imageID**: `string`

#### Defined in

[lib/k8s/cluster.ts:420](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L420)

___

### lastState

• **lastState**: `string`

#### Defined in

[lib/k8s/cluster.ts:421](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L421)

___

### name

• **name**: `string`

#### Defined in

[lib/k8s/cluster.ts:422](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L422)

___

### ready

• **ready**: `boolean`

#### Defined in

[lib/k8s/cluster.ts:423](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L423)

___

### restartCount

• **restartCount**: `number`

#### Defined in

[lib/k8s/cluster.ts:424](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L424)

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

[lib/k8s/cluster.ts:425](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L425)
