---
title: Building and Shipping Plugins
linktitle: Building & Shipping
---

This is how to start a new plugin:

```bash
npx @kinvolk/headlamp-plugin create headlamp-myfancy
cd headlamp-myfancy
npm run start
```

Now run Headlamp, and your plugin should be loaded.


## Shipping / Deploying Plugins

Once we have the plugin or plugins compiled, they should be included in
Headlamp by having them in a "plugins directory" which should be passed to
Headlamp's server.

For example, if we have compiled 3 plugins called MyPlugin1, MyPlugin2, and
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

Then, when running Headlamp's server, the `-plugin-dir` option should point
to the directory:

```bash
./server -plugins-dir=.plugins
```
