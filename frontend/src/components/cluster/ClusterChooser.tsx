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
  },
}));

export default function ClusterChooser({ clickHandler, cluster }: ClusterChooserProps) {
  const classes = useClusterTitleStyle();
  const { t } = useTranslation('cluster');

  return (
    <Button size="large" variant="contained" onClick={clickHandler} className={classes.button}>
      <Trans t={t}>Cluster: {{ cluster }}</Trans>
    </Button>
  );
}
