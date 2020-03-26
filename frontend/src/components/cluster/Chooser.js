import kubernetesIcon from '@iconify/icons-mdi/kubernetes';
import { Icon } from '@iconify/react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath } from 'react-router';
import { useHistory } from "react-router-dom";
import api from '../../lib/api';
import { getClusterPrefixedPath } from '../../lib/util';
import { setConfig } from '../../redux/actions/actions';
import Loader from '../common/Loader';

const useStyles = makeStyles({
  chooserDialog: {
    minWidth: 500,
  }
});

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

function ClusterButton(props) {
  const classes = useClusterButtonStyles();
  const {cluster, onClick=null} = props;

  return (
    <ButtonBase
      focusRipple
      onClick={onClick}
    >
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          <Icon icon={kubernetesIcon} width="50" height="50" color="#000" />
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            {cluster.name}
          </Typography>
        </CardContent>
      </Card>
    </ButtonBase>
  );
}

function ClusterList(props) {
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

function Chooser(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  let history = useHistory();
  const dispatch = useDispatch();
  const clusters = useSelector(state => state.config.clusters);
  const {open=true, title="Welcome", onClose=null} = props;
  // Only used if open is not provided
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    if (open && clusters.length === 0) {
      api.getConfig()
        .then(config => {
          dispatch(setConfig(config))
        })
        .catch(err => console.error(err));
    }
  },
  [open, clusters, dispatch]);

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

  function handleButtonClick(cluster) {
    history.push({pathname: generatePath(getClusterPrefixedPath(), {cluster: cluster.name})});
    handleClose();
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open !== null ? open : show}
      onClose={handleClose}
      aria-labelledby="authentication-dialog"
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
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
          <DialogContentText>
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
