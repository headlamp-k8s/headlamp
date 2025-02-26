# Class: `abstract` Plugin

Plugins may call Headlamp.registerPlugin(pluginId: string, pluginObj: Plugin) to register themselves.

They will have their initialize(register) method called at plugin initialization time.

## Constructors

### new Plugin()

```ts
new Plugin(): Plugin
```

#### Returns

[`Plugin`](Plugin.md)

## Methods

### initialize()

```ts
abstract initialize(register: Registry): boolean | void
```

initialize is called for each plugin with a Registry which gives the plugin methods for doing things.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `register` | [`Registry`](../../registry/classes/Registry.md) |

#### Returns

`boolean` \| `void`

The return code is not used, but used to be required.

#### See

Registry

#### Defined in

[frontend/src/plugin/lib.ts:49](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/lib.ts#L49)
