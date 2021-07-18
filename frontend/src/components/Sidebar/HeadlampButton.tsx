import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as LogoLight } from '../../resources/icon-light.svg';
import { ReactComponent as LogoWithTextLight } from '../../resources/logo-light.svg';

const useStyle = makeStyles(theme => ({
  toolbar: {
    borderBottom: '1px solid #1e1e1e',
    paddingTop: theme.spacing(1.5),
    paddingLeft: (props: { isSidebarOpen: boolean }) =>
      props.isSidebarOpen ? theme.spacing(2) : theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  logo: {
    height: '32px',
    width: 'auto',
  },
}));

export interface HeadlampButtonProps {
  /** If the sidebar is fully expanded open or shrunk. */
  open: boolean;
  /** Called when sidebar toggles between open and closed. */
  onToggleOpen: () => void;
}

export default function HeadlampButton({ open, onToggleOpen }: HeadlampButtonProps) {
  const classes = useStyle({ isSidebarOpen: open });
  const { t } = useTranslation('sidebar');

  return (
    <div className={classes.toolbar}>
      <Button onClick={onToggleOpen} aria-label={open ? t('Shrink sidebar') : t('Expand sidebar')}>
        <SvgIcon
          className={classes.logo}
          component={open ? LogoWithTextLight : LogoLight}
          viewBox="0 0 auto 32"
        />
      </Button>
    </div>
  );
}
