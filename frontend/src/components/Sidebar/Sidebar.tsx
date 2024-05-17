import { InlineIcon } from '@iconify/react';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import helpers from '../../helpers';
import { useCluster } from '../../lib/k8s';
import { createRouteURL } from '../../lib/router';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { ActionButton } from '../common';
import CreateButton from '../common/Resource/CreateButton';
import NavigationTabs from './NavigationTabs';
import prepareRoutes from './prepareRoutes';
import SidebarItem from './SidebarItem';
import {
  DefaultSidebars,
  setSidebarSelected,
  setWhetherSidebarOpen,
  SidebarEntry,
} from './sidebarSlice';
import VersionButton from './VersionButton';

export const drawerWidth = 240;
export const mobileDrawerWidth = 320;
export const drawerWidthClosed = 64;

// exported for backwards compatibility for plugins
export { DefaultSidebars };

export function useSidebarInfo() {
  const isSidebarOpen = useTypedSelector(state => state.sidebar.isSidebarOpen);
  const isSidebarOpenUserSelected = useTypedSelector(
    state => state.sidebar.isSidebarOpenUserSelected
  );
  const isTemporary = useMediaQuery('(max-width:599px)');
  const isNarrowOnly = useMediaQuery('(max-width:960px) and (min-width:600px)');
  const temporarySideBarOpen =
    isSidebarOpen === true && isTemporary && isSidebarOpenUserSelected === true;

  // The large sidebar does not open in medium view (600-960px).
  const isOpen =
    (isSidebarOpen === true && !isNarrowOnly) || (isSidebarOpen === true && temporarySideBarOpen);

  return {
    isCollapsed: !temporarySideBarOpen && !isNarrowOnly,
    isOpen,
    isNarrow: !isSidebarOpen || isNarrowOnly,
    canExpand: !isNarrowOnly,
    isTemporary,
    isUserOpened: isSidebarOpenUserSelected,
    width: isOpen ? `${drawerWidth}px` : isTemporary ? '0px' : `${drawerWidthClosed}px`,
  };
}

function AddClusterButton() {
  const history = useHistory();
  const { t } = useTranslation(['translation']);
  const { isOpen } = useSidebarInfo();

  return (
    <Box pb={2}>
      {isOpen ? (
        <Button
          onClick={() => history.push(createRouteURL('loadKubeConfig'))}
          startIcon={<InlineIcon icon="mdi:plus-box-outline" />}
        >
          {t('translation|Add Cluster')}
        </Button>
      ) : (
        <ActionButton
          onClick={() => history.push(createRouteURL('loadKubeConfig'))}
          icon="mdi:plus-box-outline"
          description={t('translation|Add Cluster')}
          color="#adadad"
          width={38}
        />
      )}
    </Box>
  );
}

function SidebarToggleButton() {
  const dispatch = useDispatch();
  const { isOpen, isNarrow, canExpand, isTemporary } = useSidebarInfo();

  const { t } = useTranslation();
  const isNarrowOnly = isNarrow && !canExpand;

  if (isTemporary || isNarrowOnly) {
    return null;
  }

  return (
    <Box textAlign={isOpen ? 'right' : 'center'}>
      <ActionButton
        iconButtonProps={{
          size: 'small',
        }}
        onClick={() => {
          dispatch(setWhetherSidebarOpen(!isOpen));
        }}
        icon={isOpen ? 'mdi:chevron-left-box-outline' : 'mdi:chevron-right-box-outline'}
        description={t('translation|Collapse Sidebar')}
      />
    </Box>
  );
}

function DefaultLinkArea(props: { sidebarName: string; isOpen: boolean }) {
  const { sidebarName, isOpen } = props;

  if (sidebarName === DefaultSidebars.HOME) {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={isOpen ? 'row' : 'column'}
        p={1}
      >
        <Box>{helpers.isElectron() && <AddClusterButton />}</Box>
        <Box>
          <SidebarToggleButton />
        </Box>
      </Box>
    );
  }

  return (
    <Box textAlign="center">
      <CreateButton isNarrow={!isOpen} />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={isOpen ? 'row' : 'column'}
        p={1}
      >
        <Box>
          <VersionButton />
        </Box>
        <Box>
          <SidebarToggleButton />
        </Box>
      </Box>
    </Box>
  );
}

