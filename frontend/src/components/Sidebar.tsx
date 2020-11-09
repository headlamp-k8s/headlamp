import circleSlice2 from '@iconify/icons-mdi/circle-slice-2';
import databaseIcon from '@iconify/icons-mdi/database';
import folderNetworkOutline from '@iconify/icons-mdi/folder-network-outline';
import hexagonMultipleOutline from '@iconify/icons-mdi/hexagon-multiple-outline';
import kubernetesIcon from '@iconify/icons-mdi/kubernetes';
import lockIcon from '@iconify/icons-mdi/lock';
import { Icon } from '@iconify/react';
import { Divider, Tooltip } from '@material-ui/core';
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
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch } from 'react-redux';
import { generatePath, useHistory } from 'react-router';
import { Link as RouterLink, LinkProps as RouterLinkProps, useLocation } from 'react-router-dom';
import semver from 'semver';
import { getVersion, useCluster } from '../lib/k8s';
import { StringDict } from '../lib/k8s/cluster';
import { createRouteURL, getRoute } from '../lib/router';
import { getCluster, getClusterPrefixedPath } from '../lib/util';
import { setSidebarSelected, setWhetherSidebarOpen } from '../redux/actions/actions';
import { useTypedSelector } from '../redux/reducers/reducers';
import { SidebarEntry } from '../redux/reducers/ui';
import store from '../redux/stores/store';
import { ReactComponent as LogoLight } from '../resources/icon-light.svg';
import { ReactComponent as LogoWithTextLight } from '../resources/logo-light.svg';
import { NameValueTable } from './common';
import CreateButton from './common/CreateButton';
import Tabs from './common/Tab';

const versionSnackbarHideTimeout = 5000; // ms
const versionFetchInterval = 60000; // ms

export const drawerWidth = 330;

const useStyle = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    background: theme.palette.sidebarBg,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    background: theme.palette.sidebarBg,
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    background: theme.palette.sidebarBg,
  },
  drawerPaper: {
    width: drawerWidth,
    background: theme.palette.sidebarBg,
  },
  toolbar: {
    borderBottom: '1px solid #1e1e1e',
    paddingTop: theme.spacing(1.5),
    paddingLeft: (isSidebarOpen: boolean) => isSidebarOpen ? theme.spacing(2) : theme.spacing(1),
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

const IconTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#474747',
    color: '#fff',
    minWidth: 60,
    padding: '0.5rem',
    fontSize: '0.8rem',
    border: '1px solid #474747',
    marginLeft: '1rem'
  }
}))(Tooltip);

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
        name: 'configMaps',
        label: 'Config Maps'
      },
    ]
  },
  {
    name: 'workloads',
    label: 'Workloads',
    icon: circleSlice2,
    subList: [
      {
        name: 'Pods',
        label: 'Pods'
      },
      {
        name: 'ReplicaSets',
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
        name: 'persistentVolumes',
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
        name: 'roles',
        label: 'Roles'
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
    marginTop: '5px',
    marginRight: '5px'
  },
}));

function VersionButton() {
  const sidebar = useTypedSelector(state => state.ui.sidebar);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useVersionButtonStyle();
  const [clusterVersion, setClusterVersion] = React.useState<StringDict | null>(null);
  const cluster = useCluster();
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
    function fetchVersion() {
      getVersion()
        .then((results: StringDict) => {
          setClusterVersion(results);
          let versionChange = 0;
          if (clusterVersion && results && results.gitVersion) {
            versionChange = semver.compare(results.gitVersion, clusterVersion.gitVersion);

            let msg = '';
            if (versionChange > 0) {
              msg = `Cluster version upgraded to ${results.gitVersion}`;
            } else if (versionChange < 0) {
              msg = `Cluster version downgraded to ${results.gitVersion}`;
            }

            if (msg) {
              enqueueSnackbar(msg, {
                key: 'version',
                preventDuplicate: true,
                autoHideDuration: versionSnackbarHideTimeout,
                variant: 'info',
              });
            }
          }
        })
        .catch((error: Error) => console.error('Getting the cluster version:', error));
    }

    if (!clusterVersion) {
      fetchVersion();
    }

    const intervalHandler = setInterval(() => {
      fetchVersion();
    }, versionFetchInterval);

    return function cleanup() {
      clearInterval(intervalHandler);
    };
  },
  // eslint-disable-next-line
  [clusterVersion]);

  // Use the location to make sure the version is changed, as it depends on the cluster
  // (defined in the URL ATM).
  // @todo: Update this if the active cluster management is changed.
  React.useEffect(() => {
    setClusterVersion(null);
  },
  [cluster]);

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
      >
        <Box display={sidebar.isSidebarOpen ? 'flex' : 'block'} alignItems="center">
          <Box>
            <Icon color="#adadad" icon={kubernetesIcon} className={classes.versionIcon} />
          </Box>
          <Box>
            {clusterVersion.gitVersion}
          </Box>
        </Box>
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
  name: string;
  icon?: object;
}

