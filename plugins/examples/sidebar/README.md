# Example Plugin: Sidebar Items

This example plugin places two items with the title "Feedback" in the
sidebar; one as a top-level entry, and the other is placed under the
cluster item.

To run the plugin:

```bash
cd plugins/examples/sidebar
npm install
npm start
# See the sidebar on the left of Headlamp has changed.
```

The main code for the plugin is in [src/index.tsx](src/index.tsx).

See the API documentation for:

- [registerSidebarItem](https://kinvolk.github.io/headlamp/docs/latest/development/api/classes/plugin_registry.registry/#registersidebaritem)
- [registerRoute](https://kinvolk.github.io/headlamp/docs/latest/development/api/classes/plugin_registry.registry/#registerroute)
