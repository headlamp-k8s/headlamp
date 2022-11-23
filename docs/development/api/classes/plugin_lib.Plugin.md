---
title: "Class: Plugin"
linkTitle: "Plugin"
slug: "plugin_lib.Plugin"
---

[plugin/lib](../modules/plugin_lib.md).Plugin

Plugins may call Headlamp.registerPlugin(pluginId: string, pluginObj: Plugin) to register themselves.

They will have their initialize(register) method called at plugin initialization time.

## Constructors

### constructor

• **new Plugin**()

## Methods

### initialize

▸ `Abstract` **initialize**(`register`): `boolean`

initialize is called for each plugin with a Registry which gives the plugin methods for doing things.

**`see`** Registry

#### Parameters

| Name | Type |
| :------ | :------ |
| `register` | [`Registry`](plugin_registry.Registry.md) |

#### Returns

`boolean`

#### Defined in

[plugin/lib.ts:47](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/plugin/lib.ts#L47)
