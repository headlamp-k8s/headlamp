---
title: Plugins
linkTitle: Plugins
---

Plugins are one of the key features of Headlamp. They allow you to change how and what information is displayed, as well as other functionality. The ultimate goal of the plugins system is to allow vendors to build and deploy Headlamp with extra functionality without having to maintain a fork of the project.

# Using plugins

Headlamp looks for plugins in different places.
It looks at the Headlamp's configuration folder first:

On a Mac and Linux desktop, the plugins folder is by default:
`$HOME/.config/Headlamp/plugins`

On Windows, it is by default:
`$APPDATA/Headlamp/Config/plugins`

In the plugins directory, plugins should be in the following format:

```
MyPlugin1/
    main.js
MyPlugin2/
    main.js
MyPlugin3/
    main.js
```

See the [shipping & deploying plugins](./building.md#shipping--deploying-plugins) section
for more details.

# Developing Plugins

Plugins are supposed to be built and shipped out-of-tree, i.e. instead of managing the plugins'
code within the Headlamp project or a Headlamp fork (which would require
always rebuilding/maintaining Headlamp when changing a plugin), they're
supposed to be built outside of the project and loaded by Headlamp.

Learn [how to create a Headlamp plugin](./building.md).