function ListItemLink(props: ListItemLinkProps) {
  const { primary, to, icon, name, ...other } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );
  let listItemLink = null;

  if (icon) {
    listItemLink =
      <ListItemIcon>
        <Icon icon={icon} width={30} height={30} />
      </ListItemIcon>;
  }

  let listItemLinkContainer = listItemLink;
  if (!primary) {
    listItemLinkContainer = listItemLink &&
    <IconTooltip title={name} placement="right-start">
      {listItemLink}
    </IconTooltip>;
  }

  return (
    <li>
      <ListItem
        button
        component={renderLink}
        {...other}
      >
        {listItemLinkContainer}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

export default function Sidebar() {
  const sidebar = useTypedSelector(state => state.ui.sidebar);
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = React.useMemo(() => prepareRoutes(), [sidebar.entries]);
  const [open, setOpen] = React.useState(sidebar.isSidebarOpen);
  const classes = useStyle(open);

  // Use the location to make sure the sidebar is changed, as it depends on the cluster
  // (defined in the URL ATM).
  // @todo: Update this if the active cluster management is changed.
  useLocation();
  if (!sidebar?.isVisible) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <Button onClick={() => {
          dispatch(setWhetherSidebarOpen(!open));
          setOpen(!open);
        }}
        >
          <SvgIcon
            className={classes.logo}
            component={open ? LogoWithTextLight : LogoLight}
            viewBox="0 0 auto 32"
          />
        </Button>
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
                fullWidth={open}
                {...item}
              />
            )}
          </List>
        </Grid>
        <Grid item>
          <Box textAlign="center">
            <CreateButton />
            <VersionButton />
          </Box>
        </Grid>
      </Grid>
    </Drawer>
  );
}

const useItemStyle = makeStyles(theme => ({
  nested: {
    '& .MuiListItem-root': {
      paddingLeft: theme.spacing(9),
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
    paddingLeft: '23px',
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
  linkSmallWidth: {
    backgroundColor: 'inherit !important',
  },
}));

interface SidebarItemProps extends ListItemProps, SidebarEntry {
  selectedName?: string | null;
  hasParent?: boolean;
  fullWidth?: boolean;
}

function SidebarItem(props: SidebarItemProps) {
  const {
    label,
    name,
    url = null,
    useClusterURL = false,
    subList = [],
    selectedName,
    hasParent = false,
    icon,
    fullWidth = true,
    ...other
  } = props;

  const classes = useItemStyle({fullWidth});

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
  if (!fullWidth) {
    linkClass += ' ' + classes.linkSmallWidth;
  }

  return (
    <React.Fragment>
      <ListItemLink
        selected={isSelected()}
        to={fullURL || ''}
        primary={fullWidth ? label : ''}
        classes={{
          selected: classes.linkSelected,
        }}
        className={linkClass}
        icon={icon}
        name={label}
        {...other}
      />
      {subList.length > 0 &&
        <Collapse in={fullWidth && expanded}>
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

function searchNameInSubList(sublist : SidebarEntry['subList'], name: string): boolean {
  if (!sublist) {
    return false;
  }
  for (let i = 0; i < sublist.length; i++) {
    if (sublist[i].name === name){
      return true;
    }
  }
  return false;
}

function findParentOfSubList(list: SidebarEntry[], name: string | null): SidebarEntry | null{
  if (!name) {
    return null;
  }

  let parent = null;
  for (let i = 0; i < list.length; i++) {
    if (searchNameInSubList(list[i].subList, name)) {
      parent = list[i];
    }
  }
  return parent;
}

export function NavigationTabs() {
  const history = useHistory();
  const sidebar = useTypedSelector(state => state.ui.sidebar);
  if (sidebar.isSidebarOpen) {
    return null;
  }

  let defaultIndex = null;
  const listItems = prepareRoutes();
  let navigationItem = listItems.find((item) => item.name === sidebar.selected);
  if (!navigationItem) {
    const parent = findParentOfSubList(listItems, sidebar.selected);
    if (!parent) {
      return null;
    }
    navigationItem = parent;
  }

  const subList = navigationItem.subList;
  if (!subList) {
    return null;
  }

  function tabChangeHandler(index: number) {
    if (!subList) {
      return;
    }
    let pathname;

    const url = subList[index].url;
    if (url) {
      pathname = generatePath(getClusterPrefixedPath(url), {cluster: getCluster()!});
    } else {
      pathname = createRouteURL(subList[index].name);
    }
    history.push({pathname});
  }

  if (createRouteURL(navigationItem.name)) {
    subList.unshift(navigationItem);
  }

  const tabRoutes = subList.map((item: any) => {
    return {'label': item.label, component: <></>};
  });

  defaultIndex = subList.findIndex((item) => item.name === sidebar.selected);
  return (
    <Box mb={2}>
      <Tabs
        tabs={tabRoutes}
        onTabChanged={(index) => {tabChangeHandler(index);}}
        defaultIndex={defaultIndex}
      />
      <Divider />
    </Box>);
}
