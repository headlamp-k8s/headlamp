import { createSlice } from '@reduxjs/toolkit';

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
  /**
   * isEnable is true when the plugin is enabled
   */
  isEnabled?: boolean;

  version?: string; // unused by PluginSettings
  author?: string; // unused by PluginSettings
};

export interface PluginsState {
  /** Have plugins finished executing? */
  loaded: boolean;
}

const initialState: PluginsState = {
  /** Once the plugins have been fetched and executed. */
  loaded: false,
};

export const pluginsSlice = createSlice({
  name: 'plugins',
  initialState,
  reducers: {
    pluginsLoaded(state) {
      state.loaded = true;
    },
  },
});

export const { pluginsLoaded } = pluginsSlice.actions;

export default pluginsSlice.reducer;
