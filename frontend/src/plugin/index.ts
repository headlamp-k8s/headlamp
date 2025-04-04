/**
 * The index.ts should have the functions that Headlamp itself needs for
 * loading the plugins.
 * The lib.ts file should carry the bits to be used by plugins whereas
 */
import * as Iconify from '@iconify/react';
import * as ReactMonacoEditor from '@monaco-editor/react';
import * as MuiLab from '@mui/lab';
import * as MuiMaterial from '@mui/material';
import * as MuiMaterialStyles from '@mui/material/styles';
import { styled } from '@mui/system';
import * as Lodash from 'lodash';
import * as MonacoEditor from 'monaco-editor';
import * as Notistack from 'notistack';
import * as React from 'react';
import * as ReactJSX from 'react/jsx-runtime';
import * as ReactDOM from 'react-dom';
import * as ReactRedux from 'react-redux';
import * as ReactRouter from 'react-router-dom';
import * as Recharts from 'recharts';
import * as CommonComponents from '../components/common';
import helpers from '../helpers';
import * as K8s from '../lib/k8s';
import { checkCompatibleVersion, getPluginPaths, getPlugins } from '../lib/k8s/api/v2/plugins';
import * as ApiProxy from '../lib/k8s/apiProxy';
import * as Crd from '../lib/k8s/crd';
import * as Notification from '../lib/notification';
import * as Router from '../lib/router';
import * as Utils from '../lib/util';
import { eventAction, HeadlampEventType } from '../redux/headlampEventSlice';
import store from '../redux/stores/store';
import { ConfigStore } from './configStore';
import { Headlamp, Plugin } from './lib';
import { PluginInfo } from './pluginsSlice';
import Registry, * as registryToExport from './registry';

window.pluginLib = {
  ApiProxy,
  ReactMonacoEditor: {
    ...ReactMonacoEditor,
    // required for compatibility with plugins built with webpack
    __esModule: true,
  },
  MonacoEditor,
  K8s,
  ConfigStore,
  Crd: {
    ...Crd,
    // required for compatibility with plugins built with webpack
    __esModule: true,
  },
  CommonComponents,
  MuiMaterial: {
    ...MuiMaterial,
    styles: MuiMaterialStyles,
  },
  /**
   * @mui/styles is not compatible with React.StrictMode or React 18, and it will not be updated.
   * Workaround is using styled function from @mui/system
   */
  MuiStyles: {
    makeStyles: styled,
  },
  MuiLab,
  React,
  ReactJSX,
  ReactDOM,
  Recharts,
  ReactRouter,
  ReactRedux,
  Router,
  Utils,
  Iconify,
  Lodash,
  Notistack,
  Notification,
  Headlamp,
  Plugin,
  ...registryToExport,
};

// backwards compat.
window.pluginLib.MuiCore = window.pluginLib.MuiMaterial;

// @todo: should window.plugins be private?
// @todo: Should all the plugin objects be in a single window.Headlamp object?
window.plugins = {};

/**
 * Load plugins in the frontend/src/plugin/plugins/ folder.
 *
 * Plugins can be developed inside the headlamp repo.
 * Move them out of the repo to an external location when they are ready.
 *
 * @see Plugin
 */
function loadDevPlugins() {
  import.meta.glob(['./plugins/*.index.{js,ts,tsx}'], { eager: true });
}

/**
 * Load external, then local plugins. Then initialize() them in order with a Registry.
 */
export async function initializePlugins() {
  await loadDevPlugins();

  // Initialize every plugin in the order they were loaded.
  return new Promise(resolve => {
    for (const pluginName of Object.keys(window.plugins)) {
      const plugin = window.plugins[pluginName];
      try {
        // @todo: what should happen if this fails?
        plugin.initialize(new Registry());
      } catch (e) {
        console.error(`Plugin initialize() error in ${pluginName}:`, e);
      }
    }
    resolve(undefined);
  });
}

/**
 * This can be used to filter out which of the plugins we should execute.
 *
 * @param sources array of source to execute. Has the same order as packageInfos.
 * @param packageInfos array of package.json contents
 * @param appMode if we are in app mode
 * @param settingsPackages the packages from settings
 *
 * @returns the sources to execute and incompatible PackageInfos
 *          with this structure { sourcesToExecute, incompatiblePackageInfos }
 */
export function filterSources(
  sources: string[],
  packageInfos: PluginInfo[],
  appMode: boolean,
  settingsPackages?: PluginInfo[],
  disableCompatibilityCheck?: boolean
) {
  const incompatiblePlugins: Record<string, PluginInfo> = {};

  // combine the parallel arrays
  const sourcesAndPackageInfos = sources.map((source, i) => {
    return { source, packageInfo: packageInfos[i] };
  });

  const enabledSourcesAndPackageInfos = sourcesAndPackageInfos.filter(({ packageInfo }) => {
    // When not in appMode we don't have settings to enable plugins.
    if (!appMode) {
      return true;
    }

    // No plugins should be enabled if settings are not set.
    if (!settingsPackages) {
      return false;
    }

    // settingsPackages might have a different order or length than packageInfos
    // If it's not in the settings don't enable the plugin.
    const enabledInSettings =
      settingsPackages[settingsPackages.findIndex(x => x.name === packageInfo.name)]?.isEnabled ===
      true;
    return enabledInSettings;
  });

  const checkAllVersion = disableCompatibilityCheck;

  const compatible = enabledSourcesAndPackageInfos.filter(({ packageInfo }) => {
    const isCompatible = checkCompatibleVersion(packageInfo, checkAllVersion);

    if (!isCompatible) {
      incompatiblePlugins[packageInfo.name] = packageInfo;
      return false;
    }
    return true;
  });

  return {
    sourcesToExecute: compatible.map(({ source }) => source),
    incompatiblePlugins,
  };
}

