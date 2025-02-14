import '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import semver from 'semver';
import helpers from '../../../../helpers';
import { PluginInfo, PluginSettings } from '../../../../plugin/pluginsSlice';
import { backendFetch } from './fetch';

/*
 * this function is used for the plugin settings and is extended from the original `fetchAndExecutePlugins` function in the Plugins.tsx file
 * - the function is used to fetch the plugins from the backend and return the plugins with their settings
 * - it will also do a compatibility check for the plugins and return the plugins with their compatibility status,
 * - the compatibility check is needed to render the plugin switches
 */
export async function getPlugins(pluginSettings: PluginSettings[]) {
  const pluginPaths = (await fetch(`${helpers.getAppUrl()}plugins`).then(resp =>
    resp.json()
  )) as string[];

  const packageInfosPromise = await Promise.all<PluginInfo>(
    pluginPaths.map(path =>
      backendFetch(`${path}/package.json`).then(resp => {
        if (!resp.ok) {
          if (resp.status !== 404) {
            return Promise.reject(resp);
          }

          console.warn(
            'Missing package.json. ' +
              `Please upgrade the plugin ${path}` +
              ' by running "headlamp-plugin extract" again.' +
              ' Please use headlamp-plugin >= 0.8.0'
          );

          return {
            name: path.split('/').slice(-1)[0],
            version: '0.0.0',
            author: 'unknown',
            description: '',
          };
        }
        return resp.json();
      })
    )
  );

  const packageInfos = await packageInfosPromise;

  const pluginsWithIsEnabled = packageInfos.map(plugin => {
    const matchedSetting = pluginSettings.find(p => plugin.name === p.name);
    if (matchedSetting) {
      const compatibleVersion = '>=0.8.0-alpha.3';

      const isCompatible = semver.satisfies(
        semver.coerce(plugin.devDependencies?.['@kinvolk/headlamp-plugin']) || '',
        compatibleVersion
      );

      return {
        ...plugin,
        settingsComponent: matchedSetting.settingsComponent,
        displaySettingsComponentWithSaveButton:
          matchedSetting.displaySettingsComponentWithSaveButton,
        isEnabled: matchedSetting.isEnabled,
        isCompatible: isCompatible,
      };
    }
    return plugin;
  });

  return pluginsWithIsEnabled;
}

export function usePlugins(pluginSettings: { name: string; isEnabled: boolean }[]) {
  // takes two params, the key and the function that will be called to get the data
  return useQuery({ queryKey: ['plugins'], queryFn: () => getPlugins(pluginSettings) });
}
