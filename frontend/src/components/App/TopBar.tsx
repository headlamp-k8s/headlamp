import { Icon } from '@iconify/react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { has } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import helpers from '../../helpers';
import { getToken, setToken } from '../../lib/auth';
import { useCluster, useClustersConf } from '../../lib/k8s';
import { createRouteURL } from '../../lib/router';
import {
  AppBarAction,
  AppBarActionsProcessor,
  DefaultAppBarAction,
  HeaderAction,
  HeaderActionType,
} from '../../redux/actionButtonsSlice';
import { setVersionDialogOpen } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { SettingsButton } from '../App/Settings';
import { ClusterTitle } from '../cluster/Chooser';
import ErrorBoundary from '../common/ErrorBoundary';
import { drawerWidth } from '../Sidebar';
import HeadlampButton from '../Sidebar/HeadlampButton';
import { setWhetherSidebarOpen } from '../Sidebar/sidebarSlice';
import { AppLogo } from './AppLogo';

export interface TopBarProps {}

export function useAppBarActionsProcessed() {
  const appBarActions = useTypedSelector(state => state.actionButtons.appBarActions);
  const appBarActionsProcessors = useTypedSelector(
    state => state.actionButtons.appBarActionsProcessors
  );

  return { appBarActions, appBarActionsProcessors };
}

export function processAppBarActions(
  appBarActions: AppBarAction[],
  appBarActionsProcessors: AppBarActionsProcessor[]
): AppBarAction[] {
  let appBarActionsProcessed = [...appBarActions];
  for (const appBarActionsProcessor of appBarActionsProcessors) {
    appBarActionsProcessed = appBarActionsProcessor.processor({ actions: appBarActionsProcessed });
  }
  return appBarActionsProcessed;
}

export default function TopBar({}: TopBarProps) {
  const dispatch = useDispatch();
  const isMedium = useMediaQuery('(max-width:960px)');

  const isSidebarOpen = useTypedSelector(state => state.sidebar.isSidebarOpen);
  const isSidebarOpenUserSelected = useTypedSelector(
    state => state.sidebar.isSidebarOpenUserSelected
  );
  const hideAppBar = useTypedSelector(state => state.ui.hideAppBar);

  const clustersConfig = useClustersConf();
  const cluster = useCluster();
  const history = useHistory();
  const { appBarActions, appBarActionsProcessors } = useAppBarActionsProcessed();

  function hasToken() {
    return !!cluster ? !!getToken(cluster) : false;
  }

  function logout() {
    if (!!cluster) {
      setToken(cluster, null);
    }
    history.push('/');
  }

  if (hideAppBar) {
    return null;
  }
  return (
    <PureTopBar
      appBarActions={appBarActions}
      appBarActionsProcessors={appBarActionsProcessors}
      logout={logout}
      hasToken={hasToken()}
      isSidebarOpen={isSidebarOpen}
      isSidebarOpenUserSelected={isSidebarOpenUserSelected}
      onToggleOpen={() => {
        // For medium view we default to closed if they have not made a selection.
        // This handles the case when the user resizes the window from large to small.
        // If they have not made a selection then the window size stays the default for
        //   the size.

        const openSideBar =
          isMedium && isSidebarOpenUserSelected === undefined ? false : isSidebarOpen;

        dispatch(setWhetherSidebarOpen(!openSideBar));
      }}
      cluster={cluster || undefined}
      clusters={clustersConfig || undefined}
    />
  );
}

export interface PureTopBarProps {
  /** If the sidebar is fully expanded open or shrunk. */
  appBarActions: AppBarAction[];
  /** functions which filter the app bar action buttons */
  appBarActionsProcessors?: AppBarActionsProcessor[];
  logout: () => void;
  hasToken: boolean;
  clusters?: {
    [clusterName: string]: any;
  };
  cluster?: string;
  isSidebarOpen?: boolean;
  isSidebarOpenUserSelected?: boolean;

  /** Called when sidebar toggles between open and closed. */
  onToggleOpen: () => void;
}

function AppBarActionsMenu({ appBarActions }: { appBarActions: HeaderActionType[] }) {
  const actions = (function stateActions() {
    return React.Children.toArray(
      appBarActions.map(action => {
        const Action = has(action, 'action') ? (action as HeaderAction).action : action;
        if (React.isValidElement(Action)) {
          return (
            <ErrorBoundary>
              <MenuItem>{Action}</MenuItem>
            </ErrorBoundary>
          );
        } else if (Action === null) {
          return null;
        } else if (typeof Action === 'function') {
          return (
            <ErrorBoundary>
              <MenuItem>
                <Action />
              </MenuItem>
            </ErrorBoundary>
          );
        }
      })
    );
  })();

  return <>{actions}</>;
}
function AppBarActions({ appBarActions }: { appBarActions: HeaderActionType[] }) {
  const actions = (function stateActions() {
    return React.Children.toArray(
      appBarActions.map(action => {
        const Action = has(action, 'action') ? (action as HeaderAction).action : action;
        if (React.isValidElement(Action)) {
          return <ErrorBoundary>{Action}</ErrorBoundary>;
        } else if (Action === null) {
          return null;
        } else if (typeof Action === 'function') {
          return (
            <ErrorBoundary>
              <Action />
            </ErrorBoundary>
          );
        }
      })
    );
  })();

  return <>{actions}</>;
}