export default function Sidebar() {
  const { t, i18n } = useTranslation(['glossary', 'translation']);

  const sidebar = useTypedSelector(state => state.sidebar);
  const {
    isOpen,
    isUserOpened,
    isNarrow,
    canExpand,
    isTemporary: isTemporaryDrawer,
  } = useSidebarInfo();
  const isNarrowOnly = isNarrow && !canExpand;
  const arePluginsLoaded = useTypedSelector(state => state.plugins.loaded);
  const namespaces = useTypedSelector(state => state.filter.namespaces);
  const dispatch = useDispatch();
  const cluster = useCluster();
  const items = React.useMemo(() => {
    // If the sidebar is null, then it means it should not be visible.
    if (sidebar.selected.sidebar === null) {
      return [];
    }
    return prepareRoutes(t, sidebar.selected.sidebar || '');
  }, [
    cluster,
    sidebar.selected,
    sidebar.entries,
    sidebar.filters,
    i18n.language,
    arePluginsLoaded,
  ]);

  const search = namespaces.size !== 0 ? `?namespace=${[...namespaces].join('+')}` : '';

  if (sidebar.selected.sidebar === null || !sidebar?.isVisible) {
    return null;
  }

  return (
    <PureSidebar
      items={items}
      open={isOpen}
      openUserSelected={isUserOpened}
      isNarrowOnly={isNarrowOnly}
      isTemporaryDrawer={isTemporaryDrawer}
      selectedName={sidebar?.selected.item}
      search={search}
      onToggleOpen={() => {
        dispatch(setWhetherSidebarOpen(!sidebar.isSidebarOpen));
      }}
      linkArea={<DefaultLinkArea sidebarName={sidebar.selected.sidebar || ''} isOpen={isOpen} />}
    />
  );
}

export interface PureSidebarProps {
  /** If the sidebar is fully expanded open or shrunk. */
  open?: boolean;
  /** If the user has selected to open/shrink the sidebar */
  openUserSelected?: boolean;
  /** To show in the sidebar. */
  items: SidebarEntry[];
  /** The selected route name of the sidebar open. */
  selectedName: string | null;
  /** If the sidebar is the temporary one (full sidebar when user selects it in mobile). */
  isTemporaryDrawer?: boolean;
  /** If the sidebar is in narrow mode. */
  isNarrowOnly?: boolean;
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
  isTemporaryDrawer = false,
  isNarrowOnly = false,
  onToggleOpen,
  search,
  linkArea,
}: PureSidebarProps) {
  const { t } = useTranslation();
  const temporarySideBarOpen = open === true && isTemporaryDrawer && openUserSelected === true;

  // The large sidebar does not open in medium view (600-960px).
  const largeSideBarOpen =
    (open === true && !isNarrowOnly) || (open === true && temporarySideBarOpen);

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
      {!isTemporaryDrawer && (
        <Box
          sx={theme => ({
            ...theme.mixins.toolbar,
          })}
        />
      )}
      <Grid
        sx={{
          height: '100%',
        }}
        container
        direction="column"
        justifyContent="space-between"
        wrap="nowrap"
      >
        <Grid item>
          <List
            onClick={isTemporaryDrawer ? toggleDrawer : undefined}
            onKeyDown={isTemporaryDrawer ? toggleDrawer : undefined}
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
          <Box
            textAlign="center"
            p={0}
            sx={theme => ({
              '&, & *, & svg': {
                color: theme.palette.sidebarLink.color,
              },
              '& .MuiButton-root': {
                color: theme.palette.sidebarButtonInLinkArea.color,
                '&:hover': {
                  background: theme.palette.sidebarButtonInLinkArea.hover.background,
                },
              },
              '& .MuiButton-containedPrimary': {
                background: theme.palette.sidebarButtonInLinkArea.primary.background,
                '&:hover': {
                  background: theme.palette.sidebarButtonInLinkArea.hover.background,
                },
              },
            })}
          >
            {linkArea}
          </Box>
        </Grid>
      </Grid>
    </>
  );

  const conditionalProps = isTemporaryDrawer
    ? {
        open: temporarySideBarOpen,
        onClose: onToggleOpen,
      }
    : {};

  return (
    <Box component="nav" aria-label={t('translation|Navigation')}>
      <Drawer
        variant={isTemporaryDrawer ? 'temporary' : 'permanent'}
        sx={theme => {
          const drawer = {
            width: drawerWidth,
            flexShrink: 0,
            background: theme.palette.sidebarBg,
          };

          const drawerOpen = {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            background: theme.palette.sidebarBg,
          };

          const drawerClose = {
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: '56px',
            [theme.breakpoints.down('xs')]: {
              background: 'initial',
            },
            [theme.breakpoints.down('sm')]: {
              width: theme.spacing(0),
            },
            [theme.breakpoints.up('sm')]: {
              width: '72px',
            },
            background: theme.palette.sidebarBg,
          };

          if (
            (isTemporaryDrawer && temporarySideBarOpen) ||
            (!isTemporaryDrawer && largeSideBarOpen)
          ) {
            return { ...drawer, ...drawerOpen, '& .MuiPaper-root': { ...drawerOpen } };
          } else {
            return { ...drawer, ...drawerClose, '& .MuiPaper-root': { ...drawerClose } };
          }
        }}
        {...conditionalProps}
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
  let sidebar: DefaultSidebars | string | null = DefaultSidebars.IN_CLUSTER;
  if (typeof sidebarDesc === 'string') {
    itemName = sidebarDesc;
  } else if (sidebarDesc === null) {
    sidebar = null;
  } else if (!!sidebarDesc) {
    itemName = sidebarDesc.item;
    if (!!sidebarDesc.sidebar) {
      sidebar = sidebarDesc.sidebar || DefaultSidebars.IN_CLUSTER;
    }
  }

  const dispatch = useDispatch();

  React.useEffect(
    () => {
      dispatch(setSidebarSelected({ item: itemName, sidebar: sidebar }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemName]
  );
}

export { NavigationTabs };
