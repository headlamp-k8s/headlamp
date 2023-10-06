import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cluster } from '../lib/k8s/cluster';

export interface ConfigState {
  /**
   * Clusters is a map of cluster names to cluster objects.
   * Null indicates that the clusters have not been loaded yet.
   */
  clusters: {
    [clusterName: string]: Cluster;
  } | null;
  /**
   * Settings is a map of settings names to settings values.
   */
  settings: {
    /**
     * tableRowsPerPageOptions is the list of options for the number of rows per page in a table.
     */
    tableRowsPerPageOptions: number[];
    /**
     * timezone is the timezone to use for displaying dates and times.
     */
    timezone: string;
    [key: string]: any;
  };
}

export const defaultTableRowsPerPageOptions = [15, 25, 50];

function defaultTimezone() {
  return process.env.UNDER_TEST ? 'UTC' : Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const storedSettings = JSON.parse(localStorage.getItem('settings') || '{}');

export const initialState: ConfigState = {
  clusters: null,
  settings: {
    tableRowsPerPageOptions:
      storedSettings.tableRowsPerPageOptions || defaultTableRowsPerPageOptions,
    timezone: storedSettings.timezone || defaultTimezone(),
  },
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    /**
     * Save the config. To both the store, and localStorage.
     * @param state - The current state.
     * @param action - The payload action containing the config.
     */
    setConfig(state, action: PayloadAction<{ clusters: ConfigState['clusters'] }>) {
      state.clusters = action.payload.clusters;
    },
    /**
     * Save the settings. To both the store, and localStorage.
     * @param state - The current state.
     * @param action - The payload action containing the settings.
     */
    setAppSettings(state, action: PayloadAction<Partial<ConfigState['settings']>>) {
      Object.keys(action.payload).forEach(key => {
        state.settings[key] = action.payload[key];
      });
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
  },
});

export const { setConfig, setAppSettings } = configSlice.actions;

export default configSlice.reducer;
