import AppBar from '@material-ui/core/AppBar';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ClusterTitle } from './components/cluster/Chooser';
import ActionsNotifier from './components/common/ActionsNotifier';
import Sidebar, { useSidebarItem } from './components/Sidebar';
import { getToken } from './lib/auth';
import { createRouteURL, getRoutePath, ROUTES } from './lib/router';
import { getCluster } from './lib/util';
import { initializePlugins } from './plugin';
import store from './redux/stores/store';

const dashboardTheme = createMuiTheme({
  palette: {
    primary: {
      contrastText: '#fff',
      main: '#09bac8',
    },
    success: {
      main: green['500'],
      ...green
    },
    warning: {
      main: orange['700'],
      ...orange
    },
  },
  typography: {
    fontFamily: ['Overpass', 'sans-serif'].join(', ')
  },
});

const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

function RouteSwitcher() {
  const routes = useSelector(state => state.ui.routes);

  return (
    <Switch>
      {Object.values(ROUTES).concat(Object.values(routes)).map((route, index) =>
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
                <ClusterTitle />
              </Toolbar>
            </AppBar>
            <Sidebar />
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <RouteSwitcher />
            </main>
            <ActionsNotifier />
        </div>
      </Router>
    </SnackbarProvider>
    </ThemeProvider>
    </Provider>
  );
}

function AuthRoute(props) {
  const { children, sidebar, requiresAuth=true, requiresCluster=true, ...other } = props;
  const clusters = useSelector(state => state.config.clusters);
  const redirectRoute = (!getCluster() || clusters.length === 0) ? 'chooser' : 'login';

  useSidebarItem(sidebar);

  function getRenderer({ location }) {
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
