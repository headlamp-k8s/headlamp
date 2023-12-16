import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * PluginInfo is the shape of the metadata information for individual plugin objects.
 */
export type PluginInfo = {
  /**
   * The "name" field contains the plugin's name,
   * and must be lowercase and one word, and may contain hyphens and underscores.
   *
   * @see https://docs.npmjs.com/creating-a-package-json-file#required-name-and-version-fields
   */
  name: string;
  /**
   * description text of the plugin from npm with same restrictions as package.json description
   * @see https://docs.npmjs.com/cli/v9/configuring-npm/package-json?v=true#description
   */
  description: string;
  /**
   * homepage is the URL link address for the plugin defined from the package.json
   */
  homepage: string;
  /** repository optional field, repository is an object which some plugins nest their URL link within this object. */
  repository?: any;
  /**
   * isEnable is true when the plugin is enabled
   */
  isEnabled?: boolean;

  version?: string; // unused by PluginSettings
  author?: string; // unused by PluginSettings
  /**
   * dependencies is an object of the plugin's dependencies from the package.json
   */
  devDependencies?: {
    [key: string]: string;
  };
};

export interface PluginsState {
  /** Have plugins finished executing? */
  loaded: boolean;
  /** Information stored by settings about plugins. */
  pluginSettings: PluginInfo[];
}
const initialState: PluginsState = {
  /** Once the plugins have been fetched and executed. */
  loaded: false,
  /** If plugin settings are saved use those. */
  pluginSettings: JSON.parse(localStorage.getItem('headlampPluginSettings') || '[]'),
};

export const pluginsSlice = createSlice({
  name: 'plugins',
  initialState,
  reducers: {
    pluginsLoaded(state) {
      state.loaded = true;
    },
    /**
     * Save the plugin settings. To both the store, and localStorage.
     */
    setPluginSettings(state, action: PayloadAction<PluginInfo[]>) {
      state.pluginSettings = action.payload;
      localStorage.setItem('headlampPluginSettings', JSON.stringify(action.payload));
    },
    /** Reloads the browser page */
    reloadPage() {
      window.location.reload();
    },
  },
});

export const { pluginsLoaded, setPluginSettings, reloadPage } = pluginsSlice.actions;

export default pluginsSlice.reducer;
