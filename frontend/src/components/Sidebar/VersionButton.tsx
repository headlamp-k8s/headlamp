import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled, useTheme } from '@mui/system';
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

const VersionIcon = styled(Icon)({
  marginTop: '5px',
  marginRight: '5px',
  marginLeft: '5px',
});

export default function VersionButton() {
  const isSidebarOpen = useTypedSelector(state => state.sidebar.isSidebarOpen);
  const { enqueueSnackbar } = useSnackbar();
  const [clusterVersion, setClusterVersion] = React.useState<StringDict | null>(null);
  const cluster = useCluster();
  const theme = useTheme();
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
                msg = t('translation|Cluster version upgraded to {{ gitVersion }}', {
                  gitVersion: results.gitVersion,
                });
              } else if (versionChange < 0) {
                msg = t('translation|Cluster version downgraded to {{ gitVersion }}', {
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
    <Box
      mx="auto"
      pt=".2em"
      sx={{
        textAlign: 'center',
        '& .MuiButton-label': {
          color: 'sidebarLink.main',
        },
      }}
    >
      <Button
        onClick={() => setOpen(true)}
        style={{ textTransform: 'none', paddingBottom: 0, paddingTop: 0 }}
      >
        <Box display={isSidebarOpen ? 'flex' : 'block'} alignItems="center">
          <Box>
            <VersionIcon color={theme.palette.text.secondary} icon="mdi:kubernetes" />
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
            {t('translation|Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
