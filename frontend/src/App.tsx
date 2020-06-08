import AppBar from '@material-ui/core/AppBar';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { ClusterTitle } from './components/cluster/Chooser';
import ActionsNotifier from './components/common/ActionsNotifier';
import Sidebar, { drawerWidth, useSidebarItem } from './components/Sidebar';
import { getToken } from './lib/auth';
import { createRouteURL, getRoutePath, ROUTES } from './lib/router';
import { getCluster } from './lib/util';
import { initializePlugins } from './plugin';
import { useTypedSelector } from './redux/reducers/reducers';
import store from './redux/stores/store';

declare module '@material-ui/core/styles/createPalette.d' {
  interface Palette {
    success: object;
    sidebarLink: {
      [propName: string]: string;
    };
    [propName: string]: any;
  }
  interface PaletteOptions {
    success: object;
    sidebarLink: {
      [propName: string]: string;
    };
    [propName: string]: any;
  }
}

const dashboardTheme = createMuiTheme({
  palette: {
    primary: {
      contrastText: '#fff',
      main: '#3DA3F5',
    },
    success: {
      light: green['50'],
      main: green['500'],
      ...green
    },
    warning: {
      main: orange['500'],
      light: orange['50'],
      ...orange
    },
    sidebarLink: {
      main: grey['500'],
      selectedBg: grey['800'],
    },
    error: {
      main: red['500'],
      light: red['50'],
    },
    sidebarBg: '#000',
    normalEventBg: '#F0F0F0',
  },
  typography: {
    fontFamily: ['Overpass', 'sans-serif'].join(', ')
  },
  shape: {
    borderRadius: 0,
  }
});

const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    background: '#fff',
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
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

function App() {
  const classes = useStyle();

  React.useEffect(() => {
    initializePlugins();
  },
  []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={dashboardTheme}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Router>
            <div className={classes.root}>
              <CssBaseline />
              <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                  <div style={{flex: '1 0 0'}} />
                  <ClusterTitle />
                  <div style={{flex: '1 0 0'}} />
                </Toolbar>
              </AppBar>
              <Sidebar />
              <main className={classes.content}>
                <div className={classes.toolbar} />
                <Container maxWidth="lg">
                  <RouteSwitcher />
                </Container>
              </main>
              <ActionsNotifier />
            </div>
          </Router>
        </SnackbarProvider>
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
  const clusters = useTypedSelector(state => state.config.clusters);
  const redirectRoute = (!getCluster() || clusters.length === 0) ? 'chooser' : 'login';

  useSidebarItem(sidebar);

  function getRenderer({ location }: RouteProps) {
    if (!requiresAuth) {
      return children;
    }

    if (requiresCluster) {
      const cluster = getCluster();
      if (!!cluster && !!getToken(cluster)) {
        return children;
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
