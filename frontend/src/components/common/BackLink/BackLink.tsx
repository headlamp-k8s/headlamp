import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

const PREFIX = 'BackLink';

const classes = {
  root: `${PREFIX}-root`,
};

const StyledButton = styled(Button)(({ theme }) => ({
  [`&.${classes.root}`]: {
    color: theme.palette.primaryColor,
  },
}));

export interface BackLinkProps {
  /** The location to go back to. If not provided, the browser's history will be used. */
  to?: string | ReturnType<typeof useLocation>;
}

export default function BackLink(props: BackLinkProps) {
  const { to: backLink = '' } = props;
  const { t } = useTranslation();
  const history = useHistory();

  // We only want to update when the backLink changes (not the history).
  React.useEffect(() => {}, [backLink]);

  return (
    <StyledButton
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
    </StyledButton>
  );
}
