const fs = require('fs');
const PluginManagement = require('./plugin-management');
const  PluginManager = PluginManagement.PluginManager;
const Ajv = require('ajv');
const yaml = require('js-yaml');

// Plugin configuration schema
const pluginConfigSchema = {
  type: 'object',
  required: ['plugins'],
  properties: {
    plugins: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'source'],
        properties: {
          name: { type: 'string' },
          source: { type: 'string' },
          version: { type: 'string' }, // Defaults to latest
        },
      },
    },
  },
};
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(pluginConfigSchema);

/**
 * Manages multiple plugins from a configuration file.
 *
 * @param {string} [pluginsDir=''] - The directory to install plugins to.
 * @param {string} [headlampVersion=''] - The version of Headlamp for compatibility checking.
 * @param {function} [progressCallback=null] - Optional callback for progress updates.
 */
class MultiPluginManager {
  constructor(
    pluginsDir = '',
    headlampVersion = '',
    progressCallback = null
  ) {
    this.pluginsDir = pluginsDir;
    this.headlampVersion = headlampVersion;
    this.progressCallback = progressCallback;
  }

  /**
   * Installs plugins from a configuration file.
   *
   * @param {string} configPath - Path to yaml configuration file.
   * @returns {Promise<Array<{ name: string, status: 'success' | 'error', error?: string }>>} 
   *          A promise resolving to an array of installation results, where each entry contains:
   *          - `name`: Plugin name.
   *          - `status`: `"success"` if installed successfully, `"error"` if installation failed.
   *          - `error` (optional): Error message if installation failed.
   * @throws {Error} If the configuration file does not exist or is invalid.
   */
  async installFromConfig(configPath) {
    if (!fs.existsSync(configPath)) {
      throw new Error('Configuration file not found');
    }

    const config = await this.validateConfig(configPath);

    const results = [];
    for (const plugin of config.plugins) {
      try {
        await this.installPlugin(plugin);
        results.push({
          name: plugin.name,
          status: 'success',
        });
      } catch (error) {
        results.push({
          name: plugin.name,
          status: 'error',
          error: error.message,
        });
      }
    }

    return results;
  }

  async validateConfig(configPath) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      const config = yaml.load(configContent);

      const valid = validate(config);
      if (!valid) {
        const errors = validate.errors.map(err => `${err.instancePath} ${err.message}`).join('\n');
        throw new Error(`Configuration validation failed:\n${errors}`);
      }

      return config;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Configuration file not found: ${configPath}`);
      }
      throw error;
    }
  }

  /**
   * Install a single plugin
   * @param {Object} plugin - Plugin configuration
   * @returns {Promise<void>}
   */
  async installPlugin(plugin) {

    // used undefined for optional parameters if not provided,
    // this will trigger the default values in the install function
    const params = [
      plugin.source, 
      this.pluginsDir === '' ? undefined : this.pluginsDir, 
      this.headlampVersion === '' ? undefined : this.headlampVersion, 
      this.progressCallback === null ? undefined : this.progressCallback,
      plugin.version === '' ? undefined : plugin.version,
    ];
    await PluginManager.install(...params);
  }
}

module.exports = MultiPluginManager;
