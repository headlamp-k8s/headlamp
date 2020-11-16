---
title: Building and Shipping Plugins
linktitle: Building & Shipping
---

## Active development / In-tree build

During development however, the workflow of 1. building the plugins outside
of the project; 2. copying to a plugins folder; 3. running Headlamp pointing
to that folder, is not a great development user-experience.

While we are planning a smarter way to develop plugins outside of the project's tree
and having them automatically built and served to the frontend, we have to
use the work around of developing/testing them within the project (before
building and shipping them externally once ready).

For that, you can develop your plugins inside the `frontend/src/plugin/plugins` folder. E.g. if your plugin is called `MyPlugin`, then your plugin
structure should be as follows:

  ```
  frontend/src/plugin/plugins/MyPlugin/index.tsx
  ```

## Out-of-tree build

Once your plugin is working as intended, it should be compiled our of the
Headlamp project. The `index.tsx` (or other Typescript/Javascript extensions)
should be in its own module like:

  ```
  MyPlugin/
    src/
      index.tsx
    package.json
  ```

Feel free to use `npm create` for getting the base structure/files right.

For helping with compiling the plugin code we have the
[@kinvolk/headlamp-plugin](https://www.npmjs.com/package/@kinvolk/headlamp-plugin),
which should be installed as a dev dependency:

```bash
npm install --save-dev @kinvolk/headlamp-plugin
```

Once that's done, simply change your `scripts` element to use the `headlamp-plugin` script:

```json
"scripts": {
  "build": "headlamp-plugin"
}
```

This way, when you run `npm run build`, the plugin will be compiled to a file
within the module called `dist/main.js`

## Shipping / Deploying Plugins

Once we have the plugin or plugins compiled, they should be included in
Headlamp by having them in a "plugins directory" which should be passed to
Headlamp's server.

For example, if we have compiled 3 plugins called MyPlugin1, MyPlugin2, and
MyPlugin3, they should be added to a directory in the following structure:

  ```
  plugins/
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
./server -plugins-dir=/path/to/plugins/
```
