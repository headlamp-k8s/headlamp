---
title: "Interface: PluginLoadingErrorEvent"
linkTitle: "PluginLoadingErrorEvent"
slug: "plugin_registry.PluginLoadingErrorEvent"
---

[plugin/registry](../modules/plugin_registry.md).PluginLoadingErrorEvent

Event fired when there is an error while loading a plugin.

## Properties

### data

• **data**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | `Error` | The error that occurred while loading the plugin. |
| `pluginInfo` | { `name`: `string` ; `version`: `string`  } | Information about the plugin. |
| `pluginInfo.name` | `string` | The name of the plugin. |
| `pluginInfo.version` | `string` | The version of the plugin. |

#### Defined in

[redux/headlampEventSlice.ts:206](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L206)

___

### type

• **type**: `PLUGIN_LOADING_ERROR`

#### Defined in

[redux/headlampEventSlice.ts:205](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/redux/headlampEventSlice.ts#L205)
