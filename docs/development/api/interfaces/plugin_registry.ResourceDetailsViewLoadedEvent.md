---
title: "Interface: ResourceDetailsViewLoadedEvent"
linkTitle: "ResourceDetailsViewLoadedEvent"
slug: "plugin_registry.ResourceDetailsViewLoadedEvent"
---

[plugin/registry](../modules/plugin_registry.md).ResourceDetailsViewLoadedEvent

Event fired when a resource is loaded in the details view.

## Properties

### data

• **data**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `error?` | `Error` | The error, if an error has occurred |
| `resource` | `any` | The resource that was loaded. |

#### Defined in

[redux/headlampEventSlice.ts:242](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L242)

___

### type

• **type**: `DETAILS_VIEW`

#### Defined in

[redux/headlampEventSlice.ts:241](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L241)
