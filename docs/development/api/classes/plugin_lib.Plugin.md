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

▸ `Abstract` **initialize**(`register`): `boolean` \| `void`

initialize is called for each plugin with a Registry which gives the plugin methods for doing things.

**`see`** Registry

#### Parameters

| Name | Type |
| :------ | :------ |
| `register` | [`Registry`](plugin_registry.Registry.md) |

#### Returns

`boolean` \| `void`

The return code is not used, but used to be required.

#### Defined in

[plugin/lib.ts:49](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/plugin/lib.ts#L49)
