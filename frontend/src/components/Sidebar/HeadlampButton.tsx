import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { getThemeName } from '../../lib/themes';
import { AppLogo } from '../App/AppLogo';

const PREFIX = 'HeadlampButton';

const classes = {
  toolbar: `${PREFIX}-toolbar`,
  logo: `${PREFIX}-logo`,
  button: `${PREFIX}-button`,
  menuIcon: `${PREFIX}-menuIcon`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.toolbar}`]: {
    paddingTop: theme.spacing(1.5),
    paddingLeft: (props: { open: boolean; isSmall: boolean }) =>
      props.isSmall ? 0 : props.open ? theme.spacing(2) : theme.spacing(1),
    paddingBottom: theme.spacing(1),
    margin: (props: { open: boolean; isSmall: boolean }) => (props.isSmall && !props.open ? 5 : 0),
  },

  [`& .${classes.logo}`]: {
    height: '32px',
    width: 'auto',
  },

  [`& .${classes.button}`]: {
    padding: (props: { open: boolean; isSmall: boolean }) =>
      props.isSmall && !props.open ? `10px 10px` : '6px 8px',
    // Useful for when the button has text.
    color: theme.palette.text.primary,
  },

  [`& .${classes.menuIcon}`]: {
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
  const { t } = useTranslation();

  if (mobileOnly && (!isSmall || (isSmall && open))) {
    return null;
  }

  return (
    <Root className={classes.toolbar}>
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
    </Root>
  );
}
