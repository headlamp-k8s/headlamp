import { Icon, InlineIcon } from '@iconify/react';
import { DialogActions, IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import _ from 'lodash';
import React, { isValidElement, PropsWithChildren } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { generatePath } from 'react-router';
import { useHistory } from 'react-router-dom';
import helpers from '../../helpers';
import { useClustersConf } from '../../lib/k8s';
import { Cluster } from '../../lib/k8s/cluster';
import { createRouteURL } from '../../lib/router';
import { getThemeName } from '../../lib/themes';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';
import { setVersionDialogOpen } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { EmptyContent } from '../common';
import ActionButton from '../common/ActionButton';
import { DialogTitle } from '../common/Dialog';
import ErrorBoundary from '../common/ErrorBoundary';
import Loader from '../common/Loader';
import AppLogo from '../Sidebar/AppLogo';
import ClusterChooser from './ClusterChooser';

export interface ClusterTitleProps {
  clusters?: {
    [clusterName: string]: Cluster;
  };
  cluster?: string;
}

export function ClusterTitle(props: ClusterTitleProps) {
  const cluster = props.cluster;
  const clusters = props.clusters;
  const [showChooser, setShowChooser] = React.useState(false);
  const arePluginsLoaded = useTypedSelector(state => state.plugins.loaded);
  const ChooserButton = useTypedSelector(state => state.ui.clusterChooserButtonComponent);

  useHotkeys('ctrl+shift+l', () => setShowChooser(true));

  if (!cluster) {
    return null;
  }

  if (!arePluginsLoaded || _.isNull(ChooserButton)) {
    return null;
  }

  if (!ChooserButton && Object.keys(clusters || {}).length <= 1) {
    return null;
  }

  return (
    <ErrorBoundary>
      {ChooserButton ? (
        isValidElement(ChooserButton) ? (
          ChooserButton
        ) : (
          <ChooserButton clickHandler={() => setShowChooser(true)} cluster={cluster} />
        )
      ) : (
        <ClusterChooser clickHandler={() => setShowChooser(true)} cluster={cluster} />
      )}
      <Chooser open={showChooser} onClose={() => setShowChooser(false)} />
    </ErrorBoundary>
  );
}

const useStyles = makeStyles(theme => ({
  chooserDialog: {
    [theme.breakpoints.up('sm')]: {
      minWidth: 500,
    },
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
  chooserTitle: {
    background: theme.palette.common.black,
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  logo: {
    height: '32px',
    width: 'auto',
  },
}));

const useClusterButtonStyles = makeStyles({
  root: {
    width: 128,
    height: 115,
    paddingTop: '10%',
  },
  content: {
    textAlign: 'center',
    paddingTop: 0,
  },
  clusterName: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'block',
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
          <Icon icon="mdi:kubernetes" width="50" height="50" color={theme.palette.primaryColor} />
          <Typography
            color="textSecondary"
            gutterBottom
            className={classes.clusterName}
            title={cluster.name}
          >
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
  const theme = useTheme();
  const focusedRef = React.useCallback(node => {
    if (node !== null) {
      node.focus();
    }
  }, []);
  const { t } = useTranslation('cluster');
  const recentClustersLabelId = 'recent-clusters-label';
  const maxRecentClusters = 3;
  // We slice it here for the maximum recent clusters just for extra safety, since this
  // is an entry point to the rest of the functionality
  const recentClusterNames = helpers.getRecentClusters().slice(0, maxRecentClusters);

  let recentClusters: Cluster[] = [];

  // If we have more than the maximum number of recent clusters allowed, we show the most
  // recent ones. Otherwise, just show the clusters in the order they are received.
  if (clusters.length > maxRecentClusters) {
    // Get clusters matching the recent cluster names, if they exist still.
    recentClusters = recentClusterNames
      .map(name => clusters.find(cluster => cluster.name === name))
      .filter(item => !!item) as Cluster[];
    // See whether we need to fill with new clusters (when the recent clusters were less than the
    // maximum/wanted).
    const neededClusters = maxRecentClusters - recentClusters.length;
    if (neededClusters > 0) {
      recentClusters = recentClusters.concat(
        clusters.filter(item => !recentClusters.includes(item)).slice(0, neededClusters)
      );
    }
  } else {
    recentClusters = clusters;
  }

  return (
    <Container style={{ maxWidth: '500px', paddingBottom: theme.spacing(2) }}>
      <Grid
        container
        direction="column"
        alignItems="stretch"
        justifyContent="space-between"
        spacing={4}
      >
        {recentClusters.length !== clusters.length && (
          <Grid item>
            <Typography align="center" id={recentClustersLabelId}>
              {t('cluster|Recent clusters')}
            </Typography>
          </Grid>
        )}
        <Grid
          aria-labelledby={`#${recentClustersLabelId}`}
          item
          container
          alignItems="center"
          justifyContent={clusters.length > maxRecentClusters ? 'space-between' : 'center'}
          spacing={2}
        >
          {recentClusters.map((cluster, i) => (
            <Grid item key={cluster.name}>
              <ClusterButton
                focusedRef={i === 0 ? focusedRef : undefined}
                cluster={cluster}
                onClick={() => onButtonClick(cluster)}
              />
            </Grid>
          ))}
        </Grid>
        {clusters.length > 3 && (
          <Grid item xs={12}>
            <Autocomplete
              id="cluster-selector-autocomplete"
              options={clusters}
              getOptionLabel={option => option.name}
              style={{ width: '100%' }}
              disableClearable
              autoComplete
              includeInputInList
              openOnFocus
              renderInput={params => (
                <TextField {...params} label={t('cluster|All clusters')} variant="outlined" />
              )}
              onChange={(_event, cluster) => onButtonClick(cluster)}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

interface ClusterDialogProps extends PropsWithChildren<Omit<DialogProps, 'open' | 'onClose'>> {
  open?: boolean;
  onClose?: (() => void) | null;
  useCover?: boolean;
  showInfoButton?: boolean;
}

export function ClusterDialog(props: ClusterDialogProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('cluster');
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    open,
    onClose = null,
    useCover = false,
    showInfoButton = true,
    children = [],
    ...otherProps
  } = props;
  // Only used if open is not provided
  const [show, setShow] = React.useState(true);
  const dispatch = useDispatch();
  const arePluginsLoaded = useTypedSelector(state => state?.plugins?.loaded);
  const PluginAppLogoComponent = useTypedSelector(state => state?.ui?.branding?.logo);

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
      <DialogTitle
        className={classes.chooserTitle}
        disableTypography
        buttons={[
          showInfoButton && (
            <IconButton
              aria-label={t('Show build information')}
              onClick={() => {
                handleClose();
                dispatch(setVersionDialogOpen(true));
              }}
              size="small"
            >
              <InlineIcon
                icon={'mdi:information-outline'}
                color={theme.palette.primary.contrastText}
              />
            </IconButton>
          ),
        ]}
      >
        <ErrorBoundary>
          {
            // Till all plugins are not loaded show empty content for logo as we might have logo coming from a plugin
            !arePluginsLoaded ? (
              <EmptyContent />
            ) : PluginAppLogoComponent ? (
              isValidElement(PluginAppLogoComponent) ? (
                // If it's an element, just use it.
                PluginAppLogoComponent
              ) : (
                // It is a component, so we make it here.
                <PluginAppLogoComponent
                  logoType={'large'}
                  themeName={getThemeName()}
                  className={classes.logo}
                />
              )
            ) : (
              <AppLogo logoType={'large'} className={classes.logo} />
            )
          }
        </ErrorBoundary>
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
      helpers.setRecentCluster(cluster);
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
  if (!show) {
    return null;
  }

  return (
    <Box component="main">
      <ClusterDialog
        open={show}
        onClose={onClose || handleClose}
        aria-labelledby="chooser-dialog-title"
        aria-busy={clusterList.length === 0 && clusters === null}
        {...otherProps}
      >
        <DialogTitle id="chooser-dialog-title" focusTitle>
          {t('Choose a cluster')}
        </DialogTitle>

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
                {helpers.isElectron() && (
                  <DialogContentText>
                    {t('Or try running Headlamp with a different kube config.')}
                  </DialogContentText>
                )}
              </>
            )}
          </React.Fragment>
        ) : (
          <ClusterList clusters={clusterList} onButtonClick={handleButtonClick} />
        )}
        {helpers.isElectron() ? (
          <Box style={{ justifyContent: 'center', display: 'flex' }}>
            <ActionButton
              description={t('Load from a file')}
              onClick={() => history.push(createRouteURL('loadKubeConfig'))}
              icon="mdi:plus"
            />
          </Box>
        ) : null}
        {React.Children.toArray(children).length > 0 && (
          <DialogActions>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              {React.Children.toArray(children).map((child, index) => (
                <Grid item key={index}>
                  {child}
                </Grid>
              ))}
            </Grid>
          </DialogActions>
        )}
      </ClusterDialog>
    </Box>
  );
}

export default Chooser;
