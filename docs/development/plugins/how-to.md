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

## Hello Kubernetes

The following example will show a basic plugin declaration and registration
in a file that should match the `src/index.tsx` structure explained in the
[building](./building) section.

```tsx
import { registerAppBarAction } from '@kinvolk/headlamp-plugin/lib';
registerAppBarAction(<span>Hello Kubernetes</span>);
```

## Plugin Example

Let's create a plugin that just gets the number of pods in the cluster and
displays that information in the top bar (i.e. registers an "app bar action").

```tsx
import { K8s, registerAppBarAction } from '@kinvolk/headlamp-plugin/lib';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyle = makeStyles(() => ({
  pods: {
    fontStyle: 'italic',
  },
}));

function PodCounter() {
  const classes = useStyle();
  const [pods, error] = K8s.ResourceClasses.Pod.useList();
  const msg = pods === null ? 'Loading…' : pods.length.toString();

  return (
    <Typography color="textPrimary" className={classes.pods}>
      {!error ? `# Pods: ${msg}` : 'Uh, pods!?'}
    </Typography>
  );
}

registerAppBarAction(<PodCounter />);
```

Here is the result, running Headlamp with this plugin and using with a Minikube cluster:

![screenshot showing a label on the top bar with the number of pods available](./images/podcounter_screenshot.png)

Please refer to the [functionality](./functionality.md) section for learning about
the different functionality that is available to plugins by the registry.
