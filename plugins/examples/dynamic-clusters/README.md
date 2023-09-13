# Example Plugin: Set up clusters dynamically

Configure (or update) a cluster dynamically that can then be used throughout Headlamp.

Important: This plugin example only works in the desktop version.
Dynamically setting up clusters can not be done when Headlamp is run in-cluster.

You will need to edit the source code of this plugin to add a cluster.

To run the plugin with [node.js](https://nodejs.org/en/) installed:

```bash
git clone git@github.com:kinvolk/headlamp.git
cd headlamp/plugins/examples/dynamic-clusters/
npm install
npm start
```

The main code for the plugin is in [src/index.tsx](src/index.tsx).

## Further information

See:

- API documentation for [Headlamp.setCluster](https://headlamp.dev/docs/latest/development/api/classes/plugin_lib.headlamp/#setcluster)
- The [getting started documentation for Headlamp plugin development](https://headlamp.dev/docs/latest/development/plugins/building/)
