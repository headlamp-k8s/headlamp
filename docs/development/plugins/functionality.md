---
title: Plugins Functionality
linktitle: Functionality
---

Headlamp's plugins exist for changing or adding functionlity related to
the user interface and experience.

## Plugins Lib

Headlamp exposes a `pluginLib` object in the global object `window`.
A number of modules, both from Headlamp, or representing Headlamp's common
dependencies are included in the `pluginLib`.

Thus, plugins should only use dependencies that are not yet provided by Headlamp.


### Modules

External modules available currently in the `pluginLib` are:

* React
* Iconify
* ReactRedux
* MuiCore (Material UI's core module)
* MuiStyles (Material UI's styles module)
* Lodash

Apart from the external modules above, the `pluginLib` contains of course
modules that are related to Headlamp, so developers can use the cluster and
web UI related functionality. Those modules are:

* K8s
* CommonComponents

This means that you can just declare a `const React = window.pluginLib.React` in order to use
React without having to import it.

### Registration

Apart from the modules mentioned above, Headlamp also adds an important method
for registering plugins (`window.registerPlugin`).

## Funcionality

The plugin registers makes functionality available to plugins in an easy way.

The idea is to make more and more functionality available to plugins. Here is
what we have so far:

### Sidebar Items

```typescript
registerSidebarItem(parentName: string, itemName: string,
                    itemLabel: string, url: string,
                    opts = {useClusterURL: true})
```

This method allows to set entries in the sidebar.

The arguments are as follows:

* `parentName`: The name of the parent entry. If the string is empty, then there is no parent,
and that means the entry is a top-level one. For knowing which names exist
already in the Sidebar, at the moment you have to check the configuration for that component, which can be found in Headlamp's `src/components/Sidebar.tsx`.
* `itemName`: The logical name for the item, i.e. the name other sub-entries will use
when setting this item as a parent.
* `itemLabel`: The text to be displayed for the entry in the Sidebar.
* `url`: The URL to go to when clicking this entry.
* `opts`: The options related to registering this item. At the moment, only
the `useClusterUrl` (defaults to `true`) can be used. This option indicates
whether the URL we are using for this entry should be prefixed with the
current cluster URL or not. Most cluster related actions should have URLs
that are prefixed by the cluster name and that's managed automatically
with this option.

### Routes

```typescript
registerRoute(routeSpec: Route)
```

```typescript
interface Route {
  path: string;
  exact?: boolean;
  noCluster?: boolean;
  noAuthRequired?: boolean;
  sidebar: string | null;
  component: () => JSX.Element;
}
```

This method allows to register a route (i.e. a known URL that resolves to
a component displayed in Headlamp's main area).

The `routeSpec` is an object with the following members:

* `path`: The URL path for the route.
* `exact` (optional): There it should be an exact match between the URL's path and the
one defined in the route spec (see [ReactRouter](https://reactrouter.com/native/api/Route/exact-bool)'s docs for more context). By default it is `false`.
* `noCluster` (optional): Whether the route doesn't belongs to a cluster (in which
case the URL produced for it will have the cluster prefix). By default it is `false`.
* `noAuthRequired` (optional): Whether authentication is not required for this route
(example, non-cluster routes such as settings). By default it is `false`.
* `sidebar`: Which sidebar entry to select when this route is on (the value used should be an item
name of the sidebar).
* `component`: The component to render in Headlamp's main area.

### Details Views' Header Actions

```typescript
registerDetailsViewHeaderAction(actionName: string,
                                actionFunc: (item: object) => JSX.Element | null)
```

This method allows to add a component to the top right area of details views
(in the area of the screenshot below that's highlighted as yellow).

![screenshot of the header showing two actions](./header_actions_screenshot.png)

Details views are the views used for displaying information about each
cluster's resource.

The arguments are as follows:

* `actionName`: The name for this action.
* `actionFunc`: A function that takes an item and returns an element (or null, if nothing should
be done).

### App Bar Actions

```typescript
registerAppBarAction(actionName: string, actionFunc: () => JSX.Element | null))
```

This method allows to add a component to the top right area of the app bar
(top bar).

The arguments are as follows:

* `actionName`: The name for this action.
* `actionFunc`: A function that returns an element.
