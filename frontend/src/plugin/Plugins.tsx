import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { UI_INITIALIZE_PLUGIN_VIEWS } from '../redux/actions/actions';
import { useTypedSelector } from '../redux/reducers/reducers';
// import { useAppDispatch } from '../redux/hooks';
import { fetchAndExecutePlugins } from './index';
import { pluginsLoaded, setPluginSettings } from './pluginsSlice';

/**
 * For discovering and executing plugins.
 *
 * Compared to loading plugins in script tags, doing it this way has some benefits:
 *
 * 1) We can more easily catch certain types of errors in execution. With a
 *   script tag we can not catch errors in the running scripts.
 * 2) We can load the scripts into a context other than global/window. This
 *   means that plugins do not pollute the global namespace.
 */
export default function Plugins() {
  const dispatch = useDispatch();
  const settingsPlugins = useTypedSelector(state => state.plugins.pluginSettings);

  // only run on first load
  useEffect(() => {
    dispatch({ type: UI_INITIALIZE_PLUGIN_VIEWS });

    fetchAndExecutePlugins(settingsPlugins, updatedSettingsPackages => {
      dispatch(setPluginSettings(updatedSettingsPackages));
    })
      .finally(() => {
        dispatch(pluginsLoaded());
        // Warn the app (if we're in app mode).
        window.desktopApi?.send('pluginsLoaded');
      })
      .catch(console.error);
  }, []);
  return null;
}
