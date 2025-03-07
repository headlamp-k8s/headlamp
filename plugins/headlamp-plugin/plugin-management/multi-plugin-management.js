const path = require('path');
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
          config: {
            type: 'object',
            additionalProperties: true,
          },
        },
      },
    },
  },
};
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(pluginConfigSchema);

class MultiPluginManager {
  constructor(
    pluginsDir = process.env.PLUGINS_DIR || '/headlamp/plugins',
    headlampVersion = '',
    progressCallback = () => {}
  ) {
    this.pluginsDir = pluginsDir;
    this.headlampVersion = headlampVersion;
    this.progressCallback = progressCallback;
  }

  /**
   * Install plugins from a configuration file
   * @param {string} configPath - Path to the configuration file
   * @returns {Promise<Array>} Array of installation results
   */
  async installFromConfig(configPath) {
    // Check if config file exists
    if (!fs.existsSync(configPath)) {
      throw new Error('Configuration file not found');
    }

    // console.log('Reading configuration file', { configPath }); // enable for debugging
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
    // console.log('Installing plugin', { plugin: plugin.name }); // enable for debugging

    // Install plugin
    const params = [plugin.source, this.pluginsDir];
    if (this.headlampVersion) params.push(this.headlampVersion);
    if (this.progressCallback) params.push(this.progressCallback);
    await PluginManager.install(...params);
    // Apply plugin configuration if provided
    if (plugin.config) {
      const configPath = path.join(this.pluginsDir, plugin.name, 'config.json');
      const configDir = path.dirname(configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      fs.writeFileSync(configPath, JSON.stringify(plugin.config, null, 2));
      // console.log('Applied plugin configuration', { plugin: plugin.name }); // enable for debugging
    }
  }
}

module.exports = MultiPluginManager;
