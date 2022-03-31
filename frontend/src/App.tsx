import './i18n/config';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider, useDispatch } from 'react-redux';
import AppContainer from './components/App/AppContainer';
import i18n from './i18n/config';
import { useElectronI18n } from './i18n/electronI18n';
import ThemeProviderNexti18n from './i18n/ThemeProviderNexti18n';
import themes, { getThemeName, usePrefersColorScheme } from './lib/themes';
import { initializePlugins } from './plugin';
import { setPluginsLoadState } from './redux/actions/actions';
import { useTypedSelector } from './redux/reducers/reducers';
import store from './redux/stores/store';

function AppWithRedux(props: React.PropsWithChildren<{}>) {
  const dispatch = useDispatch();
  let themeName = useTypedSelector(state => state.ui.theme.name);
  usePrefersColorScheme();
  useElectronI18n();

  if (!themeName) {
    themeName = getThemeName();
  }

  React.useEffect(() => {
    initializePlugins().finally(() => {
      dispatch(setPluginsLoadState(true));
    });
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProviderNexti18n theme={themes[themeName]}>{props.children}</ThemeProviderNexti18n>
    </I18nextProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppWithRedux>
        <AppContainer />
      </AppWithRedux>
    </Provider>
  );
}

export default App;
