---
title: Plugins Functionality
linktitle: Functionality
---

Headlamp's plugins exist for changing or adding functionality related to
the user interface and experience.

## Plugins Lib

The `@kinvolk/headlamp-plugin` module ships a library
(`@kinvolk/headlamp-plugin/lib`) where all the Headlamp-related development
modules can be found.

The main ones are:

- K8s: Kubernetes related functionality
- Headlamp: To register plugins
- CommonComponents: React components commonly used in the Headlamp UI
- Notification: This module contains two exported members one is Notification, a class which can be used to prepare notifications that are accepted by headlamp and the other one is setNotificationsInStore it is a dispatcher function which accepts a notification object prepared from the Notification class and when called it brings the notifications from plugin land to headlamp ecosystem so that headlamp can parse the notification and display it.
- Router: To get or generate routes

### Shared Modules

Headlamp ships many of the common npm modules that should be shared by both
the plugins and Headlamp itself, and includes the config files for editors
like VS Code to find them.

These are:

- react
- @iconify-react
- react-redux
- @material-ui/core
- @material-ui/styles
- lodash
- notistack
- recharts

Thus, plugins only need to install dependencies that are not yet provided by Headlamp.
Yet, if any dependencies already covered by Headlamp are installed by the plugins, you
just need to make sure they are the same version that Headlamp supports, as these will
not be bundled when [building the plugin](../building.md).
Particularly, the mentioned modules will be replaced by their version that's included
in a global objects called `pluginLib`.

Older plugin development guides still asked developers to use e.g. React in the following
way `const React = window.pluginLib.React`, but this is no longer needed.

## Functionality

The plugin registers makes functionality available to plugins in an easy way.

The idea is to make more and more functionality available to plugins. Here is
what we have so far:

### App Bar Action

Show a component in the app bar (in the top right) with
[registerAppBarAction](../api/modules/plugin_registry.md#registerappbaraction).

![screenshot of the header showing two actions](./images/podcounter_screenshot.png)

- Example plugin shows [How To Register an App Bar Action](https://github.com/kinvolk/headlamp/tree/main/plugins/examples/pod-counter)
- API reference for [registerAppBarAction](../api/modules/plugin_registry.md#registerappbaraction)

### App Logo

Change the logo (at the top left) with
[registerAppLogo](../api/modules/plugin_registry.md#registerapplogo).

![screenshot of the logo being changed](./images/change-logo.png)

- Example plugin shows [How To Change The Logo](https://github.com/kinvolk/headlamp/tree/main/plugins/examples/change-logo)
- API reference for [registerAppLogo](../api/modules/plugin_registry.md#registerapplogo)

### App Menus

Add menus when Headlamp is running as an app.
[Headlamp.setAppMenu](../api/classes/plugin_lib.Headlamp.md/#setappmenu)

![screenshot of the logo being changed](./images/app-menus.png)

- Example plugin shows [How To Add App Menus](https://github.com/kinvolk/headlamp/tree/main/plugins/examples/app-menus)
- API reference for [Headlamp.setAppMenu](../api/classes/plugin_lib.Headlamp.md/#setappmenu)

### Cluster Chooser

Change the Cluster Chooser button (in the middle top of the Headlamp app bar) with
[registerClusterChooser](../api/modules/plugin_registry.md#registerclusterchooser).

![screenshot of the cluster chooser button](./images/cluster-chooser.png)

- Example plugin shows [How To Register Cluster Chooser button](https://github.com/kinvolk/headlamp/tree/main/plugins/examples/clusterchooser)
- API reference for [registerClusterChooser](../api/modules/plugin_registry.md#registerclusterchooser)

### Details View Header Action

Show a component to the top right area of a detail view
(in the area of the screenshot below that's highlighted as yellow)
[registerDetailsViewHeaderAction](../api/modules/plugin_registry.md#registerdetailsviewheaderaction).

![screenshot of the header showing two actions](./images/header_actions_screenshot.png)

- Example plugin shows [How To set a Details View Header Action](https://github.com/kinvolk/headlamp/tree/main/plugins/examples/details-view)
- API reference for [registerDetailsViewHeaderAction](../api/modules/plugin_registry.md#registerdetailsviewheaderaction)

### Details View Section

Change sections in cluster resources' details views with [registerDetailsViewSectionsProcessor](../api/modules/plugin_registry.md#registerDetailsViewSectionsProcessor). This allows you to remove, add, update, or shuffle sections within details views, including the back link.

Or simply append a component at the bottom of different details views with
[registerDetailsViewSection](../api/modules/plugin_registry.md#registerdetailsviewsection).

![screenshot of the appended Details View Section](./images/details-view.jpeg)

- Example plugin shows [How To set a Details View Section](https://github.com/kinvolk/headlamp/tree/main/plugins/examples/details-view)
- API reference for [registerDetailsViewSection](../api/modules/plugin_registry.md#registerdetailsviewsection)

### Dynamic Clusters

Set a cluster dynamically, rather than have the backend read it from configuration files.
[Headlamp.setCluster](../api/classes/plugin_lib.Headlamp.md#setcluster).

- Example plugin shows [How To Dynamically Set a Cluster](https://github.com/kinvolk/headlamp/tree/main/plugins/examples/dynamic-clusters)
- API reference for [Headlamp.setCluster](../api/classes/plugin_lib.Headlamp.md#setcluster)

### Route

Show a component (in Headlamps main area) at a given URL with
[registerRoute](../api/modules/plugin_registry.md#registerroute).

- Example plugin shows [How To Register a Route](https://github.com/kinvolk/headlamp/tree/main/plugins/examples/sidebar), and how to remove a route.
- API reference for [registerRoute](../api/modules/plugin_registry.md#registerroute)
- API reference for [registerRouteFilter](../api/modules/plugin_registry.md#registerroutefilter)


### Sidebar Item

Add sidebar items (menu on the left) with
[registerSidebarEntry](../api/modules/plugin_registry.md#registersidebarentry).
Remove sidebar items with [registerSidebarEntryFilter](../api/modules/plugin_registry.md#registersidebarentryfilter).

![screenshot of the sidebar being changed](./images/sidebar.png)

- Example plugin shows [How To add items to the sidebar](https://github.com/kinvolk/headlamp/tree/main/plugins/examples/sidebar), and also how to remove sidebar items.
- API reference for [registerSidebarEntry](../api/modules/plugin_registry.md#registersidebarentry)
- API reference for [registerSidebarEntryFilter](../api/modules/plugin_registry.md#registersidebarentryfilter)

### Tables

Change what tables across Headlamp show with [registerResourceTableColumnsProcessor](../api/modules/plugin_registry.md#registersidebarentry). This allows you to remove, add, update, or shuffle table columns.

![screenshot of the pods list with a context menu added by a plugin](./images/table-context-menu.png)

- Example plugin shows [How to add a context menu to each row in the pods list table](https://github.com/kinvolk/headlamp/tree/main/plugins/examples/tables).
- API reference for [registerResourceTableColumnsProcessor](../api/modules/plugin_registry.md#registerresourcetablecolumnsprocessor)
