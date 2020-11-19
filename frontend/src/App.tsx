import accountIcon from '@iconify/icons-mdi/account';
import logoutIcon from '@iconify/icons-mdi/logout';
import darkIcon from '@iconify/icons-mdi/weather-night';
import lightIcon from '@iconify/icons-mdi/weather-sunny';
import { Icon } from '@iconify/react';
import { Box } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter, Redirect, Route, RouteProps, Switch, useHistory } from 'react-router-dom';
import { ClusterTitle } from './components/cluster/Chooser';
import ActionsNotifier from './components/common/ActionsNotifier';
import Sidebar, { drawerWidth, NavigationTabs, useSidebarItem } from './components/Sidebar';
import { isElectron } from './helpers';
import { getToken, setToken } from './lib/auth';
import { useCluster, useClustersConf } from './lib/k8s';
import { createRouteURL, getRoutePath, ROUTES } from './lib/router';
import themes, { getTheme, setTheme, ThemesConf } from './lib/themes';
import { getCluster } from './lib/util';
import { initializePlugins } from './plugin';
import { useTypedSelector } from './redux/reducers/reducers';
import store from './redux/stores/store';

const useStyle = makeStyles(theme => ({
  root: {
    background: theme.palette.background.default,
    paddingLeft: (isSidebarOpen: boolean) => isSidebarOpen ? `${drawerWidth}px` : '0px',
    marginLeft: drawerWidth,
    '& > *': {
      color: theme.palette.text.primary,
    }
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

function RouteSwitcher() {
  const routes = useTypedSelector(state => state.ui.routes);

  return (
    <Switch>
      {Object.values(ROUTES).concat(Object.values(routes))
        .map((route, index) =>
          route.name === 'OidcAuth' ?
            <Route path={route.path} component={() => <route.component/>} key={index}/>
            :
            <AuthRoute
              key={index}
              path={getRoutePath(route)}
              sidebar={route.sidebar}
              requiresAuth={!route.noAuthRequired}
              requiresCluster={!route.noCluster}
              exact={!!route.exact}
              children={<route.component />}
            />
        )}
    </Switch>
  );
}

function TopBar() {
  const appBarActions = useTypedSelector(state => state.ui.views.appBar.actions);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const cluster = useCluster();
  const history = useHistory();

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
      { // @todo: Use a grid to compose the toolbar
        Object.values(appBarActions).map((action, i) =>
          <React.Fragment key={i}>{action()}</React.Fragment>)
      }
      <IconButton
        aria-label='User menu'
        aria-controls='menu-appbar'
        aria-haspopup='true'
        onClick={handleMenu}
        color='inherit'
      >
        <Icon icon={accountIcon} />
      </IconButton>
      <Menu
        id='customized-menu'
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
        <MenuItem
          component="a"
          onClick={logout}
          disabled={!hasToken()}
          dense
        >
          <ListItemIcon>
            <Icon icon={logoutIcon} />
          </ListItemIcon>
          <ListItemText
            primary="Log out"
            secondary={hasToken() ? null : '(No token set up)'}
          />
        </MenuItem>
      </Menu>
    </>
  );
}

interface ThemeChangeButtonProps {
  onChange: (theme: string) => void;
}

function ThemeChangeButton(props: ThemeChangeButtonProps) {
  const {onChange} = props;
  type iconType = typeof darkIcon;

  const counterIcons: {
    [themeName in keyof ThemesConf]: iconType;
  } = {
    light: darkIcon,
    dark: lightIcon,
  };

  const [icon, setIcon] = React.useState<iconType>(counterIcons[getTheme()]);

  const themeNames = Object.keys(counterIcons);

  function changeTheme() {
    const idx = themeNames.indexOf(getTheme());
    const newTheme = themeNames[(idx + 1) % themeNames.length];

    setTheme(newTheme);
    setIcon(counterIcons[newTheme]);

    onChange(newTheme);
  }

  return (
    <IconButton
      aria-label="change-theme"
      onClick={() => changeTheme()}
    >
      <Icon icon={icon} />
    </IconButton>
  );
}

interface AppContainerProps {
  setThemeName: React.Dispatch<React.SetStateAction<string>>;
}

function AppContainer(props: AppContainerProps) {
  const isSidebarOpen = useTypedSelector(state => state.ui.sidebar.isSidebarOpen);
  const classes = useStyle(isSidebarOpen);
  const {setThemeName} = props;
  const Router = ({children} : React.PropsWithChildren<{}>) => isElectron() ?
    <HashRouter>{children}</HashRouter> :
    <BrowserRouter>{children}</BrowserRouter>;

  localStorage.setItem('sidebar', JSON.stringify({'shrink': isSidebarOpen}));

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Router>
        <Box display="flex">
          <CssBaseline />

          <AppBar
            position="fixed"
            className={classes.root}
            elevation={1}
          >
            <Toolbar>
              <div style={{flex: '1 0 0'}} />
              <ClusterTitle />
              <div style={{flex: '1 0 0'}} />
              <ThemeChangeButton
                onChange={(theme: string) => setThemeName(theme)}
              />
              <TopBar />
            </Toolbar>
          </AppBar>
          <Sidebar />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Container maxWidth="lg">
              <NavigationTabs />
              <RouteSwitcher />
            </Container>
          </main>
          <ActionsNotifier />
        </Box>
      </Router>
    </SnackbarProvider>
  );
}

function App() {
  const [themeName, setThemeName] = React.useState(getTheme());

  React.useEffect(() => {
    initializePlugins();
  },
  [themeName]);

  React.useEffect(() => {
    console.log(themes[themeName]);
  },
  [themeName]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={themes[themeName]}>
        <AppContainer setThemeName={setThemeName}/>
      </ThemeProvider>
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
  const {clusters} = useClustersConf();
  const redirectRoute = getCluster() ? 'login' : 'chooser';

  useSidebarItem(sidebar);

  function getRenderer({ location }: RouteProps) {
    if (!requiresAuth) {
      return children;
    }

    if (requiresCluster) {
      const clusterName = getCluster();
      if (!!clusterName) {
        const cluster = clusters[clusterName];
        const requiresToken = (cluster?.useToken === undefined || cluster?.useToken);
        if (!!getToken(clusterName) || !requiresToken) {
          return children;
        }
      }
    }

    return (
      <Redirect
        to={{
          pathname: createRouteURL(redirectRoute),
          state: { from: location }
        }}
      />
    );
  }

  // If no auth is required for the view, or the token is set up, then
  // render the assigned component. Otherwise redirect to the login route.
  return (
    <Route
      {...other}
      render={getRenderer}
    />
  );
}

export default App;
