import { Headlamp, K8s, Plugin, Registry } from '@kinvolk/headlamp-plugin/lib';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

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

class PodCounterPlugin extends Plugin {
  initialize(registry: Registry) {
    registry.registerAppBarAction('pod-counter-action', () => <PodCounter />);
    return true;
  }
}

Headlamp.registerPlugin('pod-counter', new PodCounterPlugin());
