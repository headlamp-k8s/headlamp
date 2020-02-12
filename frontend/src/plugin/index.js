import Registry from "./registry";

window.plugins = {}

function registerPlugin(pluginId, pluginObj) {
  window.plugins[pluginId] = pluginObj;
}

window.registerPlugin = registerPlugin;

export function initializePlugins() {
  const context = require.context(
    "./plugins", // Context folder
    true, // Include subdirectories
    // Include one subdirectory level that has an index.js file
    /^\.\/[a-zA-Z_\-0-9]+\/index.js$/
  );

  // Load the plugins
  for (const module of context.keys()) {
    context(module);
  }

  // Call initialize on every plugin
  for (let plugin of Object.values(window.plugins)) {
    plugin.initialize(new Registry());
  }
}
