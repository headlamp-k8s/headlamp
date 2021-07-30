import './i18n/config';
import accountIcon from '@iconify/icons-mdi/account';
import logoutIcon from '@iconify/icons-mdi/logout';
import darkIcon from '@iconify/icons-mdi/weather-night';
import lightIcon from '@iconify/icons-mdi/weather-sunny';
import { Icon } from '@iconify/react';
import { Box, Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Provider, useDispatch } from 'react-redux';
import {
  BrowserRouter,
  HashRouter,
  Redirect,
  Route,
  RouteProps,
  Switch,
  useHistory,
} from 'react-router-dom';
import { ClusterTitle } from './components/cluster/Chooser';
import ActionsNotifier from './components/common/ActionsNotifier';
import AlertNotification from './components/common/AlertNotification';
import ReleaseNotesModal from './components/releasenotes';
import Sidebar, { drawerWidth, NavigationTabs, useSidebarItem } from './components/Sidebar';
import helpers from './helpers';
import { useElectronI18n } from './i18n/electronI18n';
import LocaleSelect from './i18n/LocaleSelect/LocaleSelect';
import ThemeProviderNexti18n from './i18n/ThemeProviderNexti18n';
import { getToken, setToken } from './lib/auth';
import { useCluster, useClustersConf } from './lib/k8s';
import { createRouteURL, getRoutePath, ROUTES } from './lib/router';
import themes, { getThemeName, ThemesConf, usePrefersColorScheme } from './lib/themes';
import { getCluster } from './lib/util';
import { initializePlugins } from './plugin';
import { setTheme as setThemeRedux } from './redux/actions/actions';
import { useTypedSelector } from './redux/reducers/reducers';
import store from './redux/stores/store';

function PageTitle({
  title,
  children,
}: {
  title: string | null | undefined;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    document.title = title || '';
  }, [title]);

  return <>{children}</>;
}

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

function RouteSwitcher() {
  const routes = useTypedSelector(state => state.ui.routes);

  return (
    <Switch>
      {Object.values(ROUTES)
        .concat(Object.values(routes))
        .map((route, index) =>
          route.name === 'OidcAuth' ? (
            <Route
              path={route.path}
              component={() => (
                <PageTitle title={route.name ? route.name : route.sidebar}>
                  <route.component />
                </PageTitle>
              )}
              key={index}
            />
          ) : (
            <AuthRoute
              key={index}
              path={getRoutePath(route)}
              sidebar={route.sidebar}
              requiresAuth={!route.noAuthRequired}
              requiresCluster={!route.noCluster}
              exact={!!route.exact}
              children={
                <PageTitle title={route.name ? route.name : route.sidebar}>
                  <route.component />
                </PageTitle>
              }
            />
          )
        )}
    </Switch>
  );
}

