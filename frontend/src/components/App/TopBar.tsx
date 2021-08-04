import accountIcon from '@iconify/icons-mdi/account';
import logoutIcon from '@iconify/icons-mdi/logout';
import moreVertIcon from '@iconify/icons-mdi/more-vert';
import { Icon } from '@iconify/react';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LocaleSelect from '../../i18n/LocaleSelect/LocaleSelect';
import { getToken, setToken } from '../../lib/auth';
import { useCluster } from '../../lib/k8s';
import { setWhetherSidebarOpen } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { ClusterTitle } from '../cluster/Chooser';
import { drawerWidth } from '../Sidebar';
import HeadlampButton from '../Sidebar/HeadlampButton';
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
    />
  );
}

export interface PureTopBarProps {
  /** If the sidebar is fully expanded open or shrunk. */
  appBarActions: {
    [name: string]: (...args: any[]) => JSX.Element | null;
  };
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
  })
);

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
  const { t } = useTranslation();
  const isSmall = useMediaQuery('(max-width:960px)');
  const isMedium = useMediaQuery('(max-width:960px)');

  const openSideBar =
    isMedium && !!(isSidebarOpenUserSelected === undefined ? false : isSidebarOpen);

  const classes = useStyles({ isSidebarOpen: openSideBar, isSmall });
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
          <Icon icon={logoutIcon} />
        </ListItemIcon>
        <ListItemText primary={t('Log out')} secondary={hasToken ? null : t('(No token set up)')} />
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
      {Object.values(appBarActions).map((action, i) => (
        <MenuItem>
          <React.Fragment key={i}>{action()}</React.Fragment>
        </MenuItem>
      ))}
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
          <Icon icon={accountIcon} />
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
          {isMedium && <HeadlampButton open={openSideBar} mobileOnly onToggleOpen={onToggleOpen} />}

          {!isMedium && (
            <>
              <div className={clsx(classes.grow, classes.clusterTitle)}>
                <ClusterTitle cluster={cluster} clusters={clusters} />
              </div>
              {Object.values(appBarActions).map((action, i) => (
                <MenuItem>
                  <React.Fragment key={i}>{action()}</React.Fragment>
                </MenuItem>
              ))}
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
                <Icon icon={accountIcon} />
              </IconButton>
            </>
          )}
          {isMedium && (
            <>
              <div className={classes.grow} />
              <IconButton
                aria-label={t('show more')}
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <Icon icon={moreVertIcon} />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
      {renderUserMenu}
      {isMedium && renderMobileMenu}
    </>
  );
}
