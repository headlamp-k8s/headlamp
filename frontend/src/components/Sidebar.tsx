import circleSlice2 from '@iconify/icons-mdi/circle-slice-2';
import databaseIcon from '@iconify/icons-mdi/database';
import folderNetworkOutline from '@iconify/icons-mdi/folder-network-outline';
import hexagonMultipleOutline from '@iconify/icons-mdi/hexagon-multiple-outline';
import kubernetesIcon from '@iconify/icons-mdi/kubernetes';
import lockIcon from '@iconify/icons-mdi/lock';
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
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { useDispatch } from 'react-redux';
import { generatePath } from 'react-router';
import { Link as RouterLink, LinkProps as RouterLinkProps, useLocation } from 'react-router-dom';
import api from '../lib/k8s/api';
import { StringDict } from '../lib/k8s/cluster';
import { createRouteURL, getRoute } from '../lib/router';
import { getCluster, getClusterPrefixedPath } from '../lib/util';
import { setSidebarSelected } from '../redux/actions/actions';
import { useTypedSelector } from '../redux/reducers/reducers';
import { SidebarEntry } from '../redux/reducers/ui';
import store from '../redux/stores/store';
import { ReactComponent as LogoLight } from '../resources/logo-light.svg';
import { NameValueTable } from './common';

export const drawerWidth = 330;

const useStyle = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: theme.palette.sidebarBg,
  },
  toolbar: {
    borderBottom: '1px solid #1e1e1e',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  sidebarGrid: {
    height: '100%'
  },
  '.MuiListItemText-primary': {
    color: 'red'
  },
  logo: {
    height: '32px',
    width: 'auto',
  }
}));

