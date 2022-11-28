---
title: "Module: plugin/registry"
linkTitle: "plugin/registry"
slug: "plugin_registry"
---

## Classes

- [Registry](../classes/plugin_registry.Registry.md)

## Interfaces

- [AppLogoProps](../interfaces/plugin_registry.AppLogoProps.md)
- [ClusterChooserProps](../interfaces/plugin_registry.ClusterChooserProps.md)
- [DetailsViewSectionProps](../interfaces/plugin_registry.DetailsViewSectionProps.md)
- [SectionFuncProps](../interfaces/plugin_registry.SectionFuncProps.md)
- [SidebarEntryProps](../interfaces/plugin_registry.SidebarEntryProps.md)

## Type aliases

### AppBarActionType

Ƭ **AppBarActionType**: `HeaderActionType`

#### Defined in

[plugin/registry.tsx:45](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/plugin/registry.tsx#L45)

___

### AppLogoType

Ƭ **AppLogoType**: `React.ComponentType`<[`AppLogoProps`](../interfaces/plugin_registry.AppLogoProps.md)\> \| `ReactElement` \| ``null``

#### Defined in

[components/Sidebar/AppLogo.tsx:16](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/components/Sidebar/AppLogo.tsx#L16)

___

### ClusterChooserType

Ƭ **ClusterChooserType**: `React.ComponentType`<[`ClusterChooserProps`](../interfaces/plugin_registry.ClusterChooserProps.md)\> \| `ReactElement` \| ``null``

#### Defined in

[components/cluster/ClusterChooser.tsx:10](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/components/cluster/ClusterChooser.tsx#L10)

___

### DetailsViewHeaderActionType

Ƭ **DetailsViewHeaderActionType**: `HeaderActionType`

#### Defined in

[plugin/registry.tsx:44](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/plugin/registry.tsx#L44)

___

### DetailsViewSectionType

Ƭ **DetailsViewSectionType**: `ComponentType`<[`DetailsViewSectionProps`](../interfaces/plugin_registry.DetailsViewSectionProps.md)\> \| `ReactElement` \| ``null``

#### Defined in

[components/DetailsViewSection/DetailsViewSection.tsx:9](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/components/DetailsViewSection/DetailsViewSection.tsx#L9)

___

### sectionFunc

Ƭ **sectionFunc**: (`resource`: [`KubeObject`](lib_k8s_cluster.md#kubeobject)) => [`SectionFuncProps`](../interfaces/plugin_registry.SectionFuncProps.md) \| ``null`` \| `undefined`

#### Type declaration

▸ (`resource`): [`SectionFuncProps`](../interfaces/plugin_registry.SectionFuncProps.md) \| ``null`` \| `undefined`

**`deprecated`** please used DetailsViewSectionType and registerDetailViewSection

##### Parameters

| Name | Type |
| :------ | :------ |
| `resource` | [`KubeObject`](lib_k8s_cluster.md#kubeobject) |

##### Returns

[`SectionFuncProps`](../interfaces/plugin_registry.SectionFuncProps.md) \| ``null`` \| `undefined`

#### Defined in

[plugin/registry.tsx:36](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/plugin/registry.tsx#L36)

## Functions

### registerAppBarAction

▸ **registerAppBarAction**(`headerAction`): `void`

Add a component into the app bar (at the top of the app).

**`example`**

```tsx
import { registerAppBarAction } from '@kinvolk/headlamp-plugin/lib';
import { Button } from '@material-ui/core';

function ConsoleLogger() {
  return (
    <Button
      onClick={() => {
        console.log('Hello from ConsoleLogger!')
      }}
    >
      Print Log
    </Button>
  );
}

registerAppBarAction(ConsoleLogger);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `headerAction` | `HeaderActionType` | The action (link) to put in the app bar. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:308](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/plugin/registry.tsx#L308)

___

### registerAppLogo

▸ **registerAppLogo**(`logo`): `void`

Add a logo for Headlamp to use instead of the default one.

**`example`**
```tsx
import { registerAppLogo } from '@kinvolk/headlamp-plugin/lib';

registerAppLogo(<p>my logo</p>)
```

More complete logo example in plugins/examples/change-logo:

**`see`** [Change Logo Example](http://github.com/kinvolk/headlamp/plugins/examples/change-logo/)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `logo` | [`AppLogoType`](plugin_registry.md#applogotype) | is a React Component that takes two required props `logoType` which is a constant string literal that accepts either of the two values `small` or `large` depending on whether the sidebar is in shrink or expanded state so that you can change your logo from small to large and the other optional prop is the `themeName` which is a string with two values 'light' and 'dark' base on which theme is selected. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:362](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/plugin/registry.tsx#L362)

___

### registerClusterChooser

▸ **registerClusterChooser**(`chooser`): `void`

Use a custom cluster chooser button

**`example`**
```tsx
import { ClusterChooserProps, registerClusterChooser } from '@kinvolk/headlamp-plugin/lib';

registerClusterChooser(({ clickHandler, cluster }: ClusterChooserProps) => {
  return <button onClick={clickHandler}>my chooser Current cluster: {cluster}</button>;
})
```

**`see`** [Cluster Chooser example](http://github.com/kinvolk/headlamp/plugins/examples/cluster-chooser/)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chooser` | [`ClusterChooserType`](plugin_registry.md#clusterchoosertype) | is a React Component that takes one required props ```clickHandler``` which is the action handler that happens when the custom chooser button component click event occurs |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:384](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/plugin/registry.tsx#L384)

___

### registerDetailsViewHeaderAction

▸ **registerDetailsViewHeaderAction**(`headerAction`): `void`

Add a component into the details view header.

**`example`**

```tsx
import { ActionButton } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { registerDetailsViewHeaderAction } from '@kinvolk/headlamp-plugin/lib';

function IconAction() {
  return (
    <ActionButton
     description="Launch"
     icon="mdi:comment-quote"
     onClick={() => console.log('Hello from IconAction!')}
   />
  )
}

registerDetailsViewHeaderAction(IconAction);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `headerAction` | `HeaderActionType` | The action (link) to put in the app bar. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:278](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/plugin/registry.tsx#L278)

___

### registerDetailsViewSection

▸ **registerDetailsViewSection**(`viewSection`): `void`

Append a component to the details view for a given resource.

**`example`**

```tsx
import {
  registerDetailsViewSection,
  DetailsViewSectionProps
} from '@kinvolk/headlamp-plugin/lib';

registerDetailsViewSection(({ resource }: DetailsViewSectionProps) => {
  if (resource.kind === 'Pod') {
    return (
      <SectionBox title="A very fine section title">
        The body of our Section for {resource.kind}
      </SectionBox>
    );
  }
  return null;
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `viewSection` | [`DetailsViewSectionType`](plugin_registry.md#detailsviewsectiontype) | The section to add on different view screens. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:337](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/plugin/registry.tsx#L337)

___

### registerRoute

▸ **registerRoute**(`routeSpec`): `void`

Add a Route for a component.

**`example`**

```tsx
import { registerRoute } from '@kinvolk/headlamp-plugin/lib';

// Add a route that will display the given component and select
// the "traces" sidebar item.
registerRoute({
  path: '/traces',
  sidebar: 'traces',
  component: () => <TraceList />
});
```

**`see`** [Route examples](https://github.com/kinvolk/headlamp/blob/main/frontend/src/lib/router.tsx)

**`see`** [Sidebar Example](http://github.com/kinvolk/headlamp/plugins/examples/sidebar/)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `routeSpec` | [`Route`](../interfaces/lib_router.Route.md) | details of URL, highlighted sidebar and component to use. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:250](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/plugin/registry.tsx#L250)

___

### registerRouteFilter

▸ **registerRouteFilter**(`filterFunc`): `void`

Remove routes.

**`example`**

```tsx
import { registerRouteFilter } from '@kinvolk/headlamp-plugin/lib';

registerRouteFilter(route => (route.path === '/workloads' ? null : route));
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filterFunc` | (`entry`: [`Route`](../interfaces/lib_router.Route.md)) => ``null`` \| [`Route`](../interfaces/lib_router.Route.md) | a function for filtering routes. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:223](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/plugin/registry.tsx#L223)

___

### registerSidebarEntry

▸ **registerSidebarEntry**(`__namedParameters`): `void`

Add a Sidebar Entry to the menu (on the left side of Headlamp).

**`example`**

```tsx
import { registerSidebarEntry } from '@kinvolk/headlamp-plugin/lib';
registerSidebarEntry({ parent: 'cluster', name: 'traces', label: 'Traces', url: '/traces' });

```

**`see`** [Sidebar Example](http://github.com/kinvolk/headlamp/plugins/examples/sidebar/)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`SidebarEntryProps`](../interfaces/plugin_registry.SidebarEntryProps.md) |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:171](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/plugin/registry.tsx#L171)

___

### registerSidebarEntryFilter

▸ **registerSidebarEntryFilter**(`filterFunc`): `void`

Remove sidebar menu items.

**`example`**

```tsx
import { registerSidebarEntryFilter } from '@kinvolk/headlamp-plugin/lib';

registerSidebarEntryFilter(entry => (entry.name === 'workloads' ? null : entry));
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filterFunc` | (`entry`: [`SidebarEntryProps`](../interfaces/plugin_registry.SidebarEntryProps.md)) => ``null`` \| [`SidebarEntryProps`](../interfaces/plugin_registry.SidebarEntryProps.md) | a function for filtering sidebar entries. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:204](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/plugin/registry.tsx#L204)
