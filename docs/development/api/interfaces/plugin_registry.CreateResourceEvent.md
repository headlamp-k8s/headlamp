---
title: "Interface: CreateResourceEvent"
linkTitle: "CreateResourceEvent"
slug: "plugin_registry.CreateResourceEvent"
---

[plugin/registry](../modules/plugin_registry.md).CreateResourceEvent

Event fired when creating a resource.

## Properties

### data

• **data**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `status` | `CONFIRMED` | What exactly this event represents. 'CONFIRMED' when the user chooses to apply the new resource. For now only 'CONFIRMED' is sent. |

#### Defined in

[redux/headlampEventSlice.ts:193](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L193)

___

### type

• **type**: `CREATE_RESOURCE`

#### Defined in

[redux/headlampEventSlice.ts:192](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L192)
