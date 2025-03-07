const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const MultiPluginManagement = require('./multi-plugin-management');
const PluginManagement = require('./plugin-management');
const PluginManager = PluginManagement.PluginManager;

describe('MultiPluginManagement', () => {
  let tempDir;
  let configPath;
  let installer;

  beforeEach(async () => {
    // Create temporary directory for tests
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'headlamp-test-'));
    configPath = path.join(tempDir, 'plugins.yaml');
    installer = new MultiPluginManagement(tempDir);
  });

  afterEach(async () => {
    // Clean up temporary directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('validateConfig', () => {
    it('should validate a valid configuration', async () => {
      const config = `
plugins:
  - name: test-plugin
    source: https://example.com/plugin.tar.gz
    version: 1.0.0
    config:
      key: value
`;
      await fs.writeFile(configPath, config);
      
      const result = await installer.validateConfig(configPath);
      expect(result).toBeDefined();
      expect(result.plugins).toHaveLength(1);
      expect(result.plugins[0].name).toBe('test-plugin');
    });

    it('should reject invalid configuration', async () => {
      const config = `
plugins:
  - source: https://example.com/plugin.tar.gz
`;
      await fs.writeFile(configPath, config);
      
      await expect(installer.validateConfig(configPath))
        .rejects.toThrow('Configuration validation failed');
    });
  });

  describe('installFromConfig', () => {
    it('should handle missing configuration file', async () => {
      await expect(installer.installFromConfig('/nonexistent/config.yaml'))
        .rejects.toThrow('Configuration file not found');
    });

    it('should handle invalid source URLs', async () => {
      const config = `
plugins:
  - name: test-plugin
    source: invalid-url
`;
      await fs.writeFile(configPath, config);
      
      const result = await installer.installFromConfig(configPath);
      expect(result).toEqual([{
        name: 'test-plugin',
        status: 'error',
        error: 'Invalid URL. Please provide a valid URL from ArtifactHub.'
      }]);
    });
  });

  describe('installPlugin', () => {
    it('should handle plugin installation errors', async () => {
      const plugin = {
        name: 'test-plugin',
        source: 'https://example.com/nonexistent.tar.gz'
      };

      await expect(installer.installPlugin(plugin))
        .rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle YAML parsing errors', async () => {
      const invalidYaml = `
plugins:
  - name: test-plugin
    source: [invalid yaml
`;
      await fs.writeFile(configPath, invalidYaml);
      
      await expect(installer.installFromConfig(configPath))
        .rejects.toThrow();
    });

    it('should handle file system errors', async () => {
      const plugin = {
        name: 'test-plugin',
        source: 'https://example.com/plugin.tar.gz',
        config: {
          key: 'value'
        }
      };

      // Make plugins directory read-only
      await fs.chmod(tempDir, 0o444);
      
      await expect(installer.installPlugin(plugin))
        .rejects.toThrow();
    });
  });
});
