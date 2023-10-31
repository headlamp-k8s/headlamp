import './i18n/config';
import './components/App/icons';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import AppContainer from './components/App/AppContainer';
import ErrorBoundary from './components/common/ErrorBoundary';
import ErrorComponent from './components/common/ErrorPage';
import i18n from './i18n/config';
import { useElectronI18n } from './i18n/electronI18n';
import ThemeProviderNexti18n from './i18n/ThemeProviderNexti18n';
import themes, { getThemeName, usePrefersColorScheme } from './lib/themes';
import Plugins from './plugin/Plugins';
import { useTypedSelector } from './redux/reducers/reducers';
import store from './redux/stores/store';

function AppWithRedux(props: React.PropsWithChildren<{}>) {
  let themeName = useTypedSelector(state => state.theme.name);
  usePrefersColorScheme();
  useElectronI18n();

  if (!themeName) {
    themeName = getThemeName();
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProviderNexti18n theme={themes[themeName]}>{props.children}</ThemeProviderNexti18n>
    </I18nextProvider>
  );
}

function App() {
  return (
    <ErrorBoundary fallback={<ErrorComponent />}>
      <Provider store={store}>
        <Plugins />
        <AppWithRedux>
          <AppContainer />
        </AppWithRedux>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
