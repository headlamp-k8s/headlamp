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

**`deprecated`** Registry.registerAppBarAction is deprecated. Please use registerAppBarAction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `actionName` | `string` |
| `actionFunc` | (...`args`: `any`[]) => ``null`` \| `Element` |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:163](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/plugin/registry.tsx#L163)

___

### registerAppLogo

▸ **registerAppLogo**(`logo`): `void`

**`deprecated`** Registry.registerAppLogo is deprecated. Please use registerAppLogo.

#### Parameters

| Name | Type |
| :------ | :------ |
| `logo` | [`AppLogoType`](../modules/plugin_registry.md#applogotype) |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:212](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/plugin/registry.tsx#L212)

___

### registerClusterChooserComponent

▸ **registerClusterChooserComponent**(`component`): `void`

**`deprecated`** Registry.registerClusterChooserComponent is deprecated. Please use registerClusterChooser.

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | ``null`` \| `ComponentType`<[`ClusterChooserProps`](../interfaces/plugin_registry.ClusterChooserProps.md)\> |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:220](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/plugin/registry.tsx#L220)

___

### registerDetailsViewHeaderAction

▸ **registerDetailsViewHeaderAction**(`actionName`, `actionFunc`): `void`

**`deprecated`** Registry.registerDetailsViewHeaderAction is deprecated. Please use registerDetailsViewHeaderAction.

#### Parameters

| Name | Type |
| :------ | :------ |
| `actionName` | `string` |
| `actionFunc` | `HeaderActionType` |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:153](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/plugin/registry.tsx#L153)

___

### registerDetailsViewSection

▸ **registerDetailsViewSection**(`sectionName`, `sectionFunc`): `void`

**`deprecated`** Registry.registerDetailsViewSection is deprecated. Please use registerDetailsViewSection.

```tsx

register.registerDetailsViewSection('biolatency', resource => {
  if (resource?.kind === 'Node') {
    return {
      title: 'Block I/O Latency',
      component: () => <CustomComponent />,
    };
  }
  return null;
});

```

#### Parameters

| Name | Type |
| :------ | :------ |
| `sectionName` | `string` |
| `sectionFunc` | (`props`: { `resource`: `any`  }) => ``null`` \| [`SectionFuncProps`](../interfaces/plugin_registry.SectionFuncProps.md) |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:185](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/plugin/registry.tsx#L185)

___

### registerRoute

▸ **registerRoute**(`routeSpec`): `void`

**`deprecated`** Registry.registerRoute is deprecated. Please use registerRoute.

#### Parameters

| Name | Type |
| :------ | :------ |
| `routeSpec` | [`Route`](../interfaces/lib_router.Route.md) |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:145](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/plugin/registry.tsx#L145)

___

### registerSidebarItem

▸ **registerSidebarItem**(`parentName`, `itemName`, `itemLabel`, `url`, `opts?`): `void`

**`deprecated`** Registry.registerSidebarItem is deprecated. Please use registerSidebarItem.

#### Parameters

| Name | Type |
| :------ | :------ |
| `parentName` | ``null`` \| `string` |
| `itemName` | `string` |
| `itemLabel` | `string` |
| `url` | `string` |
| `opts` | `Pick`<[`SidebarEntryProps`](../interfaces/plugin_registry.SidebarEntryProps.md), ``"sidebar"`` \| ``"icon"`` \| ``"useClusterURL"``\> |

#### Returns

`void`

#### Defined in

[plugin/registry.tsx:121](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/plugin/registry.tsx#L121)
