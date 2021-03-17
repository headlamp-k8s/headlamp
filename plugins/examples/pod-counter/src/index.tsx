import { Plugin } from '@kinvolk/headlamp-plugin/types/plugin/index.d';
import Registry from '@kinvolk/headlamp-plugin/types/plugin/registry.d';

const pluginLib = window.pluginLib;
const React = window.pluginLib.React;
const K8s = pluginLib.K8s.ResourceClasses;
const { Typography } = pluginLib.MuiCore;

function PodCounter() {
  const [pods, error] = K8s.Pod.useList();
  const msg = pods === null ? 'Loading…' : pods.length.toString();

  return (
      <Typography color="textPrimary">{!error ? `# Pods: ${msg}` : 'Uh, pods!?'}</Typography>
  );
}

class PodCounterPlugin implements Plugin {
  initialize(register: Registry) {
    register.registerAppBarAction('monitor', () =>
      <PodCounter />
    );

    return true;
  }
}

window.registerPlugin('pod-counter', new PodCounterPlugin());