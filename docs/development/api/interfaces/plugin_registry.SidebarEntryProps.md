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

[components/Sidebar/SidebarItem.tsx:103](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/components/Sidebar/SidebarItem.tsx#L103)

___

### label

• **label**: `string`

Label to display.

#### Defined in

[components/Sidebar/SidebarItem.tsx:85](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/components/Sidebar/SidebarItem.tsx#L85)

___

### name

• **name**: `string`

Name of this SidebarItem.

#### Defined in

[components/Sidebar/SidebarItem.tsx:81](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/components/Sidebar/SidebarItem.tsx#L81)

___

### parent

• `Optional` **parent**: ``null`` \| `string`

Name of the parent SidebarEntry.

#### Defined in

[components/Sidebar/SidebarItem.tsx:89](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/components/Sidebar/SidebarItem.tsx#L89)

___

### url

• `Optional` **url**: `string`

URL to go to when this item is followed.

#### Defined in

[components/Sidebar/SidebarItem.tsx:93](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/components/Sidebar/SidebarItem.tsx#L93)

___

### useClusterURL

• `Optional` **useClusterURL**: `boolean`

Should URL have the cluster prefix? (default=true)

#### Defined in

[components/Sidebar/SidebarItem.tsx:97](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/components/Sidebar/SidebarItem.tsx#L97)
