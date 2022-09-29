---
title: "Interface: Route"
linkTitle: "Route"
slug: "lib_router.Route"
---

[lib/router](../modules/lib_router.md).Route

## Properties

### exact

• `Optional` **exact**: `boolean`

When true, will only match if the path matches the location.pathname exactly.

#### Defined in

[lib/router.tsx:61](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/router.tsx#L61)

___

### hideAppBar

• `Optional` **hideAppBar**: `boolean`

Hide the appbar at the top.

#### Defined in

[lib/router.tsx:80](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/router.tsx#L80)

___

### name

• `Optional` **name**: `string`

Human readable name. Capitalized and short.

#### Defined in

[lib/router.tsx:63](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/router.tsx#L63)

___

### noAuthRequired

• `Optional` **noAuthRequired**: `boolean`

This route does not require Authentication.

#### Defined in

[lib/router.tsx:74](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/router.tsx#L74)

___

### noCluster

• `Optional` **noCluster**: `boolean`

In case this route does *not* need a cluster prefix and context.

**`deprecated`** please use useClusterURL.

#### Defined in

[lib/router.tsx:68](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/router.tsx#L68)

___

### path

• **path**: `string`

Any valid URL path or array of paths that path-to-regexp@^1.7.0 understands.

#### Defined in

[lib/router.tsx:59](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/router.tsx#L59)

___

### sidebar

• **sidebar**: ``null`` \| `string`

The sidebar group this Route should be in, or null if it is in no group.

#### Defined in

[lib/router.tsx:76](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/router.tsx#L76)

___

### useClusterURL

• `Optional` **useClusterURL**: `boolean`

Should URL have the cluster prefix? (default=true)

#### Defined in

[lib/router.tsx:72](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/router.tsx#L72)

## Methods

### component

▸ **component**(): `Element`

Shown component for this route.

#### Returns

`Element`

#### Defined in

[lib/router.tsx:78](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/router.tsx#L78)
