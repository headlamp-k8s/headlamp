---
title: "Class: Headlamp"
linkTitle: "Headlamp"
slug: "plugin_lib.Headlamp"
---

[plugin/lib](../modules/plugin_lib.md).Headlamp

This class is a more convenient way for plugins to call registerPlugin in order to register
themselves.

## Constructors

### constructor

• **new Headlamp**()

## Methods

### registerPlugin

▸ `Static` **registerPlugin**(`pluginId`, `pluginObj`): `void`

Got a new plugin to add? Well, registerPlugin is your friend.

**`example`**

```javascript
const myPlugin = {
  initialize: (register) => {
    // do some stuff with register
    // use some libraries in window.pluginLib
    return true;
  }
}

Headlamp.registerPlugin("aPluginIdString", myPlugin)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pluginId` | `string` | a unique id string for your plugin. |
| `pluginObj` | [`Plugin`](plugin_lib.Plugin.md) | the plugin being added. |

#### Returns

`void`

#### Defined in

[plugin/lib.ts:134](https://github.com/kinvolk/headlamp/blob/d0c9391/frontend/src/plugin/lib.ts#L134)
