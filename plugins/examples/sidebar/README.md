# Example Plugin: Sidebar Items

This example plugin places two items with the title "Feedback" in the
sidebar; one as a top-level entry, and the other is placed under the
cluster item. It also removes the Namespaces sidebar item and route.

![screenshot of the side bar being changed](../../../docs/development/plugins/images/sidebar.png)

To run the plugin:

```bash
cd plugins/examples/sidebar
npm install
npm start
# See the sidebar on the left of Headlamp has changed.
```

The main code for the plugin is in [src/index.tsx](src/index.tsx).

See the API documentation for:

- [registerSidebarEntry](https://kinvolk.github.io/headlamp/docs/latest/development/api/classes/plugin_registry.registry/#registersidebarentry)
- [registerSidebarEntryFilter](https://kinvolk.github.io/headlamp/docs/latest/development/api/classes/plugin_registry.registry/#registersidebarentryfilter)
- [registerRoute](https://kinvolk.github.io/headlamp/docs/latest/development/api/classes/plugin_registry.registry/#registerroute)
- [registerRouteFilter](https://kinvolk.github.io/headlamp/docs/latest/development/api/classes/plugin_registry.registry/#registerroutefilter)