/**
 * Gives back updates settings from the backend.
 *
 * If there are new plugins, it includes the new ones with isEnabled=true.
 *
 * If plugins are not there anymore in the backend list,
 * then it removes them from the settings list of plugins.
 *
 * @param backendPlugins the list of plugins info from the backend.
 * @param settingsPlugins the list of plugins the settings already knows about.
 * @returns plugin info for the settings.
 */
export function updateSettingsPackages(
  backendPlugins: PluginInfo[],
  settingsPlugins: { name: string; isEnabled: boolean }[]
): PluginInfo[] {
  if (backendPlugins.length === 0) return [];

  const pluginsChanged =
    backendPlugins.length !== settingsPlugins.length ||
    JSON.stringify(backendPlugins.map(p => p.name).sort()) !==
      JSON.stringify(settingsPlugins.map(p => p.name).sort());

  if (!pluginsChanged) {
    const updatedPlugins = backendPlugins.filter(plugin =>
      settingsPlugins.some(setting => setting.name === plugin.name)
    );

    return updatedPlugins;
  }

  return backendPlugins.map(plugin => {
    const index = settingsPlugins.findIndex(x => x.name === plugin.name);
    if (index === -1) {
      // It's a new one settings doesn't know about so we do not enable it by default
      return {
        ...plugin,
        isEnabled: true,
      };
    }
    return {
      ...settingsPlugins[index],
      ...plugin,
    };
  });
}

/**
 * Get the list of plugins,
 *   download all the plugin source,
 *   download all the plugin package.json files,
 *   execute the plugins,
 *   .initialize() plugins that register (not all do).
 *
 * @param settingsPackages The packages settings knows about.
 * @param onSettingsChange Called when the plugins are different to what is in settings.
 * @param onIncompatible Called when there are incompatible plugins.
 *
 */
export async function fetchAndExecutePlugins(
  settingsPackages: { name: string; isEnabled: boolean }[],
  onSettingsChange: (plugins: PluginInfo[]) => void,
  onIncompatible: (plugins: Record<string, PluginInfo>) => void
) {
  const pluginPaths = await getPluginPaths();

  const sourcesPromise = Promise.all(
    pluginPaths.map(path =>
      fetch(`${helpers.getAppUrl()}${path}/main.js`).then(resp => resp.text())
    )
  );

  const packageInfosPromise = await getPlugins(settingsPackages);

  const sources = await sourcesPromise;
  const packageInfos = await packageInfosPromise;

  const updatedSettingsPackages = updateSettingsPackages(packageInfos, settingsPackages);
  const settingsChanged = packageInfos.length !== settingsPackages.length;
  if (settingsChanged) {
    onSettingsChange(updatedSettingsPackages);
  }

  const { sourcesToExecute, incompatiblePlugins } = filterSources(
    sources,
    packageInfos,
    helpers.isElectron(),
    updatedSettingsPackages
  );

  if (Object.keys(incompatiblePlugins).length > 0) {
    onIncompatible(incompatiblePlugins);
  }

  const packagesIncompatibleSet: PluginInfo[] = updatedSettingsPackages.map(
    (plugin: PluginInfo) => {
      return {
        ...plugin,
        isCompatible: !incompatiblePlugins[plugin.name],
      };
    }
  );
  onSettingsChange(packagesIncompatibleSet);

  sourcesToExecute.forEach((source, index) => {
    // Execute plugins inside a context (not in global/window)
    (function (str: string) {
      try {
        const pluginName = packageInfos[index].name.split('/').slice(-1)[0];
        // Giving an evaled code a filename will make it easier to use source maps
        const sourceMapPath = `\n//# sourceURL=//${pluginName}/dist/main.js`;
        const result = eval(str + sourceMapPath);
        return result;
      } catch (e) {
        // We just continue if there is an error.
        console.error(`Plugin execution error in ${pluginPaths[index]}:`, e);
        store.dispatch(
          eventAction({
            type: HeadlampEventType.PLUGIN_LOADING_ERROR,
            data: {
              pluginInfo: { name: packageInfos[index].name, version: packageInfos[index].version },
              error: e,
            },
          })
        );
      }
    }).call({}, source);
  });
  await initializePlugins();

  const pluginsLoaded = updatedSettingsPackages.map(plugin => ({
    name: plugin.name,
    version: plugin.version,
    isEnabled: plugin.isEnabled,
  }));

  store.dispatch(
    eventAction({
      type: HeadlampEventType.PLUGINS_LOADED,
      data: { plugins: pluginsLoaded },
    })
  );
}
