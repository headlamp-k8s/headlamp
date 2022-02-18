---
title: "Class: default"
linkTitle: "default"
slug: "plugin_registry.default"
---

[plugin/registry](../modules/plugin_registry.md).default

## Constructors

### constructor

• **new default**()

## Methods

### registerAppBarAction

▸ **registerAppBarAction**(`actionName`, `actionFunc`): `void`

Add a component into the app bar (at the top of the app).

**`example`**

```JSX
register.registerAppBarAction('monitor', () => <MonitorLink /> );
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `actionName` | `string` | a unique name for it |
| `actionFunc` | (...`args`: `any`[]) => ``null`` \| `Element` | a function that returns your component |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:110](https://github.com/kinvolk/headlamp/blob/ab45ff9/frontend/src/plugin/registry.tsx#L110)

___

### registerDetailsViewHeaderAction

▸ **registerDetailsViewHeaderAction**(`actionName`, `actionFunc`): `void`

Add a component into the details view header.

**`example`**

```JSX
register.registerDetailsViewHeaderAction('traces', (props) =>
  <TraceIcon {...props} />
);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `actionName` | `string` | a unique name for it |
| `actionFunc` | (...`args`: `any`[]) => ``null`` \| `Element` | a function that returns your component                     with props to pass into it. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:91](https://github.com/kinvolk/headlamp/blob/ab45ff9/frontend/src/plugin/registry.tsx#L91)

___

### registerDetailsViewSection

▸ **registerDetailsViewSection**(`sectionName`, `sectionFunc`): `void`

Append the specified title and component to the details view.

**`example`**

```JSX
register.registerDetailsViewSection("biolatency", (resource: KubeObject) => { title: 'Block I/O Latency', component: (props) => <BioLatency {...props} resource={resource}/>});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sectionName` | `string` | a unique name for it |
| `sectionFunc` | [`sectionFunc`](../modules/plugin_registry.md#sectionfunc) | a function that returns your detail view component with props                      passed into it and the section title |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:126](https://github.com/kinvolk/headlamp/blob/ab45ff9/frontend/src/plugin/registry.tsx#L126)

___

### registerRoute

▸ **registerRoute**(`routeSpec`): `void`

Add a Route for a component.

**`see`** [Route examples](https://github.com/kinvolk/headlamp/blob/main/frontend/src/lib/router.tsx)

**`example`**

```JSX
// Add a route that will display the given component and select
// the "traces" sidebar item.
register.registerRoute({
  path: '/traces',
  sidebar: 'traces',
  component: () => <TraceList />
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `routeSpec` | `Route` | details of URL, highlighted sidebar and component to use. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:72](https://github.com/kinvolk/headlamp/blob/ab45ff9/frontend/src/plugin/registry.tsx#L72)

___

### registerSidebarItem

▸ **registerSidebarItem**(`parentName`, `itemName`, `itemLabel`, `url`, `opts?`): `void`

Add a SidebarItem.

**`example`**

```javascript
registerSidebarItem('cluster', 'traces', 'Traces', '/traces');
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `parentName` | `string` | `undefined` | the name of the parent SidebarItem. |
| `itemName` | `string` | `undefined` | name of this SidebarItem. |
| `itemLabel` | `string` | `undefined` | label to display. |
| `url` | `string` | `undefined` | the URL to go to, when this item is followed. |
| `opts` | `Object` | `undefined` | ... todo |
| `opts.useClusterURL` | `boolean` | `true` | - |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:35](https://github.com/kinvolk/headlamp/blob/ab45ff9/frontend/src/plugin/registry.tsx#L35)
