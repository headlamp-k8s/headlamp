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
import { useLocation } from 'react-router-dom';
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

export default function Sidebar() {
  const { t, i18n } = useTranslation(['glossary', 'frequent']);
  const specialSidebarOptions: SidebarItemProps[] = [
    {
      name: t('frequent|back'),
      icon: 'mdi:arrow-left',
      label: t('frequent|Back'),
    },
    {
      name: t('frequent|notifications'),
      icon: 'mdi:bell',
      label: t('frequent|Notifications'),
      url: '/notifications',
    },
  ];

  const sidebar = useTypedSelector(state => state.ui.sidebar);
  const isSidebarOpen = useTypedSelector(state => state.ui.sidebar.isSidebarOpen);
  const isSidebarOpenUserSelected = useTypedSelector(
    state => state.ui.sidebar.isSidebarOpenUserSelected
  );
  const location = useLocation();
  const arePluginsLoaded = useTypedSelector(state => state.ui.pluginsLoaded);
  const namespaces = useTypedSelector(state => state.filter.namespaces);
  const [isSpecialSidebarOpen, setSpecialSidebarOpen] = React.useState(false);
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = React.useMemo(
    () => (isSpecialSidebarOpen ? specialSidebarOptions : prepareRoutes(t)),
    [sidebar.entries, i18n.language, arePluginsLoaded, isSpecialSidebarOpen]
  );
  const search = namespaces.size !== 0 ? `?namespace=${[...namespaces].join('+')}` : '';

  React.useEffect(() => {
    if (specialSidebarOptions.map(item => item.name).includes(location.pathname.split('/')[1])) {
      setSpecialSidebarOpen(true);
    } else {
      setSpecialSidebarOpen(false);
    }
  }, [location]);

  // Use the location to make sure the sidebar is changed, as it depends on the cluster
  // (defined in the URL ATM).
  // @todo: Update this if the active cluster management is changed.
  useLocation();
  if (!sidebar?.isVisible) {
    return null;
  }

  return (
    <PureSidebar
      items={items}
      open={isSidebarOpen}
      openUserSelected={isSidebarOpenUserSelected}
      selectedName={sidebar?.selected}
      search={search}
      onToggleOpen={() => {
        dispatch(setWhetherSidebarOpen(!sidebar.isSidebarOpen));
      }}
      linkArea={
        !isSpecialSidebarOpen && (
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
        PaperProps={{
          component: 'nav',
        }}
        open={temporarySideBarOpen}
        onClose={onToggleOpen}
      >
        {contents}
      </Drawer>
    );
  }

  return (
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
      PaperProps={{
        component: 'nav',
      }}
    >
      {contents}
    </Drawer>
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

export { NavigationTabs };
