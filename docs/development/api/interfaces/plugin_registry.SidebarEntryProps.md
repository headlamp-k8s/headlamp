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

[components/Sidebar/SidebarItem.tsx:104](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/components/Sidebar/SidebarItem.tsx#L104)

___

### label

• **label**: `string`

Label to display.

#### Defined in

[components/Sidebar/SidebarItem.tsx:86](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/components/Sidebar/SidebarItem.tsx#L86)

___

### name

• **name**: `string`

Name of this SidebarItem.

#### Defined in

[components/Sidebar/SidebarItem.tsx:82](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/components/Sidebar/SidebarItem.tsx#L82)

___

### parent

• `Optional` **parent**: ``null`` \| `string`

Name of the parent SidebarEntry.

#### Defined in

[components/Sidebar/SidebarItem.tsx:90](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/components/Sidebar/SidebarItem.tsx#L90)

___

### sidebar

• `Optional` **sidebar**: `string`

The sidebar to display this item in. If not specified, it will be displayed in the default sidebar.

#### Defined in

[components/Sidebar/SidebarItem.tsx:107](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/components/Sidebar/SidebarItem.tsx#L107)

___

### url

• `Optional` **url**: `string`

URL to go to when this item is followed.

#### Defined in

[components/Sidebar/SidebarItem.tsx:94](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/components/Sidebar/SidebarItem.tsx#L94)

___

### useClusterURL

• `Optional` **useClusterURL**: `boolean`

Should URL have the cluster prefix? (default=true)

#### Defined in

[components/Sidebar/SidebarItem.tsx:98](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/components/Sidebar/SidebarItem.tsx#L98)
