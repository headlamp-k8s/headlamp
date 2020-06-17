import kubernetesIcon from '@iconify/icons-mdi/kubernetes';
import { Icon } from '@iconify/react';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import { generatePath } from 'react-router';
import { useHistory, useLocation } from 'react-router-dom';
import { useClustersConf } from '../../lib/k8s/api';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';
import { Cluster } from '../../redux/reducers/config';
import { ReactComponent as LogoLight } from '../../resources/logo-light.svg';
import Loader from '../common/Loader';

const useClusterTitleStyle = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.sidebarBg,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      color: theme.palette.text.primary,
    }
  }
}));

export function ClusterTitle() {
  const classes = useClusterTitleStyle();
  // Use location is only added here in order for the component to be aware of
  // a URL change which may indicate a cluster change.
  // @todo: Update if the way to manage the current cluster changes.
  useLocation();

  const cluster = getCluster();
  const clusters = useClustersConf();
  const [showChooser, setShowChooser] = React.useState(false);

  if (!cluster) {
    return null;
  }

  return (
    <React.Fragment>
      {(clusters.length > 1) ?
        <Button
          size="large"
          variant="contained"
          onClick={() => setShowChooser(true)}
          className={classes.button}
        >
          Cluster: {cluster}
        </Button>
        :
        <Typography color="textPrimary">Cluster: {cluster}</Typography>
      }
      <Chooser
        open={showChooser}
        onClose={() => setShowChooser(false)}
      />
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  chooserDialog: {
    minWidth: 500,
  },
  chooserDialogCover: {
    background: theme.palette.common.black,
  },
  logo: {
    height: '24px',
    width: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  chooserTitle: {
    background: theme.palette.common.black,
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  bigText: {
    textAlign: 'center',
    fontSize: '2.2rem',
    color: theme.palette.common.black,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  }
}));

const useClusterButtonStyles = makeStyles({
  root: {
    width: 150,
    height: 160,
    paddingTop: '15%'
  },
  content: {
    textAlign: 'center'
  },
});

interface ClusterButtonProps {
  cluster: Cluster;
  onClick?: ((...args: any[]) => void);
}

function ClusterButton(props: ClusterButtonProps) {
  const classes = useClusterButtonStyles();
  const {cluster, onClick = undefined} = props;

  return (
    <ButtonBase
      focusRipple
      onClick={onClick}
    >
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          <Icon icon={kubernetesIcon} width="50" height="50" color="#000" />
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
  const {clusters, onButtonClick} = props;

  return (
    <Grid
      container
      alignItems="center"
      justify="space-around"
    >
      {clusters.map((cluster, i) =>
        <Grid item key={cluster.name} xs={6} sm={3}>
          <ClusterButton
            cluster={cluster}
            onClick={() => onButtonClick(cluster)}
          />
        </Grid>
      )}
    </Grid>
  );
}

interface ChooserProps {
  open?: boolean;
  onClose?: (() => void) | null;
  useCover?: boolean;
}

function Chooser(props: ChooserProps) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const history = useHistory();
  const clusters = useClustersConf();
  const {open = true, onClose = null, useCover = false} = props;
  // Only used if open is not provided
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    // If we only have one cluster configured, then we skip offering
    // the choice to the user.
    if (clusters.length === 1) {
      handleButtonClick(clusters[0]);
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [open, clusters]);

  function handleClose() {
    if (onClose !== null) {
      onClose();
      return;
    }

    // Only use show if open is not provided
    if (open === null) {
      setShow(false);
    }
  }

  function handleButtonClick(cluster: Cluster) {
    history.push({pathname: generatePath(getClusterPrefixedPath(), {cluster: cluster.name})});
    handleClose();
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open !== null ? open : show}
      onClose={handleClose}
      aria-labelledby="authentication-dialog"
      className={useCover ? classes.chooserDialogCover : ''}
    >
      <DialogTitle
        id="responsive-dialog-title"
        className={classes.chooserTitle}
        disableTypography
      >
        <SvgIcon
          className={classes.logo}
          component={LogoLight}
          viewBox="0 0 175 32"
        />
      </DialogTitle>
      <DialogContent
        className={classes.chooserDialog}
      >
        {clusters.length === 0 ?
          <React.Fragment>
            <DialogContentText>
              Wait while fetching clusters...
            </DialogContentText>
            <Loader />
          </React.Fragment>
          :
          <React.Fragment>
            <DialogContentText
              variant="h4"
              className={classes.bigText}
            >
              Choose a cluster
            </DialogContentText>
            <ClusterList
              clusters={clusters}
              onButtonClick={handleButtonClick}
            />
          </React.Fragment>
        }
      </DialogContent>
    </Dialog>
  );
}

export default Chooser;
