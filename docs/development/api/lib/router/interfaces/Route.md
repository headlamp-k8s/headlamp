# Interface: Route

## Properties

### component()

```ts
component: () => ReactNode;
```

Shown component for this route.

#### Returns

`ReactNode`

#### Defined in

[frontend/src/lib/router.tsx:117](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/router.tsx#L117)

***

### disabled?

```ts
optional disabled: boolean;
```

Whether the route should be disabled (not registered).

#### Defined in

[frontend/src/lib/router.tsx:121](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/router.tsx#L121)

***

### exact?

```ts
optional exact: boolean;
```

When true, will only match if the path matches the location.pathname exactly.

#### Defined in

[frontend/src/lib/router.tsx:100](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/router.tsx#L100)

***

### hideAppBar?

```ts
optional hideAppBar: boolean;
```

Hide the appbar at the top.

#### Defined in

[frontend/src/lib/router.tsx:119](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/router.tsx#L119)

***

### isFullWidth?

```ts
optional isFullWidth: boolean;
```

Render route for full width

#### Defined in

[frontend/src/lib/router.tsx:123](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/router.tsx#L123)

***

### name?

```ts
optional name: string;
```

Human readable name. Capitalized and short.

#### Defined in

[frontend/src/lib/router.tsx:102](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/router.tsx#L102)

***

### noAuthRequired?

```ts
optional noAuthRequired: boolean;
```

This route does not require Authentication.

#### Defined in

[frontend/src/lib/router.tsx:113](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/router.tsx#L113)

***

### ~~noCluster?~~

```ts
optional noCluster: boolean;
```

In case this route does *not* need a cluster prefix and context.

#### Deprecated

please use useClusterURL.

#### Defined in

[frontend/src/lib/router.tsx:107](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/router.tsx#L107)

***

### path

```ts
path: string;
```

Any valid URL path or array of paths that path-to-regexp@^1.7.0 understands.

#### Defined in

[frontend/src/lib/router.tsx:98](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/router.tsx#L98)

***

### sidebar

```ts
sidebar: null | string | {
  item: null | string;
  sidebar: string;
};
```

The sidebar entry this Route should enable, or null if it shouldn't enable any. If an object is passed with item and sidebar, it will try to enable the given sidebar and the given item.

#### Defined in

[frontend/src/lib/router.tsx:115](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/router.tsx#L115)

***

### useClusterURL?

```ts
optional useClusterURL: boolean;
```

Should URL have the cluster prefix? (default=true)

#### Defined in

[frontend/src/lib/router.tsx:111](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/router.tsx#L111)
