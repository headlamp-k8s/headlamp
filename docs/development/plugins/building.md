---
title: Building and Shipping Plugins
linktitle: Building & Shipping
---

This section explains how to start developing a Headlamp plugin, and how
to ship it once finished.

Before you dive into the following sections on how to develop plugins for
Headlamp, you can watch this quick [video](https://www.youtube.com/watch?v=vyki8c6AkeE)
to see how simple it is to get started.

{{< youtube "vyki8c6AkeE" >}}

## Creating a new plugin

This is how to start a new plugin:

```bash
npx --yes @kinvolk/headlamp-plugin create headlamp-myfancy
cd headlamp-myfancy
npm run start
```

There's some basic code inside src/index.tsx.

Now run Headlamp (the desktop app or the
[development version](../index.md##run-the-code)),
and your plugin should be loaded.

Using the above commands means that Headlamp will **automatically reload**
whenever to make a change to the plugin.

ℹ️ This automatic reload does not happen when running in-cluster,
even if the plugins folder is changed. i.e. if you want to serve
updated plugins, you need to restart the server.

## Code Formatting, Linting, and Type Checking

Your plugin has a few tools built in to help make development easier.

#### Format code with prettier

```bash
npm run format
```

#### Find code lint issues with eslint

```bash
npm run lint
```

Eslint also allows you to try and automatically fix issues.

```bash
npm run lint-fix
```

#### Run the type checker

```bash
npm run tsc
```

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

## Shipping and Deploying Plugins

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

### Bundling plugins with desktop version

To build a Headlamp app with a set of plugins, first extract some plugins 
into the .plugins folder in the root of the headlamp repo. To see more about
how to extract files into there see "Shipping and Deploying Plugins" above.

```bash
cd plugins/examples/pod-counter
npm install
npm run build
cd ../..

npx @kinvolk/headlamp-plugin extract ./plugins/examples/ ./.plugins
ls -la .plugins
make app-linux
```
