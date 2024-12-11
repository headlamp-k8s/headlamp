# Interface: PluginLoadingErrorEvent

Event fired when there is an error while loading a plugin.

## Properties

### data

```ts
data: object;
```

#### error

```ts
error: Error;
```

The error that occurred while loading the plugin.

#### pluginInfo

```ts
pluginInfo: object;
```

Information about the plugin.

##### pluginInfo.name

```ts
name: string;
```

The name of the plugin.

##### pluginInfo.version

```ts
version: string;
```

The version of the plugin.

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:206](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L206)

***

### type

```ts
type: PLUGIN_LOADING_ERROR;
```

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:205](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L205)
