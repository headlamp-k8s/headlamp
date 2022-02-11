---
title: How to create a Plugin
linktitle: How-to
---

This section will walk you through a basic plugin development.

## Types

If you are using Typescript for developing the plugin, the 
`@kinvolk/headlamp-plugin` package does ship some type declarations in
`@kinvolk/headlamp-plugin/types`. Please notice that the whole external
plugin mechanics are still in an early development phase and thus only the
actual type declarations (and not the corresponding code) is shipped in this
package at the moment.


```typescript
import { Headlamp, Plugin, Registry } from '@kinvolk/headlamp-plugin/lib';
```

## Plugin Class

Plugins are classes that register actions when they are initialized.

A plugin class needs an `initialize` method which receives a `register`
class that offers ways to register different types of actions in the web UI.

Besides declaring the plugin, an instance of it needs to be registered using
the `Headlamp.registerPlugin` method.

The following example will show a basic plugin declaration and registration
in a file that should match the `src/index.tsx` structure explained in the
[building](./building) section.


```tsx
import { Headlamp, Plugin, Registry } from '@kinvolk/headlamp-plugin/lib';

class MyPlugin extends Plugin {
  initialize(registry: Registry) {
    console.log('my-plugin initialized');

    // Register your plugin methods here, like:
    // registry.registerSidebarItem(...);
    // registry.registerRoute(...);

    registry.registerAppBarAction('my-plugin-hello', () => <span>Hello</span>);

    return true;
  }
}

Headlamp.registerPlugin('my-plugin', new MyPlugin());
```

## Plugin Example

Let's create a plugin that just gets the number of pods in the cluster and
displays that information in the top bar (i.e. registers an "app bar action").

```tsx
import { Headlamp, Plugin, Registry } from '@kinvolk/headlamp-plugin/lib';
import { Typography } from '@material-ui/core';

// import { SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
// import { K8s } from '@kinvolk/headlamp-plugin/lib/K8s';

function PodCounter() {
  const [pods, error] = K8s.Pod.useList();
  const msg = pods === null ? 'Loading…' : pods.length.toString();

  return (
      <Typography color="textPrimary">{!error ? `# Pods: ${msg}` : 'Uh, pods!?'}</Typography>
  );
}

class PodCounterPlugin extends Plugin {
  initialize(registry: Registry) {
    registry.registerAppBarAction('pod-counter-action', () =>
      <PodCounter />
    );

    return true;
  }
}

Headlamp.registerPlugin('pod-counter', new PodCounterPlugin());
```

Here is the result, running Headlamp with this plugin and using with a Minikube cluster:

![screenshot showing a label on the top bar with the number of pods available](./podcounter_screenshot.png)

Please refer to the [functionality](./functionality.md) section for learning about
the different functionality that is available to plugins by the registry.
