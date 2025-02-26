# Class: PluginManager

A wrapper class for initiating calls to Electron via desktopApi for managing plugins.

## Constructors

### new PluginManager()

```ts
new PluginManager(): PluginManager
```

#### Returns

[`PluginManager`](PluginManager.md)

## Methods

### cancel()

```ts
static cancel(identifier: string): Promise<void>
```

Sends a request to cancel the operation (install, update, uninstall) for a plugin with the specified identifier.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `identifier` | `string` | The unique identifier for the plugin. |

#### Returns

`Promise`\<`void`\>

#### Static

#### Async

#### Example

```ts
PluginManager.cancel('pluginID');
```

#### Defined in

[frontend/src/components/App/pluginManager.ts:130](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/App/pluginManager.ts#L130)

***

### getStatus()

```ts
static getStatus(identifier: string): Promise<ProgressResp>
```

Sends a request to get the status of a plugin with the specified identifier.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `identifier` | `string` | The unique identifier for the plugin. |

#### Returns

`Promise`\<`ProgressResp`\>

- A promise that resolves with the status of the plugin, or rejects with an error if the message limit or timeout is exceeded.

#### Static

#### Async

#### Example

```ts
try {
  const status = await PluginManager.getStatus('pluginID');
  console.log('Plugin status:', status);
} catch (error) {
  console.error('Error:', error.message);
}
```

#### Defined in

[frontend/src/components/App/pluginManager.ts:186](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/App/pluginManager.ts#L186)

***

### install()

```ts
static install(
   identifier: string, 
   name: string, 
   URL: string): void
```

Sends a request to install a plugin from the specified ArtifactHub URL.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `identifier` | `string` | The unique identifier for the plugin. |
| `name` | `string` | The name of the plugin to be installed. |
| `URL` | `string` | The URL from where the plugin will be installed. |

#### Returns

`void`

#### Static

#### Example

```ts
PluginManager.install('pluginID', ' https://artifacthub.io/packages/headlamp/<repo_name>/<plugin_name>');
```

#### Defined in

[frontend/src/components/App/pluginManager.ts:69](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/App/pluginManager.ts#L69)

***

### list()

```ts
static list(): Promise<undefined | Record<string, any>>
```

Sends a request to list all installed plugins.

#### Returns

`Promise`\<`undefined` \| `Record`\<`string`, `any`\>\>

- A promise that resolves with a record of all installed plugins, or undefined if there was an error.

#### Throws

- Throws an error if the response type is 'error'.

#### Static

#### Async

#### Example

```ts
try {
  const plugins = await PluginManager.list();
  console.log('Installed plugins:', plugins);
} catch (error) {
  console.error('Error:', error.message);
}
```

#### Defined in

[frontend/src/components/App/pluginManager.ts:155](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/App/pluginManager.ts#L155)

***

### uninstall()

```ts
static uninstall(identifier: string, name: string): void
```

Sends a request to uninstall a plugin with the specified identifier and name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `identifier` | `string` | The unique identifier for the plugin. |
| `name` | `string` | The name of the plugin to be uninstalled. |

#### Returns

`void`

#### Static

#### Example

```ts
PluginManager.uninstall('pluginID', 'my-plugin');
```

#### Defined in

[frontend/src/components/App/pluginManager.ts:110](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/App/pluginManager.ts#L110)

***

### update()

```ts
static update(identifier: string, name: string): void
```

Sends a request to update a plugin with the specified identifier and name.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `identifier` | `string` | The unique identifier for the plugin. |
| `name` | `string` | The name of the plugin to be updated. |

#### Returns

`void`

#### Static

#### Example

```ts
PluginManager.update('pluginID', 'my-plugin');
```

#### Defined in

[frontend/src/components/App/pluginManager.ts:90](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/App/pluginManager.ts#L90)
