import { Icon, InlineIcon } from '@iconify/react';
import { Button, Checkbox, FormControl, IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as yaml from 'js-yaml';
import _ from 'lodash';
import React, { isValidElement, PropsWithChildren, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { generatePath } from 'react-router';
import { useHistory } from 'react-router-dom';
import helpers from '../../helpers';
import { useClustersConf } from '../../lib/k8s';
import { setCluster } from '../../lib/k8s/apiProxy';
import { Cluster } from '../../lib/k8s/cluster';
import { getThemeName } from '../../lib/themes';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';
import { setVersionDialogOpen } from '../../redux/actions/actions';
import { setConfig } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { EmptyContent } from '../common';
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
  const arePluginsLoaded = useTypedSelector(state => state.ui.pluginsLoaded);
  const ChooserButton = useTypedSelector(state => state.ui.clusterChooserButtonComponent);

  useHotkeys('ctrl+shift+l', () => setShowChooser(true));

  if (!cluster) {
    return null;
  }

  if (Object.keys(clusters || {}).length <= 1) {
    return null;
  }

  if (!arePluginsLoaded || _.isNull(ChooserButton)) {
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
  error?: string;
}

export function ClusterDialog(props: ClusterDialogProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('cluster');
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { open, onClose = null, useCover = false, children = [], error, ...otherProps } = props;
  // Only used if open is not provided
  const [show, setShow] = React.useState(true);
  const dispatch = useDispatch();
  const arePluginsLoaded = useTypedSelector(state => state?.ui?.pluginsLoaded);
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
          </IconButton>,
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
      {error && error !== '' ? (
        <Box style={{ backgroundColor: 'red', textAlign: 'center', padding: '4px' }}>{error}</Box>
      ) : null}
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
  const [loadFromKubeConfig, setLoadFromKubeConfig] = useState(false);
  const [error, setError] = React.useState('');
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
        error={error}
        {...otherProps}
      >
        {!loadFromKubeConfig ? (
          <>
            <DialogTitle id="chooser-dialog-title" focusTitle>
              {t('Choose a cluster')}
            </DialogTitle>
            <DialogContent>
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
              {helpers.isElectron() || helpers.isDevMode() ? (
                <Box style={{ justifyContent: 'center', display: 'flex' }}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => setLoadFromKubeConfig(true)}
                  >
                    {t('Load from a file')}
                  </Button>
                </Box>
              ) : null}
            </DialogContent>
          </>
        ) : (
          <KubeConfigUpload back={() => setLoadFromKubeConfig(false)} setError={setError} />
        )}

        {children}
      </ClusterDialog>
    </Box>
  );
}

interface kubeconfig {
  clusters: Array<{ name: string; cluster: { server: string } }>;
  users: Array<{ name: string; user: { token: string } }>;
  contexts: Array<{ name: string; context: { cluster: string; user: string } }>;
  currentContext: string;
}

function configWithSelectedClusters(config: kubeconfig, selectedClusters: string[]): kubeconfig {
  const newConfig = _.cloneDeep(config);

  config.clusters.forEach(cluster => {
    if (!selectedClusters.includes(cluster.name)) {
      const indexOfClusterToBeRemoved = newConfig.clusters.findIndex(c => c.name === cluster.name);
      const clusterToBeRemoved = newConfig.clusters[indexOfClusterToBeRemoved];

      const indexOfContextToBeRemoved = newConfig.contexts.findIndex(
        c => c.context.cluster === clusterToBeRemoved.name
      );
      const contextToBeRemoved = newConfig.contexts[indexOfContextToBeRemoved];

      const indexOfUserToBeRemoved = newConfig.users.findIndex(
        c => c.name === contextToBeRemoved.context.user
      );

      // remove user
      newConfig.clusters.splice(indexOfClusterToBeRemoved, 1);
      // remove context
      newConfig.contexts.splice(indexOfContextToBeRemoved, 1);
      // remove cluster
      newConfig.users.splice(indexOfUserToBeRemoved, 1);
    }
  });
  newConfig.currentContext = '';
  return newConfig;
}

