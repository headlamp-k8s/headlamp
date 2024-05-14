---
title: "Interface: EventListEvent"
linkTitle: "EventListEvent"
slug: "plugin_registry.EventListEvent"
---

[plugin/registry](../modules/plugin_registry.md).EventListEvent

Event fired when kubernetes events are loaded (for a resource or not).

## Properties

### data

• **data**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `events` | [`Event`](../classes/lib_k8s_event.Event.md)[] | The list of events that were loaded. |
| `resource?` | `any` | The resource for which the events were loaded. |

#### Defined in

[redux/headlampEventSlice.ts:270](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L270)

___

### type

• **type**: `OBJECT_EVENTS`

#### Defined in

[redux/headlampEventSlice.ts:269](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L269)
