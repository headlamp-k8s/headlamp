const PluginManager = require('./plugin-management.js');
const tmp = require('tmp');
const fs = require('fs');
const semver = require('semver');

// Mocking progressCallback function for testing
// eslint-disable-next-line
const mockProgressCallback = jest.fn(args => {
  // console.log("Progress Callback:", args);  // Uncomment for debugging
});

describe('PluginManager Test Cases', () => {
  let tempDir;

  beforeAll(() => {
    // Create a temporary directory before all tests
    tempDir = tmp.dirSync({ unsafeCleanup: true }).name;
  });

  afterAll(() => {
    // Remove the temporary directory after all tests
    fs.rmdirSync(tempDir, { recursive: true });
  });

  beforeEach(() => {
    // Initialize a new PluginManager instance before each test
    jest.clearAllMocks();
  });

  test('Install Plugin', async () => {
    await PluginManager.install(
      'https://artifacthub.io/packages/headlamp/test-123/appcatalog_headlamp_plugin',
      tempDir,
      '',
      mockProgressCallback
    );
    expect(mockProgressCallback).toHaveBeenCalledWith({
      type: 'success',
      message: 'Plugin Installed',
    });
  });

  test('List Plugins', () => {
    PluginManager.list(tempDir, mockProgressCallback);
    // Assuming "app-catalog" plugin is in the list of plugins
    expect(mockProgressCallback).toHaveBeenCalledWith({
      type: 'success',
      message: 'Plugins Listed',
      data: expect.any(Array),
    });
  });

  test('No Update available for Plugin', async () => {
    // No updates available for "app-catalog" plugin
    await PluginManager.update('app-catalog', tempDir, '', mockProgressCallback);
    expect(mockProgressCallback).toHaveBeenCalledWith({
      type: 'error',
      message: 'No updates available',
    });
  });

  test('Update Plugin', async () => {
    // update the "app-catalog" plugin package.json with lower state
    const packageJSONPath = `${tempDir}/appcatalog_headlamp_plugin/package.json`;
    const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath));
    packageJSON.artifacthub.version = `${semver.major(
      packageJSON.artifacthub.version
    )}.${semver.minor(packageJSON.artifacthub.version)}.${
      semver.patch(packageJSON.artifacthub.version) - 1
    }`; // Reduce the version using semver
    // Write the updated package.json back to the file
    fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2));

    await PluginManager.update('app-catalog', tempDir, '', mockProgressCallback);
    expect(mockProgressCallback).toHaveBeenCalledWith({
      type: 'success',
      message: 'Plugin Updated',
    });
  });

  test('Uninstall Plugin', async () => {
    const tempDir = tmp.dirSync({ unsafeCleanup: true }).name;

    await PluginManager.install(
      'https://artifacthub.io/packages/headlamp/test-123/appcatalog_headlamp_plugin',
      tempDir,
      '',
      mockProgressCallback
    );
    expect(mockProgressCallback).toHaveBeenCalledWith({
      type: 'success',
      message: 'Plugin Installed',
    });

    PluginManager.uninstall('app-catalog', tempDir, mockProgressCallback);
    expect(mockProgressCallback).toHaveBeenCalledWith({
      type: 'success',
      message: 'Plugin Uninstalled',
    });

    fs.rmdirSync(tempDir, { recursive: true });
  });
});
