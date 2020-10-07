import Registry from './registry';

export abstract class Plugin {
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

function loadScripts(array: string[], onLoadFinished: () => void) {
  var loader = function(src: string, handler: () => void) {
    const script: HTMLScriptElement = document.createElement('script');
    script.src = src;
    script.onload = (script as any).onreadystatechange = function() {
      (script as any).onreadystatechange = script.onload = null;
      handler();
    };
    const head = document.getElementsByTagName('head')[0];
    (head || document.body).appendChild(script);
  };
  (function run() {
    if (array.length !== 0) {
      loader(array.shift() as string, run);
    } else {
      onLoadFinished && onLoadFinished();
    }
  })();
}

function loadExternalPlugins() {
  return new Promise(resolve => {
    fetch('/plugins/list')
      .then((response) => response.json())
      .then((pluginsScriptURLS) => {
        loadScripts(pluginsScriptURLS || [], resolve);
      });
  });
}

function loadDevPlugins() {
  // Dev / local plugins:
  // This logic is for helping develop "plugins". i.e. we develop the plugins
  // together with the frontend, and once the core of their functionality is done
  // they should be moved outside to their own location.
  // If Headlamp should be built directly with a "plugin" as part of it (instead of
  // being an external plugin), this is the location for that.
  const context = require.context(
    './plugins', // Context folder
    true, // Include subdirectories
    // Include one subdirectory level that has an index.js file
    /^\.\/[a-zA-Z_\-0-9]+\/index\.(js|ts|tsx)+$/
  );

  // Load the dev / local plugins
  for (const module of context.keys()) {
    context(module);
  }
}

export async function initializePlugins() {
  // Load external plugins
  await loadExternalPlugins();
  await loadDevPlugins();

  return new Promise(resolve => {
    // Initialize every plugin
    for (const plugin of Object.values(window.plugins)) {
      plugin.initialize(new Registry());
    }
    resolve();
  });
}
