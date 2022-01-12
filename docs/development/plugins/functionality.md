---
title: Plugins Functionality
linktitle: Functionality
---

Headlamp's plugins exist for changing or adding functionlity related to
the user interface and experience.

## Plugins Lib

The `@kinvolk/headlamp-plugin` module ships a library
(`@kinvolk/headlamp-plugin/lib`) where all the Headlamp-related development
modules can be found.

The main ones are:
* K8s: Kubernetes related functionality
* Registry: The plugin registry, used to register functionality
* Headlamp: To register plugins
* CommonComponents: React components commonly used in the Headlamp UI

### Shared Modules

Headlamp ships many of the common npm modules that should be shared by both
the plugins and Headlamp itself, and includes the config files for editors
like VS Code to find them.

These are:
* react
* @iconify-react
* react-redux
* @material-ui/core
* @material-ui/styles
* lodash
* notistack
* recharts

Thus, plugins only need to install dependencies that are not yet provided by Headlamp.
Yet, if any dependencies already covered by Headlamp are intalled by the plugins, you
just need to make sure they are te same version that Headlamp supports, as these will
not be bundled when [building the plugin](../building.md).
Particularly, the mentioned modules will be replaced by their version that's included
in a global objects called `pluginLib`.

Older plugin development guides still asked developers to use e.g. React in the following
way `const React = window.pluginLib.React`, but this is not longer needed.

### Registration

Apart from the modules mentioned above, Headlamp also adds an important method
for registering plugins (`Headlamp.registerPlugin`).

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
