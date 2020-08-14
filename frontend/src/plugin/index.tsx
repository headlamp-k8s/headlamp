import loadScripts from './loadPlugins';
import Registry from './registry';

abstract class Plugin {
    abstract initialize(register: Registry): boolean;
}

declare global {
  interface Window {
    pluginLib: {
      [libName: string]: any;
    };
    plugins: {
      [pluginId: string]: Plugin;
    };
    registerPlugin: (pluginId: string, pluginObj: Plugin) => void;
  }
}

window.pluginLib = {
  K8s: require('../lib/k8s'),
  CommonComponents: require('../components/common'),
  MuiCore: require('@material-ui/core'),
  MuiStyles: require('@material-ui/styles'),
  React: require('react'),
  ReactRedux: require('react-redux'),
  Utils: require('../lib/util'),
  Iconify: require('@iconify/react'),
  Lodash: require('lodash')
};

window.plugins = {};

function registerPlugin(pluginId: string, pluginObj: Plugin) {
  window.plugins[pluginId] = pluginObj;
}

window.registerPlugin = registerPlugin;

export function initializePlugins() {
  fetch('/plugins/list')
    .then((response) => response.json())
    .then((pluginsScriptURLS) => {
      loadScripts(pluginsScriptURLS || [], () => {
      // Call initialize on every plugin
        for (const plugin of Object.values(window.plugins)) {
          plugin.initialize(new Registry());
        }
      });
    });
}
