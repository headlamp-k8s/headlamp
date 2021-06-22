import kubernetesIcon from '@iconify/icons-mdi/kubernetes';
import { Icon } from '@iconify/react';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, { PropsWithChildren } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Trans, useTranslation } from 'react-i18next';
import { generatePath } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useCluster, useClustersConf } from '../../lib/k8s';
import { Cluster } from '../../lib/k8s/cluster';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';
import { ReactComponent as LogoLight } from '../../resources/logo-light.svg';
import Loader from '../common/Loader';

const useClusterTitleStyle = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.sidebarBg,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
}));

export function ClusterTitle() {
  const classes = useClusterTitleStyle();
  const cluster = useCluster();
  const clusters = useClustersConf();
  const [showChooser, setShowChooser] = React.useState(false);

  useHotkeys('ctrl+shift+l', () => setShowChooser(true));

  if (!cluster) {
    return null;
  }

  if (Object.keys(clusters || {}).length <= 1) {
    return null;
  }

  return (
    <React.Fragment>
      <Button
        size="large"
        variant="contained"
        onClick={() => setShowChooser(true)}
        className={classes.button}
      >
        <Trans ns="cluster">Cluster: {{ cluster }}</Trans>
      </Button>
      <Chooser open={showChooser} onClose={() => setShowChooser(false)} />
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  chooserDialog: {
    minWidth: 500,
    '& .MuiTypography-h4': {
      textAlign: 'center',
      fontSize: '2.2rem',
      color: theme.palette.primaryColor,
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
  },
  chooserDialogCover: {
    background: theme.palette.common.black,
  },
  logo: {
    height: '28px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  chooserTitle: {
    background: theme.palette.common.black,
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
  },
}));

const useClusterButtonStyles = makeStyles({
  root: {
    width: 150,
    height: 160,
    paddingTop: '15%',
  },
  content: {
    textAlign: 'center',
  },
});

interface ClusterButtonProps extends PropsWithChildren<{}> {
  cluster: Cluster;
  onClick?: (...args: any[]) => void;
  focusedRef?: (node: any) => void;
}

function ClusterButton(props: ClusterButtonProps) {
  const classes = useClusterButtonStyles();
  const theme = useTheme();
  const { cluster, onClick = undefined, focusedRef } = props;

  return (
    <ButtonBase focusRipple ref={focusedRef} onClick={onClick}>
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          <Icon icon={kubernetesIcon} width="50" height="50" color={theme.palette.primaryColor} />
          <Typography color="textSecondary" gutterBottom>
            {cluster.name}
          </Typography>
        </CardContent>
      </Card>
    </ButtonBase>
  );
}

interface ClusterListProps {
  clusters: Cluster[];
  onButtonClick: (cluster: Cluster) => void;
}

function ClusterList(props: ClusterListProps) {
  const { clusters, onButtonClick } = props;
  const focusedRef = React.useCallback(node => {
    if (node !== null) {
      node.focus();
    }
  }, []);

  return (
    <Grid container alignItems="center" justify="space-around" spacing={2}>
      {clusters.map((cluster, i) => (
        <Grid item key={cluster.name}>
          <ClusterButton
            focusedRef={i === 0 ? focusedRef : undefined}
            cluster={cluster}
            onClick={() => onButtonClick(cluster)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

interface ClusterDialogProps extends PropsWithChildren<Omit<DialogProps, 'open' | 'onClose'>> {
  open?: boolean;
  onClose?: (() => void) | null;
  useCover?: boolean;
}

export function ClusterDialog(props: ClusterDialogProps) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { open, onClose = null, useCover = false, children = [], ...otherProps } = props;
  // Only used if open is not provided
  const [show, setShow] = React.useState(true);

  function handleClose() {
    if (onClose !== null) {
      onClose();
      return;
    }

    // Only use show if open is not provided
    if (open === undefined) {
      setShow(false);
    }
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open !== undefined ? open : show}
      onClose={handleClose}
      className={useCover ? classes.chooserDialogCover : ''}
      {...otherProps}
    >
      <DialogTitle className={classes.chooserTitle} disableTypography>
        <SvgIcon className={classes.logo} component={LogoLight} viewBox="0 0 175 32" />
      </DialogTitle>
      <DialogContent className={classes.chooserDialog}>{children}</DialogContent>
    </Dialog>
  );
}

function Chooser(props: ClusterDialogProps) {
  const history = useHistory();
  const clusters = useClustersConf();
  const { open = null, onClose, children = [], ...otherProps } = props;
  // Only used if open is not provided
  const [show, setShow] = React.useState(props.open);
  const { t } = useTranslation('cluster');

  React.useEffect(
    () => {
      if (open !== null && open !== show) {
        setShow(open);
        return;
      }

      // If we only have one cluster configured, then we skip offering
      // the choice to the user.
      if (!!clusters && Object.keys(clusters).length === 1) {
        handleButtonClick(Object.values(clusters)[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, show, clusters]
  );

  function handleButtonClick(cluster: Cluster) {
    if (cluster.name !== getCluster()) {
      history.push({
        pathname: generatePath(getClusterPrefixedPath(), {
          cluster: cluster.name,
        }),
      });
    }

    setShow(false);

    if (!!onClose) {
      onClose();
    }
  }

  function handleClose() {
    if (open === null) {
      setShow(false);
    }

    if (!!onClose) {
      onClose();
    }
  }

  const clusterList = Object.values(clusters || {});

  return (
    <ClusterDialog
      open={show}
      onClose={onClose || handleClose}
      aria-labelledby="chooser-dialog-title"
      aria-busy={clusterList.length === 0 && clusters === null}
      {...otherProps}
    >
      <DialogTitle id="chooser-dialog-title">{t('Choose a cluster')}</DialogTitle>

      {clusterList.length === 0 ? (
        <React.Fragment>
          {clusters === null ? (
            <>
              <DialogContentText>{t('Wait while fetching clusters…')}</DialogContentText>
              <Loader title={t('Loading cluster information')} />
            </>
          ) : (
            <>
              <DialogContentText>
                {t('There seems to be no clusters configured…')}
              </DialogContentText>
              <DialogContentText>
                {t('Please make sure you have at least one cluster configured.')}
              </DialogContentText>
            </>
          )}
        </React.Fragment>
      ) : (
        <ClusterList clusters={clusterList} onButtonClick={handleButtonClick} />
      )}
      {children}
    </ClusterDialog>
  );
}

export default Chooser;
