/**
 * ## Simple plugin example
 *
 *
 * @example
 * // Here's a very simple JavaScript plugin example, that does nothing.
 * const myPlugin = {
 *   initialize: (register) => {
 *     // do some stuff with register (see below)
 *     // use some libraries in window.pluginLib (see below)
 *     alert('myPlugin initialized!')
 *     return true;
 *   }
 * }
 * window.registerPlugin("My Plugin ID String", myPlugin)
 *
 *
 * ## Entry point
 *
 * initializePlugins is the main entry point, and it is called by App.tsx near the beginning.
 *
 * ## Loading JavaScript files/URLs, which register Plugins
 *
 * External JavaScripts are first loaded from the "/plugins/list" URL of URLs into the browser.
 * The backend "server" can currently be configured to load plugins from a folder to make this list.
 *
 * Local in-development plugins are then loaded from the "frontend/src/plugin/plugins/" folder.
 *
 * Each of these JavaScripts are required to register plugins with
 * window.registerPlugin(pluginId, plugin)
 *
 * @see Plugin
 * @see registerPlugin
 *
 *
 * ## Initialize Plugin(s)
 *
 * Each Plugin should have an initialize(registry) method.
 * When they are initialized, they are given an Registry API object.
 *
 * @see Registry
 *
 *
 * ## Functions available to plugins.
 *
 * ### APIs added to the browser window object.
 *
 * Some attributes are added to the browser "window" global for use by plugins.
 *
 * - window.registerPlugin, so plugins can register themselves.
 * - window.plugins, a collection of plugins keyed by name.
 * - window.pluginLib, some libraries exposed to use by plugins.
 *
 * Third party Libraries in window.pluginLib that can be used by plugins.
 *
 * - ReactRedux, {@link https://www.npmjs.com/package/@material-ui/core @material-ui/core}
 * - MuiStyles, {@link https://www.npmjs.com/package/@material-ui/styles @material-ui/styles}
 * - React, {@link https://www.npmjs.com/package/react react}
 * - ReactRedux, {@link https://www.npmjs.com/package/react-redux react-redux}
 * - Iconify, {@link https://www.npmjs.com/package/@iconify/react @iconify/react}
 * - Lodash, {@link https://www.npmjs.com/package/lodash lodash}
 *
 * Headlamp libraries in window.pluginLib
 *
 * - CommonComponents, components/common, see `npm run storybook` in the headlamp/frontend repo.
 * - K8s, frontend/src/lib/k8s
 * - Utils frontend/src/lib/util
 */
import helpers from '../helpers';
import Registry from './registry';

// @todo: types for CommonComponents, K8s, and Utils should be put into plugins-pkg.
//        Because available in window.pluginLib.

/**
 * Plugins should call registerPlugin(pluginId: string, pluginObj: Plugin) to register themselves.
 *
 * They will have their initialize(register) method called at plugin initialization time.
 */
export abstract class Plugin {
  /**
   * initialize is called for each plugin with a Registry which gives the plugin methods for doing things.
   *
   * @see Registry
   */
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
};

// @todo: should window.plugins be private?
// @todo: Should all the plugin objects be in a single window.Headlamp object?
window.plugins = {};

/**
 * Got a new plugin to add? Well, registerPlugin is your friend.
 *
 * @param pluginId - a unique id string for your plugin.
 * @param pluginObj - the plugin being added.
 *
 * @example
 *
 * ```javascript
 * const myPlugin = {
 *   initialize: (register) => {
 *     // do some stuff with register
 *     // use some libraries in window.pluginLib
 *     return true;
 *   }
 * }
 * registerPlugin("aPluginIdString", myPlugin)
 * ```
 */
function registerPlugin(pluginId: string, pluginObj: Plugin) {
  // @todo: what happens if this plugin exists? (and is already initialized?)
  //        Should it raise an error? Silently keep going? Do we need quit() methods on plugins?
  window.plugins[pluginId] = pluginObj;
}

window.registerPlugin = registerPlugin;

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
