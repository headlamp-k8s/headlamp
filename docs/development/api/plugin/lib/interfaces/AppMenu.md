# Interface: AppMenu

The members of AppMenu should be the same as the options for the MenuItem in https://www.electronjs.org/docs/latest/api/menu-item
except for the "submenu" (which is the AppMenu type) and "click" (which is not supported here, use the
"url" field instead).

## Indexable

 \[`key`: `string`\]: `any`

## Properties

### submenu?

```ts
optional submenu: AppMenu[];
```

The submenus of this menu

#### Defined in

[frontend/src/plugin/lib.ts:74](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/lib.ts#L74)

***

### url?

```ts
optional url: string;
```

A URL to open (if not starting with http, then it'll be opened in the external browser)

#### Defined in

[frontend/src/plugin/lib.ts:72](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/lib.ts#L72)
