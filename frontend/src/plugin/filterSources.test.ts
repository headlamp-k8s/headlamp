import { describe, expect, test } from '@jest/globals';
import { filterSources } from './index';
import { PluginInfo } from './pluginsSlice';

describe('filterSources tests', () => {
  test('when sources is empty, it also returns an empty array', () => {
    const sources: string[] = [];
    const packageInfos: PluginInfo[] = [];
    const settingsPackages = undefined;
    const appMode = false;

    const filtered = filterSources(sources, packageInfos, appMode, settingsPackages);
    expect(filtered.length).toBe(0);
  });

  test('When not in app mode all sources are used', () => {
    const sources = ['source1'];
    const packageInfos = [
      {
        name: 'ourplugin1',
        description: 'package description1',
        homepage: 'https://example.com/1',
        version: '1.0.0',
        author: 'author1',
      },
    ];
    const settingsPackages = undefined;
    const appMode = false;

    const filtered = filterSources(sources, packageInfos, appMode, settingsPackages);
    expect(filtered[0]).toBe('source1');
  });

  test('packages not enabled are not returned', () => {
    const sources = ['source1'];
    const packageInfos = [
      {
        name: 'ourplugin1',
        description: 'package description1',
        homepage: 'https://example.com/1',
        version: '1.0.0',
        author: 'author1',
      },
    ];
    const settingsPackages = [
      {
        name: 'ourplugin1',
        description: 'package description1',
        homepage: 'https://example.com/1',
        version: '1.0.0',
        author: 'author1',
        isEnabled: false,
      },
    ];
    const appMode = true;

    const filtered = filterSources(sources, packageInfos, appMode, settingsPackages);
    expect(filtered.length).toBe(0);
  });

  test('enabled packages are returned', () => {
    const sources = ['source1'];
    const packageInfos = [
      {
        name: 'ourplugin1',
        description: 'package description1',
        homepage: 'https://example.com/1',
        version: '1.0.0',
        author: 'author1',
      },
      {
        name: 'ourplugin2',
        description: 'package description2',
        homepage: 'https://example.com/2',
        version: '1.0.0',
        author: 'author2',
      },
    ];
    const settingsPackages = [
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
        homepage: 'https://example.com/2',
        version: '1.0.0',
        author: 'author2',
        isEnabled: false,
      },
    ];
    const appMode = true;

    const filtered = filterSources(sources, packageInfos, appMode, settingsPackages);
    expect(filtered.length).toBe(1);
    expect(filtered[0]).toBe('source1');
  });
});
