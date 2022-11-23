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

[lib/router.tsx:72](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/router.tsx#L72)

___

### hideAppBar

• `Optional` **hideAppBar**: `boolean`

Hide the appbar at the top.

#### Defined in

[lib/router.tsx:91](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/router.tsx#L91)

___

### name

• `Optional` **name**: `string`

Human readable name. Capitalized and short.

#### Defined in

[lib/router.tsx:74](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/router.tsx#L74)

___

### noAuthRequired

• `Optional` **noAuthRequired**: `boolean`

This route does not require Authentication.

#### Defined in

[lib/router.tsx:85](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/router.tsx#L85)

___

### noCluster

• `Optional` **noCluster**: `boolean`

In case this route does *not* need a cluster prefix and context.

**`deprecated`** please use useClusterURL.

#### Defined in

[lib/router.tsx:79](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/router.tsx#L79)

___

### path

• **path**: `string`

Any valid URL path or array of paths that path-to-regexp@^1.7.0 understands.

#### Defined in

[lib/router.tsx:70](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/router.tsx#L70)

___

### sidebar

• **sidebar**: ``null`` \| `string`

The sidebar group this Route should be in, or null if it is in no group.

#### Defined in

[lib/router.tsx:87](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/router.tsx#L87)

___

### useClusterURL

• `Optional` **useClusterURL**: `boolean`

Should URL have the cluster prefix? (default=true)

#### Defined in

[lib/router.tsx:83](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/router.tsx#L83)

## Methods

### component

▸ **component**(): `Element`

Shown component for this route.

#### Returns

`Element`

#### Defined in

[lib/router.tsx:89](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/router.tsx#L89)
