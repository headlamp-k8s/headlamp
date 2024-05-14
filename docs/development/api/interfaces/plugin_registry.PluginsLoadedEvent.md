---
title: "Interface: PluginsLoadedEvent"
linkTitle: "PluginsLoadedEvent"
slug: "plugin_registry.PluginsLoadedEvent"
---

[plugin/registry](../modules/plugin_registry.md).PluginsLoadedEvent

Event fired when all plugins are loaded.

## Properties

### data

• **data**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `plugins` | { `isEnabled`: `boolean` ; `name`: `string` ; `version`: `string`  }[] | The list of loaded plugins. |

#### Defined in

[redux/headlampEventSlice.ts:224](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L224)

___

### type

• **type**: `PLUGINS_LOADED`

#### Defined in

[redux/headlampEventSlice.ts:223](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L223)
