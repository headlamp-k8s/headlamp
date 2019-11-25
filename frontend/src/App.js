import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { ROUTES, getRoute } from './lib/router';
import green from '@material-ui/core/colors/green';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { getToken } from './lib/auth';

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

function App() {
  const classes = useStyle();

  return (
    <ThemeProvider theme={dashboardTheme}>
      <Router>
        <div className={classes.root}>
          <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
              <Toolbar>
              </Toolbar>
            </AppBar>
            <Sidebar />
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <Switch>
                {Object.values(ROUTES).map((route, index) =>
                  <AuthRoute
                    key={index}
                    path={route.path}
                    requiresAuth={!route.noAuthRequired}
                    exact={!!route.exact}
                    children={<route.component />}
                  />
                )}
              </Switch>
            </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

function AuthRoute(props) {
  const { children, requiresAuth=true, ...other } = props;

  function getRenderer({ location }) {
    if (!requiresAuth || !!getToken()) {
      return children;
    }

    return (
      <Redirect
        to={{
          pathname: getRoute('login').path,
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
