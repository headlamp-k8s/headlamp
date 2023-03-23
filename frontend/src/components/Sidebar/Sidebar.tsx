import { InlineIcon } from '@iconify/react';
import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import helpers from '../../helpers';
import { useCluster } from '../../lib/k8s';
import { createRouteURL } from '../../lib/router';
import { setSidebarSelected, setWhetherSidebarOpen } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import CreateButton from '../common/Resource/CreateButton';
import HeadlampButton from './HeadlampButton';
import NavigationTabs from './NavigationTabs';
import prepareRoutes from './prepareRoutes';
import SidebarItem, { SidebarEntryProps, SidebarItemProps } from './SidebarItem';
import VersionButton from './VersionButton';

export const drawerWidth = 330;
export const drawerWidthClosed = 64;

export enum DefaultSidebars {
  HOME = 'HOME',
  IN_CLUSTER = 'IN-CLUSTER',
}

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
    [theme.breakpoints.down('xs')]: {
      background: 'initial',
    },
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(0),
    },
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    background: theme.palette.sidebarBg,
  },
  drawerPaper: {
    width: drawerWidth,
    background: theme.palette.sidebarBg,
  },
  sidebarGrid: {
    height: '100%',
  },
  '.MuiListItemText-primary': {
    color: 'red',
  },
}));

const useButtonStyle = makeStyles({
  button: {
    color: '#adadad',
  },
});

export default function Sidebar() {
  const { t, i18n } = useTranslation(['glossary', 'frequent']);

  const settingsMenu: SidebarItemProps = {
    name: 'settings',
    icon: 'mdi:cog',
    label: t('frequent|Settings'),
    url: '/settings',
  };

  const specialSidebarOptions: SidebarItemProps[] = [
    {
      name: 'clusters',
      icon: 'mdi:hexagon-multiple',
      label: t('glossary|Cluster'),
      url: '/',
    },
    {
      name: 'notifications',
      icon: 'mdi:bell',
      label: t('frequent|Notifications'),
      url: '/notifications',
    },
  ];

  specialSidebarOptions.push(settingsMenu);

  /** Only adds settings menu when running as an App*/
  if (helpers.isElectron() === true) {
    settingsMenu.subList = [
      { name: 'plugins', label: t('settings|Plugins'), url: '/settings/plugins' },
    ];
  }

  const sidebar = useTypedSelector(state => state.ui.sidebar);
  const isSidebarOpen = useTypedSelector(state => state.ui.sidebar.isSidebarOpen);
  const isSidebarOpenUserSelected = useTypedSelector(
    state => state.ui.sidebar.isSidebarOpenUserSelected
  );
  const history = useHistory();
  const buttonClasses = useButtonStyle();
  const arePluginsLoaded = useTypedSelector(state => state.plugins.loaded);
  const namespaces = useTypedSelector(state => state.filter.namespaces);
  const dispatch = useDispatch();
  const cluster = useCluster();
  const items = React.useMemo(
    () => prepareRoutes(t, sidebar.selected.sidebar || ''),
    [cluster, sidebar.selected, sidebar.entries, sidebar.filters, i18n.language, arePluginsLoaded]
  );
  const search = namespaces.size !== 0 ? `?namespace=${[...namespaces].join('+')}` : '';

  if (!sidebar?.isVisible) {
    return null;
  }

  return (
    <PureSidebar
      items={items}
      open={isSidebarOpen}
      openUserSelected={isSidebarOpenUserSelected}
      selectedName={sidebar?.selected.item}
      search={search}
      onToggleOpen={() => {
        dispatch(setWhetherSidebarOpen(!sidebar.isSidebarOpen));
      }}
      linkArea={
        sidebar.selected.sidebar === DefaultSidebars.HOME
          ? helpers.isElectron() && (
            <Box pb={2}>
              <Button
                className={buttonClasses.button}
                onClick={() => history.push(createRouteURL('loadKubeConfig'))}
                startIcon={<InlineIcon icon="mdi:plus" />}
              >
                {t('frequent|Add Cluster')}
              </Button>
            </Box>
          )
          : sidebar.selected.sidebar === DefaultSidebars.IN_CLUSTER && (
            <>
              <CreateButton />
              <VersionButton />
            </>
          )
      }
    />
  );
}

