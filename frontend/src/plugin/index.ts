/**
 * The index.ts should have the functions that Headlamp itself needs for
 * loading the plugins.
 * The lib.ts file should carry the bits to be used by plugins whereas
 */

import helpers from '../helpers';
import { UI_RESET_PLUGIN_VIEWS } from '../redux/actions/actions';
import store from '../redux/stores/store';
import { Headlamp, Plugin } from './lib';
import Registry from './registry';

window.pluginLib = {
  ApiProxy: require('../lib/k8s/apiProxy'),
  K8s: require('../lib/k8s'),
  CommonComponents: require('../components/common'),
  MuiCore: require('@material-ui/core'),
  MuiStyles: require('@material-ui/styles'),
  React: require('react'),
  Recharts: require('recharts'),
  ReactRouter: require('react-router-dom'),
  ReactRedux: require('react-redux'),
  Utils: require('../lib/util'),
  Iconify: require('@iconify/react'),
  Lodash: require('lodash'),
  Notistack: require('notistack'),
  Headlamp,
  Plugin,
};

// @todo: should window.plugins be private?
// @todo: Should all the plugin objects be in a single window.Headlamp object?
window.plugins = {};

/**
 * Loads JavaScripts one at a time, in order, then calls onLoadFinished().
 *
 * @param array - of JavaScript URLs
 * @param onLoadFinished - callback when all of the scripts have finished loading.
 */
function loadScripts(array: string[], onLoadFinished: (value?: any) => void) {
  // @todo: doesn't seem to handle errors.
  var loader = function (src: string, handler: () => void) {
    const script: HTMLScriptElement = document.createElement('script');
    script.src = src;
    if (process.env.NODE_ENV !== 'production') {
      script.crossOrigin = 'anonymous';
    }
    script.onload = (script as any).onreadystatechange = function () {
      (script as any).onreadystatechange = script.onload = null;
      handler();
    };
    const head = document.getElementsByTagName('head')[0];
    (head || document.body).appendChild(script);
  };
  (function run() {
    if (array.length !== 0) {
      const src = `${helpers.getAppUrl()}${array.shift()}`;
      loader(src, run);
    } else {
      onLoadFinished && onLoadFinished();
    }
  })();
}

/**
 * Load JavaScripts into the browser from URLS provided by a "/plugins/list".
 */
function loadExternalPlugins() {
  return new Promise(resolve => {
    fetch(`${helpers.getAppUrl()}plugins/list`)
      .then(response => response.json())
      .then(pluginsScriptURLS => {
        loadScripts(pluginsScriptURLS || [], resolve);
      });
  });
}

/**
 * Load plugins in the frontend/src/plugin/plugins/ folder.
 *
 * Plugins can be developed inside the headlamp repo.
 * Move them out of the repo to an external location when they are ready.
 *
 * @see Plugin
 */
function loadDevPlugins() {
  const context = require.context(
    './plugins', // Context folder
    true, // Include subdirectories
    // Include one subdirectory level that has an index.js file
    /^\.\/[a-zA-Z_\-0-9]+\/index\.(js|ts|tsx)+$/
  );

  // @todo: keys() is non-deterministic here because filesystems can be non-deterministic.
  //        Loading plugins in sorted() order is probably less problematic.
  for (const module of context.keys()) {
    context(module);
  }
}

/**
 * Load external, then local plugins. Then initialize() them in order with a Registry.
 */
export async function initializePlugins() {
  // Reset plugins before initializing, or we could end up with duplicated
  // logic/views.
  window.plugins = {};
  store.dispatch({ type: UI_RESET_PLUGIN_VIEWS });

  await loadExternalPlugins();
  await loadDevPlugins();

  // Initialize every plugin in the order they were loaded.
  return new Promise(resolve => {
    for (const plugin of Object.values(window.plugins)) {
      // @todo: what should happen if this fails?
      // @todo: The return code is not checked? What is it for?
      plugin.initialize(new Registry());
    }
    resolve(undefined);
  });
}
