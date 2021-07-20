import accountIcon from '@iconify/icons-mdi/account';
import logoutIcon from '@iconify/icons-mdi/logout';
import { Icon } from '@iconify/react';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import LocaleSelect from '../../i18n/LocaleSelect/LocaleSelect';
import { getToken, setToken } from '../../lib/auth';
import { useCluster } from '../../lib/k8s';
import { useTypedSelector } from '../../redux/reducers/reducers';
import ThemeChangeButton from './ThemeChangeButton';

// import Grid from '@material-ui/core/Grid';
// import List from '@material-ui/core/List';

export default function TopBar() {
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

  return <PureTopBar appBarActions={appBarActions} logout={logout} hasToken={hasToken()} />;
}

export interface PureTopBarProps {
  /** If the sidebar is fully expanded open or shrunk. */
  appBarActions: {
    [name: string]: (...args: any[]) => JSX.Element | null;
  };
  logout: () => void;
  hasToken: boolean;
}

export function PureTopBar({ appBarActions, logout, hasToken }: PureTopBarProps) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const { t } = useTranslation('frequent');

  return (
    <>
      {
        // @todo: Use a grid to compose the toolbar
        Object.values(appBarActions).map((action, i) => (
          <React.Fragment key={i}>{action()}</React.Fragment>
        ))
      }
      <LocaleSelect />
      <ThemeChangeButton />
      <IconButton
        aria-label={t('User menu')}
        aria-controls="customized-menu"
        aria-haspopup="true"
        onClick={(event: any) => {
          setMenuAnchorEl(event.currentTarget);
        }}
        color="inherit"
      >
        <Icon icon={accountIcon} />
      </IconButton>

      <span id="customized-menu">
        <Menu
          anchorEl={menuAnchorEl}
          open={!!menuAnchorEl}
          onClose={() => setMenuAnchorEl(null)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            component="a"
            onClick={() => {
              logout();
              setMenuAnchorEl(null);
            }}
            disabled={!hasToken}
            dense
          >
            <ListItemIcon>
              <Icon icon={logoutIcon} />
            </ListItemIcon>
            <ListItemText primary="Log out" secondary={hasToken ? null : '(No token set up)'} />
          </MenuItem>
        </Menu>
      </span>
    </>
  );
}