export interface PureSidebarProps {
  /** If the sidebar is fully expanded open or shrunk. */
  open?: boolean;
  /** If the user has selected to open/shrink the sidebar */
  openUserSelected?: boolean;
  /** To show in the sidebar. */
  items: SidebarEntryProps[];
  /** The selected route name of the sidebar open. */
  selectedName: string | null;
  /** Called when sidebar toggles between open and closed. */
  onToggleOpen: () => void;
  /** The search part of the url */
  search?: string;
  /** A place to put extra components below the links. */
  linkArea: React.ReactNode;
}

export function PureSidebar({
  open,
  openUserSelected,
  items,
  selectedName,
  onToggleOpen,
  search,
  linkArea,
}: PureSidebarProps) {
  const classes = useStyle();
  const { t } = useTranslation(['frequent']);
  const temporaryDrawer = useMediaQuery('(max-width:600px)');
  const smallSideOnly = useMediaQuery('(max-width:960px) and (min-width:600px)');
  const temporarySideBarOpen = open === true && temporaryDrawer && openUserSelected === true;

  // The large sidebar does not open in medium view (600-960px).
  const largeSideBarOpen =
    (open === true && !smallSideOnly) || (open === true && temporarySideBarOpen);

  /**
   * For closing the sidebar if temporaryDrawer on mobile.
   */
  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    onToggleOpen();
  };

  const contents = (
    <>
      <HeadlampButton
        open={largeSideBarOpen}
        onToggleOpen={onToggleOpen}
        disabled={smallSideOnly}
      />
      <Grid
        className={classes.sidebarGrid}
        container
        direction="column"
        justifyContent="space-between"
        wrap="nowrap"
      >
        <Grid item>
          <List
            onClick={temporaryDrawer ? toggleDrawer : undefined}
            onKeyDown={temporaryDrawer ? toggleDrawer : undefined}
          >
            {items.map(item => (
              <SidebarItem
                key={item.name}
                selectedName={selectedName}
                fullWidth={largeSideBarOpen}
                search={search}
                {...item}
              />
            ))}
          </List>
        </Grid>
        <Grid item>
          <Box textAlign="center">{linkArea}</Box>
        </Grid>
      </Grid>
    </>
  );

  if (temporaryDrawer) {
    return (
      <Box component="nav" aria-label={t('frequent|Navigation')}>
        <Drawer
          variant="temporary"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: temporarySideBarOpen,
            [classes.drawerClose]: !temporarySideBarOpen,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: temporarySideBarOpen,
              [classes.drawerClose]: !temporarySideBarOpen,
            }),
          }}
          open={temporarySideBarOpen}
          onClose={onToggleOpen}
        >
          {contents}
        </Drawer>
      </Box>
    );
  }

  return (
    <Box component="nav" aria-label={t('frequent|Navigation')}>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: largeSideBarOpen,
          [classes.drawerClose]: !largeSideBarOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: largeSideBarOpen,
            [classes.drawerClose]: !largeSideBarOpen,
          }),
        }}
      >
        {contents}
      </Drawer>
    </Box>
  );
}

export function useSidebarItem(
  sidebarDesc: string | null | { item: string | null; sidebar?: string }
) {
  let itemName: string | null = null;
  let sidebar: DefaultSidebars | string = DefaultSidebars.IN_CLUSTER;
  if (typeof sidebarDesc === 'string') {
    itemName = sidebarDesc;
  } else if (!!sidebarDesc) {
    itemName = sidebarDesc.item;
    if (!!sidebarDesc.sidebar) {
      sidebar = sidebarDesc.sidebar || DefaultSidebars.IN_CLUSTER;
    }
  }

  const dispatch = useDispatch();

  React.useEffect(
    () => {
      dispatch(setSidebarSelected(itemName, sidebar));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemName]
  );
}

export { NavigationTabs };