function TopBar() {
  const appBarActions = useTypedSelector(state => state.ui.views.appBar.actions);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const cluster = useCluster();
  const history = useHistory();
  const { t } = useTranslation('frequent');

  function handleMenu(event: any) {
    setMenuAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setMenuAnchorEl(null);
  }

  function hasToken() {
    return !!cluster ? !!getToken(cluster) : false;
  }

  function logout() {
    if (!!cluster) {
      setToken(cluster, null);
    }
    setMenuAnchorEl(null);
    history.push('/');
  }

  return (
    <>
      {
        // @todo: Use a grid to compose the toolbar
        Object.values(appBarActions).map((action, i) => (
          <React.Fragment key={i}>{action()}</React.Fragment>
        ))
      }
      <LocaleSelect />
      <ThemeChangeButton />
      <IconButton
        aria-label={t('User menu')}
        aria-controls="customized-menu"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <Icon icon={accountIcon} />
      </IconButton>

      <span id="customized-menu">
        <Menu
          anchorEl={menuAnchorEl}
          open={!!menuAnchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem component="a" onClick={logout} disabled={!hasToken()} dense>
            <ListItemIcon>
              <Icon icon={logoutIcon} />
            </ListItemIcon>
            <ListItemText primary="Log out" secondary={hasToken() ? null : '(No token set up)'} />
          </MenuItem>
        </Menu>
      </span>
    </>
  );
}

function ThemeChangeButton() {
  const themeName = getThemeName();

  const dispatch = useDispatch();
  const { t } = useTranslation('frequent');
  type iconType = typeof darkIcon;

  const counterIcons: {
    [themeName in keyof ThemesConf]: iconType;
  } = {
    light: darkIcon,
    dark: lightIcon,
  };

  const [icon, setIcon] = React.useState<iconType>(counterIcons[themeName]);

  const themeNames = Object.keys(counterIcons);

  function changeTheme() {
    const idx = themeNames.indexOf(themeName);
    const newTheme = themeNames[(idx + 1) % themeNames.length];
    dispatch(setThemeRedux(newTheme));
    setIcon(counterIcons[newTheme]);
  }

  return (
    <IconButton aria-label={t('Change theme')} onClick={() => changeTheme()}>
      <Icon icon={icon} />
    </IconButton>
  );
}

function UpdatePopup() {
  const [show, setShow] = React.useState(false);
  const [updateDownloadURL, setUpdateDownloadURL] = React.useState<string | undefined>();
  const { desktopApi } = window;
  React.useEffect(() => {
    desktopApi &&
      desktopApi.receive('update_available', (data: { downloadURL: string }) => {
        setShow(true);
        setUpdateDownloadURL(data.downloadURL);
      });
  }, []);

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={show}
      autoHideDuration={100000}
      ContentProps={{
        'aria-describedby': 'updatePopup',
      }}
      message={`There is an available update`}
      action={
        <React.Fragment>
          <Button color="secondary" onClick={() => window.open(updateDownloadURL)}>
            More
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              desktopApi.send('disable_update_checking');
              setShow(false);
            }}
          >
            Do not notify again
          </Button>
          <Button color="primary" onClick={() => setShow(false)}>
            Close
          </Button>
        </React.Fragment>
      }
    />
  );
}

function AppContainer() {
  const { desktopApi } = window;
  const isSidebarOpen = useTypedSelector(state => state.ui.sidebar.isSidebarOpen);
  const classes = useStyle({ isSidebarOpen });
  const [releaseNotes, setReleaseNotes] = React.useState<string>();
  const [appVersion, setAppVersion] = React.useState('');
  const Router = ({ children }: React.PropsWithChildren<{}>) =>
    helpers.isElectron() ? (
      <HashRouter>{children}</HashRouter>
    ) : (
      <BrowserRouter basename={helpers.getBaseUrl()}>{children}</BrowserRouter>
    );

  localStorage.setItem('sidebar', JSON.stringify({ shrink: isSidebarOpen }));

  React.useEffect(() => {
    if (desktopApi) {
      desktopApi.receive(
        'show_release_notes',
        (data: { releaseNotes: string; appVersion: string }) => {
          setReleaseNotes(data.releaseNotes);
          setAppVersion(data.appVersion);
        }
      );
    }
  }, []);

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <UpdatePopup />
      {releaseNotes && <ReleaseNotesModal releaseNotes={releaseNotes} appVersion={appVersion} />}
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

interface AuthRouteProps {
  children: React.ReactNode | JSX.Element;
  sidebar: string | null;
  requiresAuth: boolean;
  requiresCluster: boolean;
  [otherProps: string]: any;
}

function AuthRoute(props: AuthRouteProps) {
  const { children, sidebar, requiresAuth = true, requiresCluster = true, ...other } = props;
  const clusters = useClustersConf();
  const redirectRoute = getCluster() ? 'login' : 'chooser';

  useSidebarItem(sidebar);

  function getRenderer({ location }: RouteProps) {
    if (!requiresAuth) {
      return children;
    }

    if (requiresCluster) {
      const clusterName = getCluster();
      if (!!clusterName) {
        const cluster = clusters ? clusters[clusterName] : undefined;
        const requiresToken = cluster?.useToken === undefined || cluster?.useToken;
        if (!!getToken(clusterName) || !requiresToken) {
          return children;
        }
      }
    }

    return (
      <Redirect
        to={{
          pathname: createRouteURL(redirectRoute),
          state: { from: location },
        }}
      />
    );
  }

  // If no auth is required for the view, or the token is set up, then
  // render the assigned component. Otherwise redirect to the login route.
  return <Route {...other} render={getRenderer} />;
}

export default App;
