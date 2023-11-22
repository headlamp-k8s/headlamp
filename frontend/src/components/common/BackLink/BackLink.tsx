import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

export interface BackLinkProps {
  /** The location to go back to. If not provided, the browser's history will be used. */
  to?: string | ReturnType<typeof useLocation>;
}

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.primaryColor,
  },
}));

export default function BackLink(props: BackLinkProps) {
  const { to: backLink = '' } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();

  // We only want to update when the backLink changes (not the history).
  React.useEffect(() => {}, [backLink]);

  return (
    <Button
      startIcon={<Icon icon="mdi:chevron-left" />}
      size="small"
      className={classes.root}
      onClick={() => {
        // If there is no back link, go back in history.
        if (!backLink) {
          history.goBack();
          return;
        }

        history.push(backLink);
      }}
    >
      <Typography style={{ paddingTop: '3px' }}>{t('translation|Back')}</Typography>
    </Button>
  );
}
