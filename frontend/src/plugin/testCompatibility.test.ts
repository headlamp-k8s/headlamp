import { describe, expect, test } from '@jest/globals';
import { getPluginEngineVersion, isCompatiblePluginVersion } from './index';
import { PluginInfo } from './pluginsSlice';

const basePlugin: PluginInfo = {
  name: 'our-plugin',
  description: 'package description',
  homepage: 'https://example.com/plugin',
  version: '1.0.0',
  author: 'me',
};

describe('plugin compatibility test', () => {
  test('no filter when Headlamp has no minimum engine version', () => {
    expect(getPluginEngineVersion(basePlugin)).toBe(undefined);
    expect(isCompatiblePluginVersion(basePlugin, '')).toBe(true);

    const myPlugin = { ...basePlugin };
    myPlugin.engines = {
      headlampPlugin: '2.5.0',
    };
    expect(getPluginEngineVersion(myPlugin)).toBe('2.5.0');
    expect(isCompatiblePluginVersion(myPlugin, '')).toBe(true);
  });

  test('filter plugins with no version set', () => {
    expect(getPluginEngineVersion(basePlugin)).toBe(undefined);
    expect(isCompatiblePluginVersion(basePlugin, '>=1.0.0')).toBe(false);
  });

  test('filter plugins with version set as engine', () => {
    const myPlugin = { ...basePlugin };
    myPlugin.engines = {
      headlampPlugin: '2.5.0',
    };
    expect(getPluginEngineVersion(myPlugin)).toBe('2.5.0');
    expect(isCompatiblePluginVersion(myPlugin, '>=2.0.0')).toBe(true);

    myPlugin.engines = {
      headlampPlugin: '1.6.0',
    };

    expect(isCompatiblePluginVersion(myPlugin, '>=2.0.0')).toBe(false);
  });

  test('filter plugins with version set from dependency', () => {
    const myPlugin = { ...basePlugin };
    myPlugin.devDependencies = {
      '@kinvolk/headlamp-plugin': '2.5.0',
    };

    expect(getPluginEngineVersion(myPlugin)).toBe('2.5.0');
    expect(isCompatiblePluginVersion(myPlugin, '>=2.x')).toBe(true);
  });
});
