import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import semver from 'semver';
import { getVersion, getVersionForCluster, useCluster } from '../../lib/k8s';
import { StringDict } from '../../lib/k8s/cluster';
import { getClusterGroup } from '../../lib/util';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { Tabs } from '../common';
import { NameValueTable } from '../common/SimpleTable';

const versionSnackbarHideTimeout = 5000; // ms
const versionFetchInterval = 60000; // ms

const useVersionButtonStyle = makeStyles(theme => ({
  versionBox: {
    textAlign: 'center',
    '& .MuiButton-label': {
      color: theme.palette.sidebarLink.main,
    },
  },
  versionIcon: {
    marginTop: '5px',
    marginRight: '5px',
  },
}));

export default function VersionButton() {
  const sidebar = useTypedSelector(state => state.ui.sidebar);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useVersionButtonStyle();
  const [clusterVersions, setClusterVersions] = React.useState<{
    [key: string]: StringDict | null;
  }>({});
  const cluster = useCluster();
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation('glossary');
  const clusters = React.useMemo(() => {
    return getClusterGroup();
  }, [cluster]);

  function getVersionRows(clusterName: string) {
    if (!Object.values(clusterVersions).length) {
      return [];
    }

    const clusterVersion = clusterVersions[clusterName];
    if (!clusterVersion) {
      return [];
    }

    return [
      {
        name: t('Git Version'),
        value: clusterVersion?.gitVersion,
      },
      {
        name: t('Git Commit'),
        value: clusterVersion?.gitCommit,
      },
      {
        name: t('Git Tree State'),
        value: clusterVersion?.gitTreeState,
      },
      {
        name: t('Go Version'),
        value: clusterVersion?.goVersion,
      },
      {
        name: t('Platform'),
        value: clusterVersion?.platform,
      },
    ];
  }

  React.useEffect(
    () => {
      let stillAlive = true;
      function fetchVersion() {
        Promise.allSettled(clusters.map(cluster => getVersionForCluster(cluster || '')))
          .then(results => {
            if (!stillAlive) {
              return;
            }
            const newVersions: typeof clusterVersions = {};
            for (const result of results) {
              const { status } = result;

              if (status === 'rejected') {
                console.error(
                  'Getting the version for a cluster:',
                  (result as PromiseRejectedResult).reason
                );
                continue;
              }

              const [cluster, clusterVersion] = (
                result as PromiseFulfilledResult<[string, StringDict]>
              ).value;

              newVersions[cluster] = clusterVersion;
              let versionChange = 0;

              if (clusterVersion && clusterVersion && clusterVersion.gitVersion) {
                versionChange = semver.compare(
                  clusterVersion.gitVersion,
                  clusterVersion.gitVersion
                );

                let msg = '';
                if (versionChange > 0) {
                  msg = t('cluster|Cluster version upgraded to {{ gitVersion }}', {
                    gitVersion: clusterVersion.gitVersion,
                  });
                } else if (versionChange < 0) {
                  msg = t('cluster|Cluster version downgraded to {{ gitVersion }}', {
                    gitVersion: clusterVersion.gitVersion,
                  });
                }

                if (msg) {
                  enqueueSnackbar(msg, {
                    key: 'version',
                    preventDuplicate: true,
                    autoHideDuration: versionSnackbarHideTimeout,
                    variant: 'info',
                  });
                }
              }
            }

            setClusterVersions(newVersions);
          })
          .catch((error: Error) => console.error('Getting the cluster version:', error));

        for (const cluster of []) {
          getVersion(cluster)
            .then()
            .catch((error: Error) => console.error('Getting the cluster version:', error));
        }
      }

      if (Object.keys(clusterVersions).length === 0) {
        fetchVersion();
      }

      const intervalHandler = setInterval(() => {
        fetchVersion();
      }, versionFetchInterval);

      return function cleanup() {
        stillAlive = false;
        clearInterval(intervalHandler);
      };
    },
    // eslint-disable-next-line
    [clusterVersions]
  );

  // Use the location to make sure the version is changed, as it depends on the cluster
  // (defined in the URL ATM).
  // @todo: Update this if the active cluster management is changed.
  React.useEffect(() => {
    setClusterVersions(versions => {
      if (!cluster || !versions[cluster]) {
        return {};
      }
      return versions;
    });
  }, [cluster]);

  function handleClose() {
    setOpen(false);
  }

  const clusterVersionText = React.useMemo(() => {
    let versionText: string[] = [];
    // We only up to two versions (if they are different). If more
    // than 2 different versions exist, then we show the 1st one + ... .
    for (const versionInfo of Object.values(clusterVersions)) {
      if (versionText.length > 2) {
        break;
      }

      if (versionText.length === 0 && !!versionInfo?.gitVersion) {
        versionText.push(versionInfo.gitVersion);
      } else if (versionText[0] === (versionInfo?.gitVersion || '')) {
        // If it's the same version, we just check the next cluster's.
        continue;
      } else if (!!versionInfo?.gitVersion) {
        versionText.push(versionInfo.gitVersion);
      }
    }

    if (versionText.length > 2) {
      versionText = [versionText[0], '...'];
    }

    return versionText.join('+');
  }, [clusterVersions]);

  return Object.keys(clusterVersions).length === 0 ? null : (
    <Box mx="auto" py=".2em" className={classes.versionBox}>
      <Button onClick={() => setOpen(true)} style={{ textTransform: 'none' }}>
        <Box display={sidebar.isSidebarOpen ? 'flex' : 'block'} alignItems="center">
          <Box>
            <Icon color="#adadad" icon="mdi:kubernetes" className={classes.versionIcon} />
          </Box>
          <Box>{clusterVersionText}</Box>
        </Box>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('Kubernetes Version')}</DialogTitle>
        <DialogContent>
          {Object.keys(clusterVersions).length === 1 ? (
            <NameValueTable rows={getVersionRows(cluster || '')} />
          ) : (
            <Tabs
              tabs={Object.keys(clusterVersions).map(clusterName => ({
                label: clusterName,
                component: (
                  <Box mt={2}>
                    <NameValueTable rows={getVersionRows(clusterName)} />
                  </Box>
                ),
              }))}
              ariaLabel={t('Kubernetes Version')}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('frequent|Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
