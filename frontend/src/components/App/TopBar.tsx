import { Icon } from '@iconify/react';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import helpers from '../../helpers';
import LocaleSelect from '../../i18n/LocaleSelect/LocaleSelect';
import { getToken, setToken } from '../../lib/auth';
import { useCluster, useClustersConf } from '../../lib/k8s';
import {
  HeaderActionType,
  setVersionDialogOpen,
  setWhetherSidebarOpen,
} from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { ClusterTitle } from '../cluster/Chooser';
import ErrorBoundary from '../common/ErrorBoundary';
import { drawerWidth } from '../Sidebar';
import HeadlampButton from '../Sidebar/HeadlampButton';
import Notifications from './Notifications';
import ThemeChangeButton from './ThemeChangeButton';

export interface TopBarProps {}

export default function TopBar({}: TopBarProps) {
  const appBarActions = useTypedSelector(state => state.ui.views.appBar.actions);
  const dispatch = useDispatch();
  const isMedium = useMediaQuery('(max-width:960px)');

  const isSidebarOpen = useTypedSelector(state => state.ui.sidebar.isSidebarOpen);
  const isSidebarOpenUserSelected = useTypedSelector(
    state => state.ui.sidebar.isSidebarOpenUserSelected
  );
  const hideAppBar = useTypedSelector(state => state.ui.hideAppBar);

  const clustersConfig = useClustersConf();
  const cluster = useCluster();
  const history = useHistory();

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
  appBarActions: HeaderActionType[];
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appbar: {
      background: theme.palette.background.default,
      // When the draw is open, we move the app bar over.
      paddingLeft: (props: { isSidebarOpen: boolean | undefined; isSmall: boolean }) =>
        props.isSidebarOpen ? `${drawerWidth}px` : props.isSmall ? '0px' : '60px',
      marginLeft: drawerWidth,
      '& > *': {
        color: theme.palette.text.primary,
      },
    },
    toolbar: {
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 0,
      },
    },
    grow: {
      flexGrow: 1,
    },
    clusterTitle: {
      display: 'flex',
      justifyContent: 'center',
    },
    versionLink: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      textAlign: 'center',
    },
    userMenu: {
      '& .MuiMenu-list': {
        paddingBottom: 0,
      },
    },
  })
);

function AppBarActionsMenu({ appBarActions }: { appBarActions: HeaderActionType[] }) {
  const actions = (function stateActions() {
    return React.Children.toArray(
      appBarActions.map(Action => {
        if (React.isValidElement(Action)) {
          return (
            <ErrorBoundary>
              <MenuItem>{Action}</MenuItem>
            </ErrorBoundary>
          );
        } else if (Action === null) {
          return null;
        } else {
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
      appBarActions.map(Action => {
        if (React.isValidElement(Action)) {
          return <ErrorBoundary>{Action}</ErrorBoundary>;
        } else if (Action === null) {
          return null;
        } else {
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
  logout,
  hasToken,
  cluster,
  clusters,
  isSidebarOpen,
  isSidebarOpenUserSelected,
  onToggleOpen,
}: PureTopBarProps) {
  const { t } = useTranslation('frequent');
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const openSideBar = !!(isSidebarOpenUserSelected === undefined ? false : isSidebarOpen);

  const classes = useStyles({ isSidebarOpen, isSmall });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

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
  const renderUserMenu = (
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
      className={classes.userMenu}
    >
      <MenuItem
        component="a"
        onClick={() => {
          logout();
          handleMenuClose();
        }}
        disabled={!hasToken}
        dense
      >
        <ListItemIcon>
          <Icon icon="mdi:logout" />
        </ListItemIcon>
        <ListItemText primary={t('Log out')} secondary={hasToken ? null : t('(No token set up)')} />
      </MenuItem>
      <MenuItem
        component="a"
        onClick={() => {
          dispatch(setVersionDialogOpen(true));
          handleMenuClose();
        }}
        dense
        className={classes.versionLink}
      >
        <ListItemText>
          {helpers.getProductName()} {helpers.getVersion()['VERSION']}
        </ListItemText>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-menu-mobile';
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
      <MenuItem>
        <ClusterTitle cluster={cluster} clusters={clusters} />
      </MenuItem>
      <AppBarActionsMenu appBarActions={appBarActions} />
      <MenuItem>
        <Notifications />
      </MenuItem>
      <MenuItem>
        <LocaleSelect />
      </MenuItem>
      <MenuItem>
        <ThemeChangeButton />
      </MenuItem>
      <MenuItem>
        <IconButton
          aria-label={t('Account of current user')}
          aria-controls={userMenuId}
          aria-haspopup="true"
          color="inherit"
          onClick={handleProfileMenuOpen}
        >
          <Icon icon="mdi:account" />
        </IconButton>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar
        position="fixed"
        className={classes.appbar}
        elevation={1}
        component="nav"
        aria-label={t('Appbar Tools')}
      >
        <Toolbar className={classes.toolbar}>
          {isSmall && <HeadlampButton open={openSideBar} mobileOnly onToggleOpen={onToggleOpen} />}

          {!isSmall && (
            <>
              <div className={clsx(classes.grow, classes.clusterTitle)}>
                <ClusterTitle cluster={cluster} clusters={clusters} />
              </div>
              <AppBarActions appBarActions={appBarActions} />
              <Notifications />
              <LocaleSelect />
              <ThemeChangeButton />
              <IconButton
                edge="end"
                aria-label={t('Account of current user')}
                aria-controls={userMenuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Icon icon="mdi:account" />
              </IconButton>
            </>
          )}
          {isSmall && (
            <>
              <div className={classes.grow} />
              <IconButton
                aria-label={t('show more')}
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <Icon icon="mdi:more-vert" />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
      {renderUserMenu}
      {isSmall && renderMobileMenu}
    </>
  );
}
