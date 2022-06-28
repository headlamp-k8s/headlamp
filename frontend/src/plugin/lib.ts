/**
 * The lib.ts file should carry the bits to be used by plugins whereas
 * the index.ts should have the functions that Headlamp itself needs for
 * loading the plugins.
 */

/**
 * ## Simple plugin example
 *
 *
 * @example
 * // Here's a very simple JavaScript plugin example, that does nothing.
 * import { Headlamp } from '@kinvolk/headlamp-plugin/lib';
 *
 * const myPlugin = {
 *   initialize: (register) => {
 *     // do some stuff with register (see below)
 *     // use some libraries in window.pluginLib (see below)
 *     alert('myPlugin initialized!')
 *     return true;
 *   }
 * }
 *
 * Headlamp.registerPlugin("My Plugin ID String", myPlugin)
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
 * Headlamp.registerPlugin(pluginId, plugin)
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
 * - MuiCore, {@link https://www.npmjs.com/package/@material-ui/core @material-ui/core}
 * - MuiStyles, {@link https://www.npmjs.com/package/@material-ui/styles @material-ui/styles}
 * - React, {@link https://www.npmjs.com/package/react react}
 * - ReactDOM, {@link https://www.npmjs.com/package/react-dom react-dom}
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
import { ClusterRequest, setCluster } from '../lib/k8s/apiProxy';
import Registry from './registry';

/**
 * Plugins should call Headlamp.registerPlugin(pluginId: string, pluginObj: Plugin) to register themselves.
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

/**
 * This class is a more convenient way for plugins to call registerPlugin in order to register
 * themselves.
 */
export abstract class Headlamp {
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
   *
   * Headlamp.registerPlugin("aPluginIdString", myPlugin)
   * ```
   */
  static registerPlugin(pluginId: string, pluginObj: Plugin) {
    // @todo: what happens if this plugin exists? (and is already initialized?)
    //        Should it raise an error? Silently keep going? Do we need quit() methods on plugins?
    window.plugins[pluginId] = pluginObj;
  }

  /**
   * Configure (or update) a cluster that can then be used throughout Headlamp.
   * If the request is succesful, successive calls to `K8s.useClustersConf()` will show the newly configured cluster.
   *
   * **Important:** This is only available in the desktop version and will result in a bad request when running in-cluster.
   *
   * @param clusterReq - the cluster to be added or updated.
   * @returns a promise which completes to Headlamp's configuration (showing the list of configured clusters).
   */
  static setCluster(clusterReq: ClusterRequest) {
    return setCluster(clusterReq).catch(e => {
      console.error(e);
    });
  }
}

window.registerPlugin = Headlamp.registerPlugin;
