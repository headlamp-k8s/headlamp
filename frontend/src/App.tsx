import './i18n/config';
import React from 'react';
import { Provider } from 'react-redux';
import AppContainer from './components/App/AppContainer';
import { useElectronI18n } from './i18n/electronI18n';
import ThemeProviderNexti18n from './i18n/ThemeProviderNexti18n';
import themes, { getThemeName, usePrefersColorScheme } from './lib/themes';
import { initializePlugins } from './plugin';
import { useTypedSelector } from './redux/reducers/reducers';
import store from './redux/stores/store';

function AppWithRedux(props: React.PropsWithChildren<{}>) {
  let themeName = useTypedSelector(state => state.ui.theme.name);
  usePrefersColorScheme();
  useElectronI18n();

  if (!themeName) {
    themeName = getThemeName();
  }

  React.useEffect(() => {
    initializePlugins();
  }, [themeName]);

  return <ThemeProviderNexti18n theme={themes[themeName]}>{props.children}</ThemeProviderNexti18n>;
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
