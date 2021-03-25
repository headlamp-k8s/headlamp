import { Plugin } from '@kinvolk/headlamp-plugin/types/plugin/index.d';
import Registry from '@kinvolk/headlamp-plugin/types/plugin/registry.d';

// const pluginLib = window.pluginLib;
// const React = window.pluginLib.React;
// const K8s = pluginLib.K8s.ResourceClasses;
// const { Typography } = pluginLib.MuiCore;

class MyPlugin implements Plugin {
  initialize(register: Registry) {
    console.log('$${name} initialized');
    return true;
  }
}

window.registerPlugin('$${name}', new MyPlugin());