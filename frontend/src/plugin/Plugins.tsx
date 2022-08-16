import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import helpers from '../helpers';
import { setPluginsLoadState, UI_INITIALIZE_PLUGIN_VIEWS } from '../redux/actions/actions';
import { initializePlugins } from './index';

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

  // only run on first load
  useEffect(() => {
    dispatch({ type: UI_INITIALIZE_PLUGIN_VIEWS });

    /**
     * Get the list of plugins,
     *   download all the plugins,
     *   execute the plugins,
     *   .initialize() plugins that register (not all do).
     */
    async function fetchAndExecute() {
      const pluginsScriptPaths = (await fetch(`${helpers.getAppUrl()}plugins/list`).then(resp =>
        resp.json()
      )) as string[];

      const sources = await Promise.all(
        pluginsScriptPaths.map(path =>
          fetch(`${helpers.getAppUrl()}${path}`).then(resp => resp.text())
        )
      );

      sources.forEach((source, index) => {
        // Execute plugins inside a context (not in global/window)
        (function (str: string) {
          try {
            const result = eval(str);
            return result;
          } catch (e) {
            // We just continue if there is an error.
            console.error(`Plugin execution error in ${pluginsScriptPaths[index]}:`, e);
          }
        }.call({}, source));
      });
      await initializePlugins();
    }

    fetchAndExecute()
      .finally(() => {
        dispatch(setPluginsLoadState(true));
        // Warn the app (if we're in app mode).
        window.desktopApi?.send('pluginsLoaded');
      })
      .catch(console.error);
  }, []);
  return null;
}
