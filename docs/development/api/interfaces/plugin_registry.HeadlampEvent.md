---
title: "Interface: HeadlampEvent<EventType>"
linkTitle: "HeadlampEvent"
slug: "plugin_registry.HeadlampEvent"
---

[plugin/registry](../modules/plugin_registry.md).HeadlampEvent

Represents a Headlamp event. It can be one of the default events or a custom event.

## Type parameters

| Name | Type |
| :------ | :------ |
| `EventType` | `HeadlampEventType` \| `string` |

## Hierarchy

- **`HeadlampEvent`**

  ↳ [`DeleteResourceEvent`](plugin_registry.DeleteResourceEvent.md)

## Properties

### data

• `Optional` **data**: `unknown`

#### Defined in

[redux/headlampEventSlice.ts:69](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L69)

___

### type

• **type**: `EventType`

#### Defined in

[redux/headlampEventSlice.ts:68](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L68)
