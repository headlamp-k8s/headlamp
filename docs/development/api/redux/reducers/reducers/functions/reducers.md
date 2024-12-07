# Function: reducers()

```ts
function reducers(state: undefined | {
  actionButtons: HeaderActionState;
  clusterAction: ClusterState;
  config: ConfigState;
  detailsViewSection: DetailsViewSectionState;
  detailsViewSections: DetailsViewSectionState;
  eventCallbackReducer: {
     trackerFuncs: HeadlampEventCallback[];
    };
  filter: FilterState;
  notifications: NotificationsState;
  pluginConfigs: PluginConfigState;
  plugins: PluginsState;
  resourceTable: ResourceTableState;
  routes: RoutesState;
  sidebar: SidebarState;
  theme: ThemeState;
  ui: UIState;
 } | Partial<object>, action: UnknownAction | Action): object
```

## Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | `undefined` \| \{ `actionButtons`: `HeaderActionState`; `clusterAction`: `ClusterState`; `config`: `ConfigState`; `detailsViewSection`: `DetailsViewSectionState`; `detailsViewSections`: `DetailsViewSectionState`; `eventCallbackReducer`: \{ `trackerFuncs`: [`HeadlampEventCallback`](../../../../plugin/registry/type-aliases/HeadlampEventCallback.md)[]; \}; `filter`: `FilterState`; `notifications`: `NotificationsState`; `pluginConfigs`: `PluginConfigState`; `plugins`: `PluginsState`; `resourceTable`: `ResourceTableState`; `routes`: `RoutesState`; `sidebar`: `SidebarState`; `theme`: `ThemeState`; `ui`: `UIState`; \} \| `Partial`\<`object`\> |
| `action` | `UnknownAction` \| `Action` |

## Returns

`object`

### actionButtons

```ts
actionButtons: HeaderActionState;
```

### clusterAction

```ts
clusterAction: ClusterState;
```

### config

```ts
config: ConfigState = configReducer;
```

### detailsViewSection

```ts
detailsViewSection: DetailsViewSectionState = detailsViewSectionReducer;
```

### detailsViewSections

```ts
detailsViewSections: DetailsViewSectionState = detailsViewSectionReducer;
```

### eventCallbackReducer

```ts
eventCallbackReducer: object;
```

#### eventCallbackReducer.trackerFuncs

```ts
trackerFuncs: HeadlampEventCallback[];
```

### filter

```ts
filter: FilterState = filterReducer;
```

### notifications

```ts
notifications: NotificationsState = notificationsReducer;
```

### pluginConfigs

```ts
pluginConfigs: PluginConfigState = pluginConfigReducer;
```

### plugins

```ts
plugins: PluginsState = pluginsReducer;
```

### resourceTable

```ts
resourceTable: ResourceTableState = resourceTableReducer;
```

### routes

```ts
routes: RoutesState = routesReducer;
```

### sidebar

```ts
sidebar: SidebarState = sidebarReducer;
```

### theme

```ts
theme: ThemeState = themeReducer;
```

### ui

```ts
ui: UIState = uiReducer;
```

## Defined in

[frontend/src/redux/reducers/reducers.tsx:18](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/reducers/reducers.tsx#L18)
