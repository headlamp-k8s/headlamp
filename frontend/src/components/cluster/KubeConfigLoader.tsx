import { InlineIcon } from '@iconify/react';
import { Button, Checkbox, FormControl, Grid, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import * as yaml from 'js-yaml';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setCluster } from '../../lib/k8s/apiProxy';
import { setConfig } from '../../redux/configSlice';
import { DialogTitle } from '../common/Dialog';
import Loader from '../common/Loader';
import { ClusterDialog } from './Chooser';

interface Cluster {
  name: string;
  cluster: {
    server: string;
    [key: string]: any;
  };
}

interface User {
  name: string;
  user: {
    token: string;
    [key: string]: any;
  };
}

interface kubeconfig {
  clusters: Cluster[];
  users: User[];
  contexts: { name: string; context: { cluster: string; user: string } }[];
  currentContext: string;
}

function configWithSelectedClusters(config: kubeconfig, selectedClusters: string[]): kubeconfig {
  const newConfig: kubeconfig = {
    clusters: [],
    users: [],
    contexts: [],
    currentContext: '',
  };

  // We use a map to avoid duplicates since many contexts can point to the same cluster/user.
  const clusters: { [key: string]: Cluster } = {};
  const users: { [key: string]: User } = {};

  selectedClusters.forEach(clusterName => {
    const context = config.contexts.find(c => c.name === clusterName);
    if (!context) {
      return;
    }

    const cluster = config.clusters.find(c => c.name === context.context.cluster);
    if (!cluster) {
      return;
    }
    clusters[cluster.name] = cluster;

    // Optionally add the user.
    const user = config.users?.find(c => c.name === context.context.user);
    if (!!user) {
      users[user.name] = user;
    }

    newConfig.contexts.push(context);
  });

  newConfig.clusters = Object.values(clusters);
  newConfig.users = Object.values(users);

  return newConfig;
}

const useStyles = makeStyles(theme => ({
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
  blackButton: {
    backgroundColor: theme.palette.sidebarBg,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      opacity: '0.8',
      backgroundColor: theme.palette.sidebarBg,
    },
  },
  wideButton: {
    width: '100%',
    maxWidth: '300px',
  },
  centeredBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  selectorBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    padding: '15px',
    width: '100%',
    maxWidth: '300px',
  },
  selectorForm: {
    overflowY: 'auto',
    height: '150px',
    paddingLeft: '10px',
    paddingRight: '10px',
    width: '100%',
  },
}));

const enum Step {
  LoadKubeConfig,
  SelectClusters,
  ConfigureClusters,
  Success,
}

