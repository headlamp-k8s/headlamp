---
title: "Interface: Route"
linkTitle: "Route"
slug: "lib_router.Route"
---

[lib/router](../modules/lib_router.md).Route

## Properties

### disabled

• `Optional` **disabled**: `boolean`

Whether the route should be disabled (not registered).

#### Defined in

[lib/router.tsx:117](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/router.tsx#L117)

___

### exact

• `Optional` **exact**: `boolean`

When true, will only match if the path matches the location.pathname exactly.

#### Defined in

[lib/router.tsx:96](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/router.tsx#L96)

___

### hideAppBar

• `Optional` **hideAppBar**: `boolean`

Hide the appbar at the top.

#### Defined in

[lib/router.tsx:115](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/router.tsx#L115)

___

### name

• `Optional` **name**: `string`

Human readable name. Capitalized and short.

#### Defined in

[lib/router.tsx:98](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/router.tsx#L98)

___

### noAuthRequired

• `Optional` **noAuthRequired**: `boolean`

This route does not require Authentication.

#### Defined in

[lib/router.tsx:109](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/router.tsx#L109)

___

### noCluster

• `Optional` **noCluster**: `boolean`

In case this route does *not* need a cluster prefix and context.

**`deprecated`** please use useClusterURL.

#### Defined in

[lib/router.tsx:103](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/router.tsx#L103)

___

### path

• **path**: `string`

Any valid URL path or array of paths that path-to-regexp@^1.7.0 understands.

#### Defined in

[lib/router.tsx:94](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/router.tsx#L94)

___

### sidebar

• **sidebar**: ``null`` \| `string` \| { `item`: ``null`` \| `string` ; `sidebar`: `string`  }

The sidebar entry this Route should enable, or null if it shouldn't enable any. If an object is passed with item and sidebar, it will try to enable the given sidebar and the given item.

#### Defined in

[lib/router.tsx:111](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/router.tsx#L111)

___

### useClusterURL

• `Optional` **useClusterURL**: `boolean`

Should URL have the cluster prefix? (default=true)

#### Defined in

[lib/router.tsx:107](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/router.tsx#L107)

## Methods

### component

▸ **component**(): `Element`

Shown component for this route.

#### Returns

`Element`

#### Defined in

[lib/router.tsx:113](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/router.tsx#L113)
