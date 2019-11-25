import Collapse from '@material-ui/core/Collapse';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
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
    label: 'Cluster',
    subList: [
      {
        name: 'namespaces',
        label: 'Namespaces'
      },
      {
        name: 'nodes',
        label: 'Nodes'
      },
      {
        name: 'roles',
        label: 'Roles'
      },
    ]
  },
  {
    name: 'workloads',
    label: 'Workloads',
    subList: [
      {
        name: 'pods',
        label: 'Pods'
      },
      {
        name: 'replicaSets',
        label: 'Replica Sets'
      },
    ]
  },
  {
    label: 'Storage',
    subList: [
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
    ]
  },
  {
    label: 'Network'  ,
    subList: [
      {
        name: 'services',
        label: 'Services'
      },
      {
        name: 'ingresses',
        label: 'Ingresses'
      },
    ]
  },
  {
    label: 'Security',
    subList: [
      {
        name: 'serviceAccounts',
        label: 'Service Accounts'
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
    ]
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

  const {label, name=null, subList=[], selectedName, onSelect, ...other} = props;

  const routeName = name !== null ? name : subList.find(item => !!item.name).name;
  const linkPath = getRoute(routeName).path;
  const urlMatch = useRouteMatch(linkPath);

  function isSelected() {
    return name == selectedName;
  }

  function shouldExpand() {
    return isSelected() || !!subList.find(item => item.name == selectedName);
  }

  function setSelected() {
    onSelect(routeName);
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
