import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import React, { ReactElement } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export interface ClusterChooserProps {
  clickHandler: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  cluster?: string;
}
export type ClusterChooserType = React.ComponentType<ClusterChooserProps> | ReactElement | null;

const useClusterTitleStyle = makeStyles(theme => ({
  button: {
    color: theme.palette.clusterChooser.button.color,
    background: theme.palette.clusterChooser.button.background,
    '&:hover': {
      background: theme.palette.clusterChooser.button.hover.background,
    },
    maxWidth: '20em',
    textTransform: 'none',
    padding: '6px 22px',
  },
  clusterName: {
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
  const classes = useClusterTitleStyle();
  const { t } = useTranslation('cluster');

  return (
    <Button
      size="large"
      variant="contained"
      onClick={clickHandler}
      className={classes.button}
      ref={ref}
    >
      <span className={classes.clusterName} title={cluster}>
        <Trans t={t}>Cluster: {{ cluster }}</Trans>
      </span>
    </Button>
  );
});

export default ClusterChooser;