function KubeConfigLoader() {
  const history = useHistory();
  const [state, setState] = useState(Step.LoadKubeConfig);
  const [error, setError] = React.useState('');
  const [fileContent, setFileContent] = useState<kubeconfig>({
    clusters: [],
    users: [],
    contexts: [],
    currentContext: '',
  });
  const [selectedClusters, setSelectedClusters] = useState<string[]>([]);

  useEffect(() => {
    if (fileContent.contexts.length > 0) {
      setSelectedClusters(fileContent.contexts.map(context => context.name));
      setState(Step.SelectClusters);
    }
    return () => {};
  }, [fileContent]);

  useEffect(() => {
    if (state === Step.ConfigureClusters) {
      function loadClusters() {
        //@todo: We need to check if the cluster is already configured.
        const selectedClusterConfig = configWithSelectedClusters(fileContent, selectedClusters);
        setCluster({ kubeconfig: btoa(yaml.dump(selectedClusterConfig)) })
          .then(res => {
            if (res.clusters.length > 0) {
              dispatch(setConfig(res));
              setState(Step.Success);
            }
          })
          .catch(e => {
            console.debug('Error setting up clusters from kubeconfig:', e);
            setError(
              t('translation|Error setting up clusters, please load a valid kubeconfig file')
            );
            setState(Step.SelectClusters);
          });
      }
      loadClusters();
    }
    return () => {};
  }, [state]);

  const dispatch = useDispatch();
  const { t } = useTranslation(['translation']);

  const classes = useStyles();

  const onDrop = (acceptedFiles: Blob[]) => {
    setError('');
    const reader = new FileReader();
    reader.onerror = () => setError(t("translation|Couldn't read kubeconfig file"));
    reader.onload = () => {
      try {
        const data = String.fromCharCode.apply(null, [
          ...new Uint8Array(reader.result as ArrayBuffer),
        ]);
        const doc = yaml.load(data) as kubeconfig;
        if (!doc.clusters || !doc.contexts) {
          throw new Error('Invalid kubeconfig file');
        }
        setFileContent(doc);
      } catch (err) {
        setError(t('translation|Load a valid kubeconfig'));
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
    if (!event.target.checked) {
      // remove from selected clusters
      setSelectedClusters(selectedClusters =>
        selectedClusters.filter(cluster => cluster !== event.target.name)
      );
    } else {
      // add to selected clusters
      setSelectedClusters(selectedClusters => [...selectedClusters, event.target.name]);
    }
  }

  function renderSwitch() {
    switch (state) {
      case Step.LoadKubeConfig:
        return (
          <Box>
            <Box
              border={1}
              borderColor="secondary.main"
              {...getRootProps()}
              className={classes.dropzone}
            >
              <FormControl>
                <input {...getInputProps()} />
                <Tooltip
                  title={t('translation|Drag & drop or choose kubeconfig file here')}
                  placement="top"
                >
                  <Button
                    variant="contained"
                    onClick={() => open}
                    startIcon={<InlineIcon icon="mdi:upload" width={32} />}
                  >
                    {t('translation|Choose file')}
                  </Button>
                </Tooltip>
              </FormControl>
            </Box>
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={() => history.goBack()} className={classes.wideButton}>
                {t('translation|Back')}
              </Button>
            </Box>
          </Box>
        );
      case Step.SelectClusters:
        return (
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <Typography>{t('translation|Select clusters')}</Typography>
            {fileContent.clusters ? (
              <>
                <Box className={classes.selectorBox}>
                  <FormControl className={classes.selectorForm}>
                    {fileContent.contexts.map(context => {
                      return (
                        <FormControlLabel
                          key={context.name}
                          control={
                            <Checkbox
                              value={context.name}
                              name={context.name}
                              onChange={handleCheckboxChange}
                              color="primary"
                              checked={selectedClusters.includes(context.name)}
                            />
                          }
                          label={context.name}
                        />
                      );
                    })}
                  </FormControl>
                  <Grid
                    container
                    direction="column"
                    spacing={2}
                    justifyContent="center"
                    alignItems="stretch"
                  >
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setState(Step.ConfigureClusters);
                        }}
                        className={clsx(classes.wideButton, classes.blackButton)}
                        disabled={selectedClusters.length === 0}
                      >
                        {t('translation|Next')}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        onClick={() => {
                          setError('');
                          setState(Step.LoadKubeConfig);
                        }}
                        className={classes.wideButton}
                      >
                        {t('translation|Back')}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </>
            ) : null}
          </Box>
        );
      case Step.ConfigureClusters:
        return (
          <Box style={{ textAlign: 'center' }}>
            <Typography>{t('translation|Setting up clusters')}</Typography>
            <Loader title={t('translation|Setting up clusters')} />
          </Box>
        );
      case Step.Success:
        return (
          <Box className={classes.centeredBox}>
            <Box style={{ padding: '32px' }}>
              <Typography>{t('translation|Clusters successfully set up!')}</Typography>
            </Box>
            <Button
              variant="contained"
              className={clsx(classes.wideButton, classes.blackButton)}
              onClick={() => history.replace('/')}
            >
              {t('translation|Finish')}
            </Button>
          </Box>
        );
    }
  }

  return (
    <ClusterDialog
      showInfoButton={false}
      // Disable backdrop clicking.
      onClose={() => {}}
      useCover
    >
      <DialogTitle>{t('translation|Load from KubeConfig')}</DialogTitle>
      {error && error !== '' ? (
        <Box style={{ backgroundColor: 'red', textAlign: 'center', padding: '4px' }}>{error}</Box>
      ) : null}
      <Box>{renderSwitch()}</Box>
    </ClusterDialog>
  );
}

export default KubeConfigLoader;
