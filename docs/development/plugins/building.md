---
title: Building and Shipping Plugins
linktitle: Building & Shipping
---

This section explains how to start developing a Headlamp plugin, and how
to ship it once finished.

## Creating a new plugin

This is how to start a new plugin:

```bash
npx @kinvolk/headlamp-plugin create headlamp-myfancy
cd headlamp-myfancy
npm run start
```

Now run Headlamp (the desktop app or the
[development version](../index.md##run-the-code)), and your plugin should be loaded.

Using the above commands means that Headlamp will **automatically reload**
whenever to make a change to the plugin.

ℹ️ This automatic reload does not happen when running in-cluster,
even if the plugins folder is changed. i.e. if you want to serve
updated plugins, you need to restart the server.

## Building for production

To build the previous plugin example for production, run the following
command:

```bash
cd headlamp-myfancy
npm run build
```

This will create a file with the bundled plugin in
`headlamp-myfancy/dist/main.js`.

### Building a folder of packages at once

For convienience the `headlamp-plugin build` command can build a 
package or folder of packages.

```bash
npx @kinvolk/headlamp-plugin build myplugins/headlamp-myfancy
npx @kinvolk/headlamp-plugin build myplugins
```

## Shipping / Deploying Plugins

Once a plugin is ready to be shipped (built for production) it needs to
be placed in a "plugins directory", for Headlamp to load them.

For example, if we have built 3 plugins called MyPlugin1, MyPlugin2, and
MyPlugin3, they should be added to a directory in the following structure:

  ```
  .plugins/
    MyPlugin1/
      main.js
    MyPlugin2/
      main.js
    MyPlugin3/
      main.js
  ```

If our plugins are places in `myplugins`, we can conveniently create that
folder with the following command:

```bash
npx @kinvolk/headlamp-plugin extract ./myplugins /path/to/.plugins
```

This also works individually (for each plugin):
```bash
npx @kinvolk/headlamp-plugin extract ./myplugins/MyPlugin1 /path/to/./plugins
```

### In-cluster deployment with plugins

For in-cluster Headlamp deployments, when running Headlamp's server,
the `-plugin-dir` option should point to the directory:

```bash
./server -plugins-dir=.plugins
```

### Using plugins on the desktop version

The Headlamp desktop app will look for the plugins directory (in the format
mentioned above) either under the user's Headlamp configuration folder,
or within the current folder as `.plugins` if the former doesn't exist.
