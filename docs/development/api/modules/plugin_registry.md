---
title: "Module: plugin/registry"
linkTitle: "plugin/registry"
slug: "plugin_registry"
---

## Enumerations

- [DefaultAppBarAction](../enums/plugin_registry.DefaultAppBarAction.md)
- [DefaultSidebars](../enums/plugin_registry.DefaultSidebars.md)

## Classes

- [Registry](../classes/plugin_registry.Registry.md)

## Interfaces

- [AppLogoProps](../interfaces/plugin_registry.AppLogoProps.md)
- [ClusterChooserProps](../interfaces/plugin_registry.ClusterChooserProps.md)
- [DetailsViewSectionProps](../interfaces/plugin_registry.DetailsViewSectionProps.md)
- [SectionFuncProps](../interfaces/plugin_registry.SectionFuncProps.md)
- [SidebarEntryProps](../interfaces/plugin_registry.SidebarEntryProps.md)

## Type aliases

### AppBarActionProcessorType

Ƭ **AppBarActionProcessorType**: (`info`: `AppBarActionsProcessorArgs`) => `AppBarAction`[]

#### Type declaration

▸ (`info`): `AppBarAction`[]

##### Parameters

| Name | Type |
| :------ | :------ |
| `info` | `AppBarActionsProcessorArgs` |

##### Returns

`AppBarAction`[]

#### Defined in

[redux/actionButtonsSlice.ts:57](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/redux/actionButtonsSlice.ts#L57)

___

### AppLogoType

Ƭ **AppLogoType**: `React.ComponentType`<[`AppLogoProps`](../interfaces/plugin_registry.AppLogoProps.md)\> \| `ReactElement` \| typeof `React.Component` \| ``null``

#### Defined in

[components/App/AppLogo.tsx:20](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/components/App/AppLogo.tsx#L20)

___

### ClusterChooserType

Ƭ **ClusterChooserType**: `React.ComponentType`<[`ClusterChooserProps`](../interfaces/plugin_registry.ClusterChooserProps.md)\> \| `ReactElement` \| ``null``

#### Defined in

[components/cluster/ClusterChooser.tsx:10](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/components/cluster/ClusterChooser.tsx#L10)

___

### DetailsViewHeaderActionType

Ƭ **DetailsViewHeaderActionType**: `HeaderActionType`

#### Defined in

[plugin/registry.tsx:61](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L61)

___

### DetailsViewHeaderActionsProcessor

Ƭ **DetailsViewHeaderActionsProcessor**: `HeaderActionsProcessor`

#### Defined in

[plugin/registry.tsx:62](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L62)

___

### DetailsViewSectionType

Ƭ **DetailsViewSectionType**: `ComponentType`<[`DetailsViewSectionProps`](../interfaces/plugin_registry.DetailsViewSectionProps.md)\> \| `ReactElement` \| ``null``

#### Defined in

[components/DetailsViewSection/DetailsViewSection.tsx:9](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/components/DetailsViewSection/DetailsViewSection.tsx#L9)

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

[plugin/registry.tsx:53](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L53)

## Variables

### DetailsViewDefaultHeaderActions

• **DetailsViewDefaultHeaderActions**: typeof `DefaultHeaderAction` = `DefaultHeaderAction`

#### Defined in

[plugin/registry.tsx:48](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L48)

## Functions

### getHeadlampAPIHeaders

▸ **getHeadlampAPIHeaders**(): `Object`

Returns headers for making API calls to the headlamp-server backend.

#### Returns

`Object`

#### Defined in

[helpers/index.ts:250](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/helpers/index.ts#L250)

___

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
| `headerAction` | `AppBarAction` \| `AppBarActionsProcessor` \| [`AppBarActionProcessorType`](plugin_registry.md#appbaractionprocessortype) \| `AppBarActionType` | The action (link) to put in the app bar. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:393](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L393)

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

[plugin/registry.tsx:452](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L452)

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

[plugin/registry.tsx:474](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L474)

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

[plugin/registry.tsx:297](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L297)

___

### registerDetailsViewHeaderActionsProcessor

▸ **registerDetailsViewHeaderActionsProcessor**(`processor`): `void`

Add a processor for the details view header actions. Allowing the modification of header actions.

**`example`**

```tsx
import { registerDetailsViewHeaderActionsProcessor, DetailsViewDefaultHeaderActions } from '@kinvolk/headlamp-plugin/lib';

// Processor that removes the default edit action.
registerDetailsViewHeaderActionsProcessor((resource, headerActions) => {
 return headerActions.filter(action => action.name !== DetailsViewDefaultHeaderActions.EDIT);
});

More complete detail view example in plugins/examples/details-view:
@see [Detail View Example](http://github.com/kinvolk/headlamp/plugins/examples/details-view/)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `processor` | `HeaderActionsProcessor` \| `HeaderActionFuncType` | The processor to add. Receives a resource (for which we are processing the header actions) and the current header actions and returns the new header actions. Return an empty array to remove all header actions. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:320](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L320)

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

[plugin/registry.tsx:427](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L427)

___

### registerGetTokenFunction

▸ **registerGetTokenFunction**(`override`): `void`

Override headlamp getToken method

**`example`**
```ts
registerGetTokenFunction(() => {
// set token logic here
});

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `override` | (`cluster`: `string`) => `undefined` \| `string` | The getToken override method to use. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:504](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L504)

___

### registerResourceTableColumnsProcessor

▸ **registerResourceTableColumnsProcessor**(`processor`): `void`

Add a processor for the resource table columns. Allowing the modification of what tables show.

**`example`**

```tsx
import { registerResourceTableColumnsProcessor } from '@kinvolk/headlamp-plugin/lib';

// Processor that adds a column to show how many init containers pods have (in the default pods' list table).
registerResourceTableColumnsProcessor(function ageRemover({ id, columns }) {
  if (id === 'headlamp-pods') {
    columns.push({
      label: 'Init Containers',
      getter: (pod: Pod) => {
        return pod.spec.initContainers.length;
      },
    });
  }

  return columns;
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `processor` | `TableColumnsProcessor` \| (`args`: { `columns`: (`SimpleTableGetterColumn` \| `SimpleTableDatumColumn` \| `ColumnType`)[] ; `id`: `string`  }) => (`SimpleTableGetterColumn` \| `SimpleTableDatumColumn` \| `ColumnType`)[] | The processor ID and function. See #TableColumnsProcessor. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:351](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L351)

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

[plugin/registry.tsx:269](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L269)

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

[plugin/registry.tsx:242](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L242)

___

### registerSetTokenFunction

▸ **registerSetTokenFunction**(`override`): `void`

Override headlamp setToken method

**`example`**
```ts
registerSetTokenFunction((cluster: string, token: string | null) => {
// set token logic here
});

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `override` | (`cluster`: `string`, `token`: ``null`` \| `string`) => `void` | The setToken override method to use. |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:488](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L488)

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

[plugin/registry.tsx:188](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L188)

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

[plugin/registry.tsx:223](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/plugin/registry.tsx#L223)
