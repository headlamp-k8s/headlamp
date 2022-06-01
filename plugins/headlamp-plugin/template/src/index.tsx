import { Headlamp, Plugin, Registry } from '@kinvolk/headlamp-plugin/lib';
import React from 'react';

// Here are some imports you may want to use.
// import { SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
// import { K8s } from '@kinvolk/headlamp-plugin/lib/K8s';
// import { Typography } from '@material-ui/core';

class MyPlugin extends Plugin {
  initialize(registry: Registry) {
    console.log('$${name} initialized');

    // Register your plugin methods here, like:
    // registry.registerSidebarItem(...);
    // registry.registerRoute(...);

    registry.registerAppBarAction('$${name}-hello', () => <span>Hello</span>);

    return true;
  }
}

Headlamp.registerPlugin('$${name}', new MyPlugin());
