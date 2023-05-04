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
import { getVersion, useCluster } from '../../lib/k8s';
import { StringDict } from '../../lib/k8s/cluster';
import { useTypedSelector } from '../../redux/reducers/reducers';
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
    marginLeft: '5px',
  },
}));

export default function VersionButton() {
  const sidebar = useTypedSelector(state => state.ui.sidebar);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useVersionButtonStyle();
  const [clusterVersion, setClusterVersion] = React.useState<StringDict | null>(null);
  const cluster = useCluster();
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation('glossary');

  function getVersionRows() {
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
        getVersion()
          .then((results: StringDict) => {
            if (!stillAlive) {
              return;
            }

            setClusterVersion(results);
            let versionChange = 0;
            if (clusterVersion && results && results.gitVersion) {
              versionChange = semver.compare(results.gitVersion, clusterVersion.gitVersion);

              let msg = '';
              if (versionChange > 0) {
                msg = t('cluster|Cluster version upgraded to {{ gitVersion }}', {
                  gitVersion: results.gitVersion,
                });
              } else if (versionChange < 0) {
                msg = t('cluster|Cluster version downgraded to {{ gitVersion }}', {
                  gitVersion: results.gitVersion,
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
          })
          .catch((error: Error) => console.error('Getting the cluster version:', error));
      }

      if (!clusterVersion) {
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
    [clusterVersion]
  );

  // Use the location to make sure the version is changed, as it depends on the cluster
  // (defined in the URL ATM).
  // @todo: Update this if the active cluster management is changed.
  React.useEffect(() => {
    setClusterVersion(null);
  }, [cluster]);

  function handleClose() {
    setOpen(false);
  }

  return !clusterVersion ? null : (
    <Box mx="auto" py=".2em" className={classes.versionBox}>
      <Button onClick={() => setOpen(true)} style={{ textTransform: 'none' }}>
        <Box display={sidebar.isSidebarOpen ? 'flex' : 'block'} alignItems="center">
          <Box>
            <Icon color="#adadad" icon="mdi:kubernetes" className={classes.versionIcon} />
          </Box>
          <Box>{clusterVersion.gitVersion}</Box>
        </Box>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('Kubernetes Version')}</DialogTitle>
        <DialogContent>
          <NameValueTable rows={getVersionRows()} />
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
