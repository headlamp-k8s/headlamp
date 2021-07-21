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
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import LocaleSelect from '../../i18n/LocaleSelect/LocaleSelect';
import { getToken, setToken } from '../../lib/auth';
import { useCluster } from '../../lib/k8s';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { ClusterTitle } from '../cluster/Chooser';
import { drawerWidth } from '../Sidebar';
import HeadlampButton from '../Sidebar/HeadlampButton';
import ThemeChangeButton from './ThemeChangeButton';

export interface TopBarProps {
  /** If the sidebar is fully expanded open or shrunk. */
  isSidebarOpen: boolean;
  /** Called when sidebar toggles between open and closed. */
  onToggleOpen: () => void;
}

export default function TopBar({ isSidebarOpen, onToggleOpen }: TopBarProps) {
  const appBarActions = useTypedSelector(state => state.ui.views.appBar.actions);
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
      onToggleOpen={onToggleOpen}
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
  isSidebarOpen: boolean;
  /** Called when sidebar toggles between open and closed. */
  onToggleOpen: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appbar: {
      background: theme.palette.background.default,
      // When the draw is open, we move the app bar over.
      paddingLeft: (props: { isSidebarOpen: boolean; isMobile: boolean }) =>
        props.isSidebarOpen ? `${drawerWidth}px` : props.isMobile ? '0px' : '60px',
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
  })
);

export function PureTopBar({
  appBarActions,
  logout,
  hasToken,
  cluster,
  clusters,
  isSidebarOpen,
  onToggleOpen,
}: PureTopBarProps) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width:960px)');
  const classes = useStyles({ isSidebarOpen, isMobile });
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
          {isMobile && (
            <HeadlampButton open={isSidebarOpen} mobileOnly onToggleOpen={onToggleOpen} />
          )}

          <div className={classes.grow} />
          {!isMobile && (
            <>
              <ClusterTitle cluster={cluster} clusters={clusters} />
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
          {isMobile && (
            <IconButton
              aria-label={t('show more')}
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <Icon icon={moreVertIcon} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {renderUserMenu}
      {isMobile && renderMobileMenu}
    </>
  );
}
