# Class: Registry

## Constructors

### new Registry()

```ts
new Registry(): Registry
```

#### Returns

[`Registry`](Registry.md)

## Methods

### ~~registerAppBarAction()~~

```ts
registerAppBarAction(actionName: string, actionFunc: (...args: any[]) => ReactNode): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `actionName` | `string` |
| `actionFunc` | (...`args`: `any`[]) => `ReactNode` |

#### Returns

`void`

#### Deprecated

Registry.registerAppBarAction is deprecated. Please use registerAppBarAction.

#### Defined in

[frontend/src/plugin/registry.tsx:164](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L164)

***

### ~~registerAppLogo()~~

```ts
registerAppLogo(logo: AppLogoType): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `logo` | [`AppLogoType`](../type-aliases/AppLogoType.md) |

#### Returns

`void`

#### Deprecated

Registry.registerAppLogo is deprecated. Please use registerAppLogo.

#### Defined in

[frontend/src/plugin/registry.tsx:213](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L213)

***

### ~~registerClusterChooserComponent()~~

```ts
registerClusterChooserComponent(component: null | ComponentType<ClusterChooserProps>): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `component` | `null` \| `ComponentType`\<[`ClusterChooserProps`](../interfaces/ClusterChooserProps.md)\> |

#### Returns

`void`

#### Deprecated

Registry.registerClusterChooserComponent is deprecated. Please use registerClusterChooser.

#### Defined in

[frontend/src/plugin/registry.tsx:221](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L221)

***

### ~~registerDetailsViewHeaderAction()~~

```ts
registerDetailsViewHeaderAction(actionName: string, actionFunc: HeaderActionType): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `actionName` | `string` |
| `actionFunc` | `HeaderActionType` |

#### Returns

`void`

#### Deprecated

Registry.registerDetailsViewHeaderAction is deprecated. Please use registerDetailsViewHeaderAction.

#### Defined in

[frontend/src/plugin/registry.tsx:154](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L154)

***

### ~~registerDetailsViewSection()~~

```ts
registerDetailsViewSection(sectionName: string, sectionFunc: (resource: KubeObject<any>) => null | SectionFuncProps): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `sectionName` | `string` |
| `sectionFunc` | (`resource`: [`KubeObject`](../../../lib/k8s/KubeObject/classes/KubeObject.md)\<`any`\>) => `null` \| [`SectionFuncProps`](../interfaces/SectionFuncProps.md) |

#### Returns

`void`

#### Deprecated

Registry.registerDetailsViewSection is deprecated. Please use registerDetailsViewSection.

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

#### Defined in

[frontend/src/plugin/registry.tsx:186](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L186)

***

### ~~registerRoute()~~

```ts
registerRoute(routeSpec: Route): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `routeSpec` | [`Route`](../../../lib/router/interfaces/Route.md) |

#### Returns

`void`

#### Deprecated

Registry.registerRoute is deprecated. Please use registerRoute.

#### Defined in

[frontend/src/plugin/registry.tsx:146](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L146)

***

### ~~registerSidebarItem()~~

```ts
registerSidebarItem(
   parentName: null | string, 
   itemName: string, 
   itemLabel: string, 
   url: string, 
   opts: Pick<SidebarEntryProps, "icon" | "sidebar" | "useClusterURL">): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `parentName` | `null` \| `string` |
| `itemName` | `string` |
| `itemLabel` | `string` |
| `url` | `string` |
| `opts` | `Pick`\<[`SidebarEntryProps`](../interfaces/SidebarEntryProps.md), `"icon"` \| `"sidebar"` \| `"useClusterURL"`\> |

#### Returns

`void`

#### Deprecated

Registry.registerSidebarItem is deprecated. Please use registerSidebarItem.

#### Defined in

[frontend/src/plugin/registry.tsx:122](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L122)