function KubeConfigUpload(props: { back: () => void; setError: (error: string) => void }) {
  const { back, setError } = props;

  // State can be: load_kubeconfig, selecting_clusters, configuring_clusters, success
  const [state, setState] = useState('load_kubeconfig');
  const [fileContent, setFileContent] = useState<kubeconfig>({
    clusters: [],
    users: [],
    contexts: [],
    currentContext: '',
  });
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);

  useEffect(() => {
    if (fileContent.clusters.length > 0) {
      if (fileContent.clusters.length === 1) {
        setSelectedClusters([fileContent.clusters[0].name]);
        setState('configuring_clusters');
        return;
      }
      setState('selecting_clusters');
    }
    return () => {};
  }, [fileContent]);

  useEffect(() => {
    if (state === 'configuring_clusters') {
      function loadClusters() {
        const selectedClusterConfig = configWithSelectedClusters(fileContent, selectedClusters);
        setCluster({ kubeconfig: btoa(yaml.dump(selectedClusterConfig)) })
          .then(res => {
            if (res.clusters.length > 0) {
              dispatch(setConfig(res));
              setState('success');
            }
          })
          .catch(() => {
            setError(t('cluster|Error setting up cluster, please upload a valid kubeconfig file'));
          });
      }
      loadClusters();
    }
    return () => {};
  }, [state]);

  const dispatch = useDispatch();
  const { t } = useTranslation(['cluster', 'frequent']);

  const useStyles = makeStyles({
    dropzone: {
      border: 1,
      borderRadius: 1,
      borderWidth: 2,
      borderColor: 'rgba(0, 0, 0)',
      borderStyle: 'dashed',
      padding: '20px',
      margin: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '&:hover': {
        borderColor: 'rgba(0, 0, 0, 0.5)',
      },
      '&:focus-within': {
        borderColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
  });

  const classes = useStyles();

  const onDrop = (acceptedFiles: Blob[]) => {
    setError('');
    const reader = new FileReader();
    reader.onerror = () => setError(t("cluster|Couldn't read kubeconfig file"));
    reader.onload = () => {
      try {
        const data = String.fromCharCode.apply(null, [
          ...new Uint8Array(reader.result as ArrayBuffer),
        ]);
        const doc = yaml.load(data) as kubeconfig;
        setFileContent(doc);
      } catch (err) {
        setError(t('cluster|Upload a valid kubeconfig'));
        return;
      }
    };
    reader.readAsArrayBuffer(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: onDrop,
    multiple: false,
  });

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      if (selectedClusters.includes(event.target.name)) {
        // remove from selected clusters
        setSelectedClusters(selectedClusters.filter(cluster => cluster !== event.target.name));
      } else {
        // add to selected clusters
        setSelectedClusters([...selectedClusters, event.target.name]);
      }
    }
  }

  function renderSwitch() {
    switch (state) {
      case 'load_kubeconfig':
        return (
          <Box
            border={1}
            borderColor="secondary.main"
            {...getRootProps()}
            className={classes.dropzone}
          >
            <FormControl>
              <input {...getInputProps()} />
              <Icon
                icon="mdi:upload"
                style={{ fontSize: '64px', width: 'auto', justifySelf: 'center' }}
              />
              <Typography>{t('cluster|Drag&Drop your kubeconfig file here')}</Typography>
              <Button variant="contained" onClick={() => open}>
                {t('cluster|Upload File')}
              </Button>
            </FormControl>
          </Box>
        );
      case 'selecting_clusters':
        return (
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Typography>{t('cluster|Select Clusters')}</Typography>
            {fileContent.clusters ? (
              <>
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '15px',
                  }}
                >
                  <FormControl
                    style={{
                      overflowY: 'auto',
                      height: '100px',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                    }}
                  >
                    {fileContent.clusters.map(cluster => {
                      return (
                        <FormControlLabel
                          key={cluster.name}
                          control={
                            <Checkbox
                              value={cluster.name}
                              name={cluster.name}
                              onChange={handleCheckboxChange}
                            />
                          }
                          label={cluster.name}
                        />
                      );
                    })}
                  </FormControl>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setState('configuring_clusters');
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            ) : null}
          </Box>
        );
      case 'configuring_clusters':
        return (
          <Box style={{ textAlign: 'center' }}>
            <Typography>{t('cluster|Setting up cluster')}</Typography>
            <Loader title={t('cluster|Setting up cluster')} />
          </Box>
        );
      case 'success':
        return (
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Typography>{t('cluster|Cluster setup successfully!')}</Typography>
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={() => back()}>
                Finish
              </Button>
            </Box>
          </Box>
        );
    }
  }

  return (
    <Box>
      {renderSwitch()}
      {state !== 'success' && (
        <Box style={{ justifyContent: 'center', display: 'flex' }}>
          <Button variant="contained" color="primary" onClick={back}>
            {t('frequent|Cancel')}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Chooser;
