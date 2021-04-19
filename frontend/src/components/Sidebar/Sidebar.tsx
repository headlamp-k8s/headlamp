import { Icon } from '@iconify/react';
import { Divider, Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import clsx from 'clsx';
import React from 'react';
import { useDispatch } from 'react-redux';
import { generatePath, useHistory } from 'react-router';
import { Link as RouterLink, LinkProps as RouterLinkProps, useLocation } from 'react-router-dom';
import { createRouteURL, getRoute } from '../../lib/router';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';
import { setSidebarSelected, setWhetherSidebarOpen } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { SidebarEntry } from '../../redux/reducers/ui';
import store from '../../redux/stores/store';
import { ReactComponent as LogoLight } from '../../resources/icon-light.svg';
import { ReactComponent as LogoWithTextLight } from '../../resources/logo-light.svg';
import CreateButton from '../common/Resource/CreateButton';
import Tabs from '../common/Tabs';
import prepareRoutes from './prepareRoutes';
import VersionButton from './VersionButton';

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
    paddingLeft: (props: { isSidebarOpen: boolean }) =>
      props.isSidebarOpen ? theme.spacing(2) : theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  sidebarGrid: {
    height: '100%',
  },
  '.MuiListItemText-primary': {
    color: 'red',
  },
  logo: {
    height: '32px',
    width: 'auto',
  },
}));

const IconTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#474747',
    color: '#fff',
    minWidth: 60,
    padding: '0.5rem',
    fontSize: '0.8rem',
    border: '1px solid #474747',
    marginLeft: '1rem',
  },
}))(Tooltip);

interface ListItemLinkProps {
  primary: string;
  to: string;
  name: string;
  icon?: object;
}

function ListItemLink(props: ListItemLinkProps) {
  const { primary, to, icon, name, ...other } = props;
  const namespaces = useTypedSelector(state => state.filter.namespaces);
  const namespaceURLString = namespaces.size !== 0 ? `?namespace=${[...namespaces].join('+')}` : '';

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
        <RouterLink to={{ pathname: to, search: namespaceURLString }} ref={ref} {...itemProps} />
      )),
    [to, namespaceURLString]
  );
  let listItemLink = null;

  if (icon) {
    listItemLink = (
      <ListItemIcon>
        <Icon icon={icon} width={30} height={30} />
      </ListItemIcon>
    );
  }

  let listItemLinkContainer = listItemLink;
  if (!primary) {
    listItemLinkContainer = listItemLink && (
      <IconTooltip title={name} placement="right-start">
        {listItemLink}
      </IconTooltip>
    );
  }

  return (
    <li>
      <ListItem button component={renderLink} {...other}>
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
  const classes = useStyle({ isSidebarOpen: open });

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
        <Button
          onClick={() => {
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
            {items.map((item, i) => (
              <SidebarItem key={i} selectedName={sidebar.selected} fullWidth={open} {...item} />
            ))}
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
    },
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
      svg: {
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

  const classes = useItemStyle({ fullWidth });

  let fullURL = url;
  if (fullURL && useClusterURL && getCluster()) {
    fullURL = generatePath(getClusterPrefixedPath(url), { cluster: getCluster()! });
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
      {subList.length > 0 && (
        <Collapse in={fullWidth && expanded}>
          <List component="div" disablePadding className={classes.nested}>
            {subList.map((item, i) => (
              <SidebarItem key={i} selectedName={selectedName} hasParent {...item} />
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
}

export function useSidebarItem(itemName: string | null) {
  const dispatch = useDispatch();

  React.useEffect(
    () => {
      dispatch(setSidebarSelected(itemName));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
}

function searchNameInSubList(sublist: SidebarEntry['subList'], name: string): boolean {
  if (!sublist) {
    return false;
  }
  for (let i = 0; i < sublist.length; i++) {
    if (sublist[i].name === name) {
      return true;
    }
  }
  return false;
}

function findParentOfSubList(list: SidebarEntry[], name: string | null): SidebarEntry | null {
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
  let navigationItem = listItems.find(item => item.name === sidebar.selected);
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
      pathname = generatePath(getClusterPrefixedPath(url), { cluster: getCluster()! });
    } else {
      pathname = createRouteURL(subList[index].name);
    }
    history.push({ pathname });
  }

  if (createRouteURL(navigationItem.name)) {
    subList.unshift(navigationItem);
  }

  const tabRoutes = subList.map((item: any) => {
    return { label: item.label, component: <></> };
  });

  defaultIndex = subList.findIndex(item => item.name === sidebar.selected);
  return (
    <Box mb={2}>
      <Tabs
        tabs={tabRoutes}
        onTabChanged={index => {
          tabChangeHandler(index);
        }}
        defaultIndex={defaultIndex}
      />
      <Divider />
    </Box>
  );
}
