import React from 'react';
import { Headlamp, Plugin, Registry, K8s } from '@kinvolk/headlamp-plugin/lib';
import { Typography } from '@material-ui/core';

// import { SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';

function PodCounter() {
  const [pods, error] = K8s.ResourceClasses.Pod.useList();
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
