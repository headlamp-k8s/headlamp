# Example Plugin: Pod Counter

This example plugin shows how to put something in the appbar, and also how to
use the K8s API to count the number of pods in the cluster.

To run the plugin:

```bash
cd plugins/examples/podcounter
npm install
npm start
# See the app bar at the top of Headlamp has changed to show the number of Pods.
```

The main code for the plugin is in [src/index.tsx](src/index.tsx).

See the API documentation for:

- [registerAppBarAction](https://kinvolk.github.io/headlamp/docs/latest/development/api/classes/plugin_registry.registry/#registerappbaraction)
