import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../lib/router';

const DRAWER_WIDTH = 200;

const useStyle = makeStyles(theme => ({
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
  toolbar: theme.mixins.toolbar,
}));

export default function Sidebar(props) {
  const classes = useStyle();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <List>
        {ROUTES.map(({path, name}, i) =>
          <ListItem key={i} button component={Link} to={path}>
            <ListItemText primary={name} />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
}
