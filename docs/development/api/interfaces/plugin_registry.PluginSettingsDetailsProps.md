---
title: "Interface: PluginSettingsDetailsProps"
linkTitle: "PluginSettingsDetailsProps"
slug: "plugin_registry.PluginSettingsDetailsProps"
---

[plugin/registry](../modules/plugin_registry.md).PluginSettingsDetailsProps

Props for PluginSettingsDetailsProps component.

## Properties

### data

• `Optional` `Readonly` **data**: `Object`

Data object representing the current state/configuration.
readonly - The data object is readonly and cannot be modified.

#### Index signature

▪ [key: `string`]: `any`

#### Defined in

[plugin/pluginsSlice.ts:18](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/plugin/pluginsSlice.ts#L18)

## Methods

### onDataChange

▸ `Optional` **onDataChange**(`data`): `void`

Callback function to be triggered when there's a change in data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Object` | The updated data object. |

#### Returns

`void`

#### Defined in

[plugin/pluginsSlice.ts:12](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/plugin/pluginsSlice.ts#L12)
