import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { ROUTES } from './lib/router';

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
                <Route
                  key={index}
                  path={route.path}
                  exact={!!route.exact}
                  children={<route.component />}
                />
              )}
            </Switch>
          </main>
      </div>
    </Router>
  );
}

export default App;
