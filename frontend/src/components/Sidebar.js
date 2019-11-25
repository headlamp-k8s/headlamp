import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { getRoute } from '../lib/router';
import Collapse from '@material-ui/core/Collapse';

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
  const [selectedItem, setSelectedItem] = React.useState(null);

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
          {LIST_ITEMS.map((item, i) =>
            <SidebarItem
              key={i}
              onSelect={setSelectedItem}
              selectedName={selectedItem}
              {...item}
            />
          )}
        </List>
    </Drawer>
  );
}

const useItemStyle = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(2),
  },
}));

function SidebarItem(props) {
  const classes = useItemStyle();

  const {label, name, subList=[], selectedName, onSelect, ...other} = props;
  const linkPath = getRoute(name).path;
  const urlMatch = useRouteMatch(linkPath);

  function isSelected() {
    return name == selectedName;
  }

  function shouldExpand() {
    return isSelected() || !!subList.find(item => item.name == selectedName);
  }

  function setSelected() {
    onSelect(name);
  }

  // Check if the item should be selected because of a direct access through the URL
  if (urlMatch && urlMatch.isExact) {
    if (!isSelected()) {
      setSelected();
    }
  }

  return (
    <React.Fragment>
      <ListItem
        button
        component={Link}
        selected={isSelected()}
        onClick={setSelected}
        to={linkPath}
        {...other}
      >
        <ListItemText primary={label} />
      </ListItem>
      {subList.length > 0 &&
        <Collapse in={shouldExpand()}>
          <List component="div" disablePadding className={classes.nested}>
            {subList.map((item, i) =>
              <SidebarItem
                key={i}
                onSelect={onSelect}
                selectedName={selectedName}
                {...item}
              />
            )}
          </List>
        </Collapse>
      }
    </React.Fragment>
  );
}