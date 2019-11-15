import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import { getRoute } from '../lib/router';

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

const LIST_ITEMS = [
  {
    name: 'cluster',
    label: 'Cluster'
  },
  {
    name: 'namespaces',
    label: 'Namespaces'
  },
  {
    name: 'nodes',
    label: 'Nodes'
  },
  {
    name: 'storageClasses',
    label: 'Storage Classes'
  },
  {
    name: 'storageVolumes',
    label: 'Storage Volumes'
  },
  {
    name: 'persistentVolumeClaims',
    label: 'Persistent Volume Claims'
  },
  {
    name: 'workloads',
    label: 'Workloads'
  },
  {
    name: 'services',
    label: 'Services'
  },
  {
    name: 'pods',
    label: 'Pods'
  },
  {
    name: 'ingresses',
    label: 'Ingresses'
  },
  {
    name: 'replicaSets',
    label: 'Replica Sets'
  },
  {
    name: 'serviceAccounts',
    label: 'Service Accounts'
  },
  {
    name: 'roles',
    label: 'Roles'
  },
  {
    name: 'configMaps',
    label: 'Config Maps'
  },
  {
    name: 'roleBindings',
    label: 'Role Bindings'
  },
  {
    name: 'secrets',
    label: 'Secrets'
  },
];

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
        {LIST_ITEMS.map(({name, label}, i) =>
          <ListItem key={i} button component={Link} to={getRoute(name).path}>
            <ListItemText primary={label} />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
}
