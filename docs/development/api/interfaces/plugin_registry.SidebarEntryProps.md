---
title: "Interface: SidebarEntryProps"
linkTitle: "SidebarEntryProps"
slug: "plugin_registry.SidebarEntryProps"
---

[plugin/registry](../modules/plugin_registry.md).SidebarEntryProps

Represents an entry in the sidebar menu.

## Properties

### icon

• `Optional` **icon**: `string` \| `IconifyIcon`

An iconify string or icon object that will be used for the sidebar's icon

**`see`** https://icon-sets.iconify.design/mdi/ for icons.

#### Defined in

[components/Sidebar/SidebarItem.tsx:177](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/components/Sidebar/SidebarItem.tsx#L177)

___

### label

• **label**: `string`

Label to display.

#### Defined in

[components/Sidebar/SidebarItem.tsx:159](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/components/Sidebar/SidebarItem.tsx#L159)

___

### name

• **name**: `string`

Name of this SidebarItem.

#### Defined in

[components/Sidebar/SidebarItem.tsx:151](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/components/Sidebar/SidebarItem.tsx#L151)

___

### parent

• `Optional` **parent**: ``null`` \| `string`

Name of the parent SidebarEntry.

#### Defined in

[components/Sidebar/SidebarItem.tsx:163](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/components/Sidebar/SidebarItem.tsx#L163)

___

### sidebar

• `Optional` **sidebar**: `string`

The sidebar to display this item in. If not specified, it will be displayed in the default sidebar.

#### Defined in

[components/Sidebar/SidebarItem.tsx:180](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/components/Sidebar/SidebarItem.tsx#L180)

___

### subtitle

• `Optional` **subtitle**: `string`

Text to display under the name.

#### Defined in

[components/Sidebar/SidebarItem.tsx:155](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/components/Sidebar/SidebarItem.tsx#L155)

___

### url

• `Optional` **url**: `string`

URL to go to when this item is followed.

#### Defined in

[components/Sidebar/SidebarItem.tsx:167](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/components/Sidebar/SidebarItem.tsx#L167)

___

### useClusterURL

• `Optional` **useClusterURL**: `boolean`

Should URL have the cluster prefix? (default=true)

#### Defined in

[components/Sidebar/SidebarItem.tsx:171](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/components/Sidebar/SidebarItem.tsx#L171)
