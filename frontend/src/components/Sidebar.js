import kubernetesIcon from '@iconify/icons-mdi/kubernetes';
import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import api from '../lib/api';
import { createRouteURL } from '../lib/router';
import { getCluster, getClusterPrefixedPath } from '../lib/util';
import { setSidebarSelected } from '../redux/actions/actions';
import store from '../redux/stores/store';
import { NameValueTable } from './common';

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
  sidebarGrid: {
    height: '100%',
  }
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
        name: 'crds',
        label: 'CRDs'
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
    label: 'Network',
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
  const routes = JSON.parse(JSON.stringify(LIST_ITEMS));

  for (const item of Object.values(items)) {
    const parent = item.parent ? routes.find(({name}) => name === item.parent) : null;
    let placement = routes;
    if (parent) {
      if (!parent['subList']) {
        parent['subList'] = [];
      }

      placement = parent['subList'];
    }

    placement.push(item);
  }

  return routes;
}

const useVersionButtonStyle = makeStyles({
  versionBox: {
    textAlign: 'center',
    borderTop: '1px solid #afafaf',
  },
  versionIcon: {
    marginBottom: '3px',
  },
});

function VersionButton(props) {
  const location = useLocation();

  const classes = useVersionButtonStyle();
  const [clusterVersion, setClusterVersion] = React.useState(null);
  const [cluster, setCluster] = React.useState(getCluster());
  const [open, setOpen] = React.useState(false);

  function getVersionRows() {
    if (!clusterVersion) {
      return [];
    }

    return [
      {
        name: 'Git Version',
        value: clusterVersion.gitVersion,
      },
      {
        name: 'Git Commit',
        value: clusterVersion.gitCommit,
      },
      {
        name: 'Git Tree State',
        value: clusterVersion.gitTreeState,
      },
      {
        name: 'Go Version',
        value: clusterVersion.goVersion,
      },
      {
        name: 'Platform',
        value: clusterVersion.platform,
      },
    ];
  }

  React.useEffect(() => {
    if (!clusterVersion) {
      api.getVersion()
        .then(results => setClusterVersion(results))
        .catch(error => console.error('Getting the cluster version:', error));
    }
  },
  [clusterVersion]);

  // Use the location to make sure the version is changed, as it depends on the cluster
  // (defined in the URL ATM).
  // @todo: Update this if the active cluster management is changed.
  React.useEffect(() => {
    const currentCluster = getCluster();
    if (currentCluster !== cluster) {
      setCluster(currentCluster);
      setClusterVersion(null);
    }
  },
  [location, cluster]);

  function handleClose() {
    setOpen(false);
  }

  return (!clusterVersion ?
    null
    :
    <Box mx="auto" py=".2em" className={classes.versionBox}>
      <Button
        onClick={() => setOpen(true) }
        style={{textTransform: 'none', }}
        startIcon={<Icon color="#09bac8" icon={kubernetesIcon} className={classes.versionIcon} />}
      >
        {clusterVersion.gitVersion}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Kubernetes Version</DialogTitle>
        <DialogContent>
          <NameValueTable rows={getVersionRows()} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function Sidebar(props) {
  const classes = useStyle();
  const sidebar = useSelector(state => state.ui.sidebar);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = React.useMemo(() => prepareRoutes(), [sidebar.entries]);
  // Use the location to make sure the sidebar is changed, as it depends on the cluster
  // (defined in the URL ATM).
  // @todo: Update this if the active cluster management is changed.
  useLocation();

  return sidebar.isVisible && (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <Grid
        className={classes.sidebarGrid}
        container
        direction="column"
        justify="space-between"
        wrap="nowrap"
      >
        <Grid item>
          <List>
            {items.map((item, i) =>
              <SidebarItem
                key={i}
                selectedName={sidebar.selected}
                {...item}
              />
            )}
          </List>
        </Grid>
        <Grid item>
          <VersionButton />
        </Grid>
      </Grid>
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

  const {label, name = null, url = null, useClusterURL = false, subList = [], selectedName, ...other} = props;

  const routeName = name !== null ? name : subList.find(item => !!item.name).name;
  let fullURL = url;
  if (fullURL && useClusterURL && getCluster()) {
    fullURL = generatePath(getClusterPrefixedPath(url), {cluster: getCluster()});
  }
  const linkPath = fullURL || createRouteURL(routeName);

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
