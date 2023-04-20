import { describe, expect, test } from '@jest/globals';
import { updateSettingsPackages } from './index';
import { PluginInfo } from './pluginsSlice';

describe('updateSettingsPackages tests', () => {
  test('when sources is empty, it also returns an empty array', () => {
    const plugins = updateSettingsPackages([], []);
    expect(plugins.length).toBe(0);
  });

  test('when there are new backend plugins and no settings plugins', () => {
    const backendPlugins: PluginInfo[] = [
      {
        name: 'ourplugin1',
        description: 'package description1',
        homepage: 'https://example.com/1',
        version: '1.0.0',
        author: 'author1',
      },
    ];
    const settingsPlugins: PluginInfo[] = [];
    const updatedSettingsPlugins = updateSettingsPackages(backendPlugins, settingsPlugins);
    expect(updatedSettingsPlugins.length).toBe(1);
    expect(updatedSettingsPlugins[0].isEnabled).toBe(true);
  });

  test('when there is an existing setting already turned to true by user', () => {
    const backendPlugins: PluginInfo[] = [
      {
        name: 'ourplugin1',
        description: 'package description1',
        homepage: 'https://example.com/1',
        version: '1.0.0',
        author: 'author1',
      },
    ];
    const settingsPlugins: PluginInfo[] = [
      {
        name: 'ourplugin1',
        description: 'package description1',
        homepage: 'https://example.com/1',
        version: '1.0.0',
        author: 'author1',
        isEnabled: true,
      },
      {
        name: 'ourplugin2',
        description: 'package description2',
        homepage: 'https://example.com/1',
        version: '1.0.0',
        author: 'author2',
        isEnabled: true,
      },
    ];
    const updatedSettingsPlugins = updateSettingsPackages(backendPlugins, settingsPlugins);
    expect(updatedSettingsPlugins.length).toBe(1);
    expect(updatedSettingsPlugins[0].isEnabled).toBe(true);
    expect(updatedSettingsPlugins[0].name).toBe('ourplugin1');
  });

  test('when a setting exists, but then is removed from the backend', () => {
    const backendPlugins: PluginInfo[] = [];
    const settingsPlugins: PluginInfo[] = [
      {
        name: 'ourplugin1',
        description: 'package description1',
        homepage: 'https://example.com/1',
        version: '1.0.0',
        author: 'author1',
        isEnabled: true,
      },
    ];
    const updatedSettingsPlugins = updateSettingsPackages(backendPlugins, settingsPlugins);
    expect(updatedSettingsPlugins.length).toBe(0);
  });
});
