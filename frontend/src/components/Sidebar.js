import Collapse from '@material-ui/core/Collapse';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getRoute } from '../lib/router';
import { setSidebarSelected } from '../redux/actions/actions';
import store from '../redux/stores/store';

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

function prepareRoutes() {
  const items = store.getState().ui.sidebar.entries;
  // @todo: Find a better way to avoid modifying the objects in LIST_ITEMS.
  let routes = JSON.parse(JSON.stringify(LIST_ITEMS));

  for (let item of Object.values(items)) {
    let parent = item.parent ? routes.find(({name}) => name === item.parent) : null;
    let placement = routes;
    if (parent) {
      if (!parent['subList']) {
        parent['subList'] = [];
      }

      placement = parent['subList']
    }

    placement.push(item);
  }

  return routes;
}

export default function Sidebar(props) {
  const classes = useStyle();
  const sidebar = useSelector(state => state.ui.sidebar);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = React.useMemo(() => prepareRoutes(), [sidebar.entries]);

  return sidebar.isVisible && (
    <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List>
          {items.map((item, i) =>
            <SidebarItem
              key={i}
              selectedName={sidebar.selected}
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

  const {label, name=null, url=null, subList=[], selectedName, ...other} = props;

  let routeName = name !== null ? name : subList.find(item => !!item.name).name;
  const linkPath = url || getRoute(routeName).path;

  function isSelected() {
    return name === selectedName;
  }

  function shouldExpand() {
    return isSelected() || !!subList.find(item => item.name === selectedName);
  }

  return (
    <React.Fragment>
      <ListItem
        button
        component={Link}
        selected={isSelected()}
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

export function useSidebarItem(itemName) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setSidebarSelected(itemName));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);
}
