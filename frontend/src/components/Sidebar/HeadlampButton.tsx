import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { getThemeName } from '../../lib/themes';
import { AppLogo } from '../App/AppLogo';

const useStyle = makeStyles(theme => ({
  toolbar: {
    paddingTop: theme.spacing(1.5),
    paddingLeft: (props: { isSidebarOpen: boolean; isSmall: boolean }) =>
      props.isSmall ? 0 : props.isSidebarOpen ? theme.spacing(2) : theme.spacing(1),
    paddingBottom: theme.spacing(1),
    margin: (props: { isSidebarOpen: boolean; isSmall: boolean }) =>
      props.isSmall && !props.isSidebarOpen ? 5 : 0,
  },
  logo: {
    height: '32px',
    width: 'auto',
  },
  button: {
    padding: (props: { isSidebarOpen: boolean; isSmall: boolean }) =>
      props.isSmall && !props.isSidebarOpen ? `10px 10px` : '6px 8px',
    // Useful for when the button has text.
    color: theme.palette.text.primary,
  },
  menuIcon: {
    marginRight: theme.spacing(1),
  },
}));

export interface HeadlampButtonProps {
  /** If the sidebar is fully expanded open or shrunk. */
  open: boolean;
  /** Only show if we are in mobile breakpoint and not open. */
  mobileOnly?: boolean;
  /** Called when sidebar toggles between open and closed. */
  onToggleOpen: () => void;
  /** Whether the button is to be disabled or not. */
  disabled?: boolean;
}

export default function HeadlampButton({
  open,
  onToggleOpen,
  mobileOnly,
  disabled = false,
}: HeadlampButtonProps) {
  const isSmall = useMediaQuery('(max-width:600px)');
  const classes = useStyle({ isSidebarOpen: open, isSmall: isSmall });
  const { t } = useTranslation();

  if (mobileOnly && (!isSmall || (isSmall && open))) {
    return null;
  }

  return (
    <div className={classes.toolbar}>
      <Button
        onClick={onToggleOpen}
        className={classes.button}
        aria-label={open ? t('Shrink sidebar') : t('Expand sidebar')}
        disabled={disabled}
      >
        <Icon
          icon={open ? 'mdi:backburger' : 'mdi:menu'}
          width="1.5rem"
          className={classes.menuIcon}
        />
        <AppLogo logoType={'large'} themeName={getThemeName()} className={classes.logo} />
      </Button>
    </div>
  );
}
