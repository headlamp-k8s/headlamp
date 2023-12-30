import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import React, { ReactElement } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export interface ClusterChooserProps {
  clickHandler: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  cluster?: string;
}
export type ClusterChooserType = React.ComponentType<ClusterChooserProps> | ReactElement | null;

const PREFIX = 'ClusterChooser';

const classes = {
  button: `${PREFIX}-button`,
  clusterName: `${PREFIX}-clusterName`,
};

const StyledButton = styled(Button)(({ theme }) => ({
  [`&.${classes.button}`]: {
    color: theme.palette.clusterChooser.button.color,
    background: theme.palette.clusterChooser.button.background,
    '&:hover': {
      background: theme.palette.clusterChooser.button.hover.background,
    },
    maxWidth: '20em',
    textTransform: 'none',
    padding: '6px 22px',
  },

  [`& .${classes.clusterName}`]: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'block',
  },
}));

const ClusterChooser = React.forwardRef(function ClusterChooser(
  { clickHandler, cluster }: ClusterChooserProps,
  ref: React.Ref<HTMLButtonElement>
) {
  const { t } = useTranslation();

  return (
    <StyledButton
      size="large"
      variant="contained"
      onClick={clickHandler}
      className={classes.button}
      ref={ref}
    >
      <span className={classes.clusterName} title={cluster}>
        <Trans t={t}>Cluster: {{ cluster }}</Trans>
      </span>
    </StyledButton>
  );
});

export default ClusterChooser;