export function PureTopBar({
  appBarActions,
  appBarActionsProcessors = [],
  logout,
  hasToken,
  cluster,
  clusters,
  isSidebarOpen,
  isSidebarOpenUserSelected,
  onToggleOpen,
}: PureTopBarProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const history = useHistory();

  const openSideBar = !!(isSidebarOpenUserSelected === undefined ? false : isSidebarOpen);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const isClusterContext = !!cluster;

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const userMenuId = 'primary-user-menu';

  const renderUserMenu = !!isClusterContext && (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={userMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={() => {
        handleMenuClose();
        handleMobileMenuClose();
      }}
      style={{ zIndex: 1400 }}
      sx={{
        '& .MuiMenu-list': {
          paddingBottom: 0,
        },
      }}
    >
      <MenuItem
        component="a"
        onClick={() => {
          logout();
          handleMenuClose();
        }}
        disabled={!hasToken}
      >
        <ListItemIcon>
          <Icon icon="mdi:logout" />
        </ListItemIcon>
        <ListItemText primary={t('Log out')} secondary={hasToken ? null : t('(No token set up)')} />
      </MenuItem>
      <MenuItem
        component="a"
        onClick={() => {
          history.push(createRouteURL('settings'));
          handleMenuClose();
        }}
      >
        <ListItemIcon>
          <Icon icon="mdi:cog-box" />
        </ListItemIcon>
        <ListItemText>{t('translation|General Settings')}</ListItemText>
      </MenuItem>
      <MenuItem
        component="a"
        onClick={() => {
          dispatch(setVersionDialogOpen(true));
          handleMenuClose();
        }}
      >
        <ListItemIcon>
          <Icon icon="mdi:information-outline" />
        </ListItemIcon>
        <ListItemText>
          {helpers.getProductName()} {helpers.getVersion()['VERSION']}
        </ListItemText>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-menu-mobile';
  const allAppBarActionsMobile: AppBarAction[] = [
    {
      id: DefaultAppBarAction.CLUSTER,
      action: isClusterContext && (
        <ClusterTitle cluster={cluster} clusters={clusters} onClick={() => handleMenuClose()} />
      ),
    },
    ...appBarActions,
    {
      id: DefaultAppBarAction.NOTIFICATION,
      action: null,
    },
    {
      id: DefaultAppBarAction.SETTINGS,
      action: (
        <MenuItem>
          <SettingsButton onClickExtra={handleMenuClose} />
        </MenuItem>
      ),
    },
    {
      id: DefaultAppBarAction.USER,
      action: !!isClusterContext && (
        <MenuItem>
          <IconButton
            aria-label={t('Account of current user')}
            aria-controls={userMenuId}
            aria-haspopup="true"
            color="inherit"
            onClick={event => {
              handleMenuClose();
              handleProfileMenuOpen(event);
            }}
            size="medium"
          >
            <Icon icon="mdi:account" />
          </IconButton>
        </MenuItem>
      ),
    },
  ];
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <AppBarActionsMenu
        appBarActions={processAppBarActions(allAppBarActionsMobile, appBarActionsProcessors)}
      />
    </Menu>
  );

  const allAppBarActions: AppBarAction[] = [
    {
      id: DefaultAppBarAction.CLUSTER,
      action: (
        <Box
          sx={theme => ({
            paddingRight: theme.spacing(10),
          })}
        >
          <ClusterTitle cluster={cluster} clusters={clusters} onClick={handleMobileMenuClose} />
        </Box>
      ),
    },
    ...appBarActions,
    {
      id: DefaultAppBarAction.NOTIFICATION,
      action: null,
    },
    {
      id: DefaultAppBarAction.SETTINGS,
      action: <SettingsButton onClickExtra={handleMenuClose} />,
    },
    {
      id: DefaultAppBarAction.USER,
      action: !!isClusterContext && (
        <IconButton
          aria-label={t('Account of current user')}
          aria-controls={userMenuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
          size="medium"
        >
          <Icon icon="mdi:account" />
        </IconButton>
      ),
    },
  ];
  return (
    <>
      <AppBar
        position="fixed"
        sx={theme => ({
          marginLeft: drawerWidth,
          zIndex: theme.zIndex.drawer + 1,
          '& > *': {
            color: theme.palette.text.primary,
          },
          backgroundColor: theme.palette.background.default,
        })}
        elevation={1}
        component="nav"
        aria-label={t('Appbar Tools')}
        enableColorOnDark
      >
        <Toolbar
          sx={{
            [theme.breakpoints.down('xs')]: {
              paddingLeft: 0,
              paddingRight: 0,
            },
          }}
        >
          {isSmall ? (
            <>
              <HeadlampButton open={openSideBar} onToggleOpen={onToggleOpen} />
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                aria-label={t('show more')}
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                size="medium"
              >
                <Icon icon="mdi:more-vert" />
              </IconButton>
            </>
          ) : (
            <>
              <AppLogo />
              <Box sx={{ flexGrow: 1 }} />
              <AppBarActions
                appBarActions={processAppBarActions(allAppBarActions, appBarActionsProcessors)}
              />
            </>
          )}
        </Toolbar>
      </AppBar>
      {renderUserMenu}
      {isSmall && renderMobileMenu}
    </>
  );
}
