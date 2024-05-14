---
title: "Interface: TerminalEvent"
linkTitle: "TerminalEvent"
slug: "plugin_registry.TerminalEvent"
---

[plugin/registry](../modules/plugin_registry.md).TerminalEvent

Event fired when using the terminal.

## Properties

### data

• **data**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `resource?` | `any` | The resource for which the terminal was opened (currently this only happens for Pod instances). |
| `status` | `OPENED` \| `CLOSED` | What exactly this event represents. 'OPEN' when the terminal is opened. 'CLOSED' when it is closed. |

#### Defined in

[redux/headlampEventSlice.ts:163](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L163)

___

### type

• **type**: `TERMINAL`

#### Defined in

[redux/headlampEventSlice.ts:162](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L162)
