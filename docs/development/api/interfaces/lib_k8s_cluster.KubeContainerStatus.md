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

[lib/k8s/cluster.ts:501](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L501)

___

### image

• **image**: `string`

#### Defined in

[lib/k8s/cluster.ts:502](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L502)

___

### imageID

• **imageID**: `string`

#### Defined in

[lib/k8s/cluster.ts:503](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L503)

___

### lastState

• **lastState**: `string`

#### Defined in

[lib/k8s/cluster.ts:504](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L504)

___

### name

• **name**: `string`

#### Defined in

[lib/k8s/cluster.ts:505](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L505)

___

### ready

• **ready**: `boolean`

#### Defined in

[lib/k8s/cluster.ts:506](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L506)

___

### restartCount

• **restartCount**: `number`

#### Defined in

[lib/k8s/cluster.ts:507](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L507)

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

[lib/k8s/cluster.ts:508](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L508)