const LIST_ITEMS: SidebarEntry[] = [
  {
    name: 'cluster',
    label: 'Cluster',
    icon: hexagonMultipleOutline,
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
    icon: circleSlice2,
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
    name: 'storage',
    label: 'Storage',
    icon: databaseIcon,
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
    name: 'network',
    label: 'Network',
    icon: folderNetworkOutline,
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
    name: 'security',
    label: 'Security',
    icon: lockIcon,
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
  const routes: SidebarEntry[] = JSON.parse(JSON.stringify(LIST_ITEMS));

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

const useVersionButtonStyle = makeStyles(theme => ({
  versionBox: {
    textAlign: 'center',
    '& .MuiButton-label': {
      color: theme.palette.sidebarLink.main,
    }
  },
  versionIcon: {
    marginBottom: '3px',
  },
}));

function VersionButton() {
  const location = useLocation();

  const classes = useVersionButtonStyle();
  const [clusterVersion, setClusterVersion] = React.useState<StringDict | null>(null);
  const [cluster, setCluster] = React.useState(getCluster());
  const [open, setOpen] = React.useState(false);

  function getVersionRows() {
    if (!clusterVersion) {
      return [];
    }

    return [
      {
        name: 'Git Version',
        value: clusterVersion?.gitVersion,
      },
      {
        name: 'Git Commit',
        value: clusterVersion?.gitCommit,
      },
      {
        name: 'Git Tree State',
        value: clusterVersion?.gitTreeState,
      },
      {
        name: 'Go Version',
        value: clusterVersion?.goVersion,
      },
      {
        name: 'Platform',
        value: clusterVersion?.platform,
      },
    ];
  }

  React.useEffect(() => {
    if (!clusterVersion) {
      api.getVersion()
        .then((results: StringDict) => setClusterVersion(results))
        .catch((error: Error) => console.error('Getting the cluster version:', error));
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
        startIcon={<Icon color="#adadad" icon={kubernetesIcon} className={classes.versionIcon} />}
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

interface ListItemLinkProps {
  primary: string;
  to: string;
  icon?: object;
}

function ListItemLink(props: ListItemLinkProps) {
  const { primary, to, icon, ...other } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <li>
      <ListItem
        button
        component={renderLink}
        {...other}
      >
        {icon &&
          <ListItemIcon>
            <Icon icon={icon} width={30} height={30} />
          </ListItemIcon>
        }
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

export default function Sidebar() {
  const classes = useStyle();
  const sidebar = useTypedSelector(state => state.ui.sidebar);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = React.useMemo(() => prepareRoutes(), [sidebar.entries]);
  // Use the location to make sure the sidebar is changed, as it depends on the cluster
  // (defined in the URL ATM).
  // @todo: Update this if the active cluster management is changed.
  useLocation();
  if (!sidebar?.isVisible) {
    return null;
  }

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar}>
        <SvgIcon
          className={classes.logo}
          component={LogoLight}
          viewBox="0 0 175 32"
        />
      </div>
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
    '& .MuiListItem-root': {
      paddingLeft: theme.spacing(7),
    }
  },
  linkMain: {
    textTransform: 'uppercase',
  },
  link: {
    color: theme.palette.sidebarLink.main,
    '&:hover': {
      color: theme.palette.primary.contrastText,
      backgroundColor: `${theme.palette.sidebarLink.selectedBg}!important`,
    },
    '& svg': {
      color: theme.palette.sidebarLink.main,
    },
    '& *': {
      fontSize: '1.2rem',
    },
    '& .MuiListItemIcon-root': {
      minWidth: 0,
      marginRight: '12px',
    },
  },
  linkSelected: {
    color: theme.palette.primary.contrastText,
    // For some reason we need to use important as even though we override the
    // "selected" class, it uses the default one first.
    backgroundColor: `${theme.palette.sidebarLink.selectedBg}!important`,
    '& *': {
      fontWeight: 'bold',
    },
  },
  linkActive: {
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.sidebarLink.selectedBg,
      'svg': {
        color: theme.palette.primary.contrastText,
      },
    },
    '& svg': {
      color: theme.palette.primary.contrastText,
    },
    '& *': {
      fontSize: '1.2rem',
    },
  },
}));

interface SidebarItemProps extends ListItemProps, SidebarEntry {
  selectedName?: string | null;
  hasParent?: boolean;
}

function SidebarItem(props: SidebarItemProps) {
  const classes = useItemStyle();

  const {
    label,
    name,
    url = null,
    useClusterURL = false,
    subList = [],
    selectedName,
    hasParent = false,
    icon,
    ...other
  } = props;

  let fullURL = url;
  if (fullURL && useClusterURL && getCluster()) {
    fullURL = generatePath(getClusterPrefixedPath(url), {cluster: getCluster()!});
  }

  if (!fullURL) {
    let routeName = name;
    if (!getRoute(name)) {
      routeName = subList.length > 0 ? subList[0].name : '';
    }
    fullURL = createRouteURL(routeName);
  }

  function isSelected() {
    return name === selectedName;
  }

  function shouldExpand() {
    return isSelected() || !!subList.find(item => item.name === selectedName);
  }

  const expanded = subList.length > 0 && shouldExpand();
  let linkClass = classes.link;
  if (hasParent || expanded) {
    linkClass += ' ' + classes.linkActive;
  }
  if (!hasParent) {
    linkClass += ' ' + classes.linkMain;
  }

  return (
    <React.Fragment>
      <ListItemLink
        selected={isSelected()}
        to={fullURL || ''}
        primary={label}
        classes={{
          selected: classes.linkSelected,
        }}
        className={linkClass}
        icon={icon}
        {...other}
      />
      {subList.length > 0 &&
        <Collapse in={expanded}>
          <List component="div" disablePadding className={classes.nested}>
            {subList.map((item, i) =>
              <SidebarItem
                key={i}
                selectedName={selectedName}
                hasParent
                {...item}
              />
            )}
          </List>
        </Collapse>
      }
    </React.Fragment>
  );
}

export function useSidebarItem(itemName: string | null) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setSidebarSelected(itemName));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);
}
