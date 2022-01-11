import { Headlamp, Plugin, Registry } from '@kinvolk/headlamp-plugin/lib';

// import { SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
// import { K8s } from '@kinvolk/headlamp-plugin/lib/K8s';
// import { Typography } from '@material-ui/core';

class MyPlugin extends Plugin {
  initialize(registry: Registry) {
    console.log('$${name} initialized');

    // Register your plugin methods here, like:
    // registry.registerSidebarItem(...);
    // registry.registerRoute(...);

    return true;
  }
}

Headlamp.registerPlugin('$${name}', new MyPlugin());
