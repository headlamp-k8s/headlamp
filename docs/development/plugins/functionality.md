---
title: Plugins Functionality
linktitle: Functionality
---

Headlamp's plugins exist for changing or adding functionlity related to
the user interface and experience.

*⚠️ IMPORTANT FOR DEVS:* The plugins system and plugins lib is still in the process of being
consolidated. This means that 1) it's subject to change, 2) you are very
welcome to contribute to it with different use cases and/or development.

## Plugins Lib

Headlamp exposes a `pluginLib` object in the global object `window`.
A number of modules, both from Headlamp, or representing Headlamp's common
dependencies are included in the `pluginLib`.

Thus, plugins should only use dependencies that are not yet provided by
Headlamp.

A

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

This method allows developers to set entries in the sidebar.
