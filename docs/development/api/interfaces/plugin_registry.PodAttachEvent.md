---
title: "Interface: PodAttachEvent"
linkTitle: "PodAttachEvent"
slug: "plugin_registry.PodAttachEvent"
---

[plugin/registry](../modules/plugin_registry.md).PodAttachEvent

Event fired when attaching to a pod.

## Properties

### data

• **data**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `resource?` | [`Pod`](../classes/lib_k8s_pod.Pod.md) | The resource for which the terminal was opened (currently this only happens for Pod instances). |
| `status` | `OPENED` \| `CLOSED` | What exactly this event represents. 'OPEN' when the attach dialog is opened. 'CLOSED' when it is closed. |

#### Defined in

[redux/headlampEventSlice.ts:178](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L178)

___

### type

• **type**: `POD_ATTACH`

#### Defined in

[redux/headlampEventSlice.ts:177](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L177)
