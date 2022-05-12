---
title: "Class: Registry"
linkTitle: "Registry"
slug: "plugin_registry.Registry"
---

[plugin/registry](../modules/plugin_registry.md).Registry

## Constructors

### constructor

• **new Registry**()

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

[plugin/registry.tsx:117](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/plugin/registry.tsx#L117)

___

### registerAppLogo

▸ **registerAppLogo**(`component`): `void`

**`example`**
```JSX
register.registerAppLogo((props: { logoType: 'small' | 'large', themeName: string}) => <MY_CUSTOM_COMPONENT logoType={logoType}/>)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `component` | ``null`` \| `ComponentType`<{ `[key: string]`: `any`; `logoType`: ``"small"`` \| ``"large"`` ; `themeName`: `string`  }\> | is a React Component that takes two required props ```JSX logoType``` which is a constant string literal that accepts either of the two values ```JSX small``` or ```JSX large``` depending on whether the sidebar is in shrink or expaned state so that you can change your logo from small to large and the other optional prop is the ```JSX themeName``` which is a string with two values 'light' and 'dark' base on which theme is selected. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:148](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/plugin/registry.tsx#L148)

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

[plugin/registry.tsx:98](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/plugin/registry.tsx#L98)

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

[plugin/registry.tsx:133](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/plugin/registry.tsx#L133)

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
| `routeSpec` | [`Route`](../interfaces/lib_router.Route.md) | details of URL, highlighted sidebar and component to use. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:79](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/plugin/registry.tsx#L79)

___

### registerSidebarItem

▸ **registerSidebarItem**(`parentName`, `itemName`, `itemLabel`, `url`, `opts?`): `void`

Add a SidebarItem.

**`example`**

```javascript
registerSidebarItem('cluster', 'traces', 'Traces', '/traces');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentName` | `string` | the name of the parent SidebarItem. |
| `itemName` | `string` | name of this SidebarItem. |
| `itemLabel` | `string` | label to display. |
| `url` | `string` | the URL to go to, when this item is followed. |
| `opts` | `Pick`<`SidebarEntry`, ``"useClusterURL"`` \| ``"icon"``\> | may have `useClusterURL` (default=true) which indicates whether the URL should have the cluster prefix or not; and `icon` (an iconify string or icon object) that will be used for the sidebar's icon. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:40](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/plugin/registry.tsx#L40)
