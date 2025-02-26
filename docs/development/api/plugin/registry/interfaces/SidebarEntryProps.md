# Interface: SidebarEntryProps

Represents an entry in the sidebar menu.

## Properties

### icon?

```ts
optional icon: string | IconifyIcon;
```

An iconify string or icon object that will be used for the sidebar's icon

#### See

https://icon-sets.iconify.design/mdi/ for icons.

#### Defined in

[frontend/src/components/Sidebar/sidebarSlice.ts:43](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/Sidebar/sidebarSlice.ts#L43)

***

### label

```ts
label: string;
```

Label to display.

#### Defined in

[frontend/src/components/Sidebar/sidebarSlice.ts:25](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/Sidebar/sidebarSlice.ts#L25)

***

### name

```ts
name: string;
```

Name of this SidebarItem.

#### Defined in

[frontend/src/components/Sidebar/sidebarSlice.ts:17](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/Sidebar/sidebarSlice.ts#L17)

***

### parent?

```ts
optional parent: null | string;
```

Name of the parent SidebarEntry.

#### Defined in

[frontend/src/components/Sidebar/sidebarSlice.ts:29](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/Sidebar/sidebarSlice.ts#L29)

***

### sidebar?

```ts
optional sidebar: string;
```

The sidebar to display this item in. If not specified, it will be displayed in the default sidebar.

#### Defined in

[frontend/src/components/Sidebar/sidebarSlice.ts:46](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/Sidebar/sidebarSlice.ts#L46)

***

### subtitle?

```ts
optional subtitle: string;
```

Text to display under the name.

#### Defined in

[frontend/src/components/Sidebar/sidebarSlice.ts:21](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/Sidebar/sidebarSlice.ts#L21)

***

### url?

```ts
optional url: string;
```

URL to go to when this item is followed.

#### Defined in

[frontend/src/components/Sidebar/sidebarSlice.ts:33](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/Sidebar/sidebarSlice.ts#L33)

***

### useClusterURL?

```ts
optional useClusterURL: boolean;
```

Should URL have the cluster prefix? (default=true)

#### Defined in

[frontend/src/components/Sidebar/sidebarSlice.ts:37](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/Sidebar/sidebarSlice.ts#L37)
