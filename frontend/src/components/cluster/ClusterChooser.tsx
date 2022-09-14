import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { ReactElement } from 'react';
import { Trans, useTranslation } from 'react-i18next';

export interface ClusterChooserProps {
  clickHandler: (event?: any) => void;
  cluster?: string;
}
export type ClusterChooserType = React.ComponentType<ClusterChooserProps> | ReactElement | null;

const useClusterTitleStyle = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.sidebarBg,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      color: theme.palette.text.primary,
    },
    maxWidth: '20em',
  },
  clusterName: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'block',
  },
}));

export default function ClusterChooser({ clickHandler, cluster }: ClusterChooserProps) {
  const classes = useClusterTitleStyle();
  const { t } = useTranslation('cluster');

  return (
    <Button size="large" variant="contained" onClick={clickHandler} className={classes.button}>
      <span className={classes.clusterName} title={cluster}>
        <Trans t={t}>Cluster: {{ cluster }}</Trans>
      </span>
    </Button>
  );
}
