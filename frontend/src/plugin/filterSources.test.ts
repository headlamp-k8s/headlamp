import { filterSources } from './index';
import { PluginInfo } from './pluginsSlice';

describe('filterSources', () => {
  test('when sources is empty, it also returns an empty array', () => {
    const sources: string[] = [];
    const packageInfos: PluginInfo[] = [];
    const enabledPlugins: Record<string, boolean> = {};
    const appMode = false;

    const { sourcesToExecute } = filterSources(
      sources,
      packageInfos,
      enabledPlugins,
      appMode,
      '>=0.8.0-alpha.3'
    );
    expect(sourcesToExecute.length).toBe(0);
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
        devDependencies: {
          '@kinvolk/headlamp-plugin': '^0.8.0-alpha.3',
        },
      },
    ];
    const enabledPlugins: Record<string, boolean> = {};
    const appMode = false;

    const { sourcesToExecute, incompatiblePlugins } = filterSources(
      sources,
      packageInfos,
      enabledPlugins,
      appMode,
      '>=0.8.0-alpha.3'
    );
    expect(Object.keys(incompatiblePlugins).length).toBe(0);
    expect(sourcesToExecute[0]).toBe('source1');
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
    const enabledPlugins: Record<string, boolean> = {
      ourplugin1: false,
    };
    const appMode = true;
    const { sourcesToExecute } = filterSources(
      sources,
      packageInfos,
      enabledPlugins,
      appMode,
      '>=0.8.0-alpha.3',
      settingsPackages
    );

    expect(sourcesToExecute.length).toBe(0);
  });

  test('enabled packages are returned', () => {
    const sources = ['source1', 'source2'];
    const packageInfos = [
      {
        name: 'ourplugin1',
        description: 'package description1',
        homepage: 'https://example.com/1',
        version: '1.0.0',
        author: 'author1',
        devDependencies: {
          '@kinvolk/headlamp-plugin': '^0.8.0-alpha.3',
        },
      },
      {
        name: 'ourplugin2',
        description: 'package description2',
        homepage: 'https://example.com/2',
        version: '1.0.0',
        author: 'author2',
        devDependencies: {
          '@kinvolk/headlamp-plugin': '^0.8.0-alpha.3',
        },
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
    const enabledPlugins: Record<string, boolean> = {
      ourplugin1: true,
      ourplugin2: false,
    };
    const appMode = true;
    const { sourcesToExecute } = filterSources(
      sources,
      packageInfos,
      enabledPlugins,
      appMode,
      '>=0.8.0-alpha.3',
      settingsPackages
    );

    expect(sourcesToExecute.length).toBe(1);
    expect(sourcesToExecute[0]).toBe('source1');
  });

  test('incompatible packages are not included', () => {
    const sources = ['source1', 'source2'];
    const packageInfos = [
      {
        name: 'ourplugin1',
        description: 'package description1',
        homepage: 'https://example.com/1',
        version: '1.0.0',
        author: 'author1',
        devDependencies: {
          '@kinvolk/headlamp-plugin': '^0.6.0', // set to an older version
        },
      },
      {
        name: 'ourplugin2',
        description: 'package description2',
        homepage: 'https://example.com/2',
        version: '1.0.0',
        author: 'author2',
        devDependencies: {
          '@kinvolk/headlamp-plugin': '^0.8.0-alpha.3',
        },
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
        isEnabled: true,
      },
    ];
    const enabledPlugins: Record<string, boolean> = {
      ourplugin1: true,
      ourplugin2: true,
    };
    const appMode = true;
    const { sourcesToExecute, incompatiblePlugins } = filterSources(
      sources,
      packageInfos,
      enabledPlugins,
      appMode,
      '>=0.8.0-alpha.3',
      settingsPackages
    );

    expect(sourcesToExecute.length).toBe(1);
    expect(sourcesToExecute[0]).toBe('source2');
    expect(incompatiblePlugins['ourplugin1']).toBeDefined();

    // Now let's check it works ok with compatibility check disabled
    const disabledCompatCheck = filterSources(
      sources,
      packageInfos,
      enabledPlugins,
      appMode,
      '', // empty string disables compatibility check
      settingsPackages
    );

    expect(disabledCompatCheck.sourcesToExecute.length).toBe(2);
    expect(disabledCompatCheck.sourcesToExecute[0]).toBe('source1');
    expect(disabledCompatCheck.sourcesToExecute[1]).toBe('source2');
    expect(disabledCompatCheck.incompatiblePlugins['ourplugin1']).not.toBeDefined();
  });
});
