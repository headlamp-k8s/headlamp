import './i18n/config';
import { Box } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import RouteSwitcher from './components/App/RouteSwitcher';
import TopBar from './components/App/TopBar';
import { ClusterTitle } from './components/cluster/Chooser';
import ActionsNotifier from './components/common/ActionsNotifier';
import AlertNotification from './components/common/AlertNotification';
import ReleaseNotes from './components/common/ReleaseNotes/ReleaseNotes';
import Sidebar, { drawerWidth, NavigationTabs } from './components/Sidebar';
import helpers from './helpers';
import { useElectronI18n } from './i18n/electronI18n';
import ThemeProviderNexti18n from './i18n/ThemeProviderNexti18n';
import themes, { getThemeName, usePrefersColorScheme } from './lib/themes';
import { initializePlugins } from './plugin';
import { useTypedSelector } from './redux/reducers/reducers';
import store from './redux/stores/store';

const useStyle = makeStyles(theme => ({
  root: {
    background: theme.palette.background.default,
    paddingLeft: (props: { isSidebarOpen: boolean }) =>
      props.isSidebarOpen ? `${drawerWidth}px` : '0px',
    marginLeft: drawerWidth,
    '& > *': {
      color: theme.palette.text.primary,
    },
  },
  content: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  // importing visuallyHidden has typing issues at time of writing.
  // import { visuallyHidden } from '@material-ui/utils';
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
}));

function AppContainer() {
  const isSidebarOpen = useTypedSelector(state => state.ui.sidebar.isSidebarOpen);
  const classes = useStyle({ isSidebarOpen });
  const Router = ({ children }: React.PropsWithChildren<{}>) =>
    helpers.isElectron() ? (
      <HashRouter>{children}</HashRouter>
    ) : (
      <BrowserRouter basename={helpers.getBaseUrl()}>{children}</BrowserRouter>
    );

  localStorage.setItem('sidebar', JSON.stringify({ shrink: isSidebarOpen }));

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Router>
        <Link href="#main" className={classes.visuallyHidden}>
          Skip to main content
        </Link>
        <Box display="flex">
          <CssBaseline />

          <AppBar
            position="fixed"
            className={classes.root}
            elevation={1}
            component="nav"
            aria-label="Appbar Tools"
          >
            <Toolbar>
              <div style={{ flex: '1 0 0' }} />
              <ClusterTitle />
              <div style={{ flex: '1 0 0' }} />
              <TopBar />
            </Toolbar>
          </AppBar>
          <Sidebar />
          <main id="main" className={classes.content}>
            <AlertNotification />
            <Box p={3}>
              <div className={classes.toolbar} />
              <Container maxWidth="lg">
                <NavigationTabs />
                <RouteSwitcher />
              </Container>
            </Box>
          </main>
          <ActionsNotifier />
        </Box>
      </Router>
      <ReleaseNotes />
    </SnackbarProvider>
  );
}

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
