import { InlineIcon } from '@iconify/react';
import { Box, Button, CircularProgress, Tooltip, Typography } from '@material-ui/core';
import MuiLink from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useTranslation } from 'react-i18next';
import helpers from '../../../helpers';
import { deletePortForward, listPortForward, startPortForward } from '../../../lib/k8s/apiProxy';
import { getCluster } from '../../../lib/util';
import ActionButton from '../ActionButton';

interface PortForwardProps {
  isPod: boolean;
  containerPort: number;
  namespace?: string;
  name?: string;
  isPodRunning?: boolean;
}

export interface PortForwardState {
  id: string;
  namespace: string;
  cluster: string;
  port: string;
}

export default function PortForward(props: PortForwardProps) {
  const { isPod, containerPort, namespace, name, isPodRunning } = props;
  const [isCurrentPodOrServicePortForwarding, setIsCurrentPodOrServicePortForwarding] =
    React.useState(false);
  const [error, setError] = React.useState(null);
  const [portForward, setPortForward] = React.useState<PortForwardState | null>(null);
  const [loading, setLoading] = React.useState(false);
  const cluster = getCluster();
  const { t } = useTranslation('frequent');

  if (!helpers.isElectron()) {
    return null;
  }

  function handlePortForward() {
    if (!namespace || !containerPort || !cluster) {
      return;
    }

    setError(null);

    const massagedResourceName = name || '';
    const serviceName = !isPod ? massagedResourceName : '';
    const podName = isPod ? massagedResourceName : '';
    setLoading(true);
    startPortForward(cluster, namespace, podName, containerPort, serviceName)
      .then((data: any) => {
        setLoading(false);
        setPortForward(data);
        setIsCurrentPodOrServicePortForwarding(true);
      })
      .catch(() => {
        setPortForward(null);
      });
  }

  function portForwardStopHandler() {
    if (!portForward || !cluster) {
      return;
    }
    deletePortForward(cluster, portForward.id)
      .then(() => {
        setPortForward(null);
      })
      .catch(() => {
        setPortForward(null);
      });
  }

  React.useEffect(() => {
    if (!cluster) {
      return;
    }
    listPortForward(cluster).then(result => {
      const portforwards = result;
      if (!portforwards || Object.entries(portforwards).length === 0) {
        return;
      }
      for (const key in portforwards) {
        const item = portforwards[key];
        if (
          item.namespace === namespace &&
          (item.pod === name || item.service === name) &&
          item.cluster === cluster
        ) {
          setIsCurrentPodOrServicePortForwarding(true);
          setPortForward(portforwards[key]);
          return;
        }
      }
    });
  }, []);

  if (isPod && !isPodRunning) {
    return null;
  }

  const forwardBaseURL = 'http://127.0.0.1';

  return !portForward ? (
    <Box display="flex">
      {loading ? (
        <CircularProgress size={18} />
      ) : (
        <Button
          onClick={handlePortForward}
          aria-label="start portforward"
          color="primary"
          variant="outlined"
          style={{
            textTransform: 'none',
          }}
        >
          <InlineIcon icon="mdi:fast-forward" width={20} />
          <Typography>{t('frequent|Forward port')}</Typography>
        </Button>
      )}
      {error && (
        <Box>
          {
            <Alert
              severity="error"
              onClose={() => {
                setError(null);
              }}
            >
              <Tooltip title={error}>
                <Box style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{error}</Box>
              </Tooltip>
            </Alert>
          }
        </Box>
      )}
    </Box>
  ) : (
    <>
      {isCurrentPodOrServicePortForwarding && (
        <Box>
          <MuiLink href={`${forwardBaseURL}:${portForward.port}`} target="_blank" color="primary">
            {`${forwardBaseURL}:${portForward.port}`}
          </MuiLink>
          <ActionButton
            onClick={portForwardStopHandler}
            description={t('frequent|Stop forwarding')}
            color="primary"
            icon="mdi:stop-circle-outline"
            iconButtonProps={{
              size: 'small',
              color: 'primary',
            }}
            width={'25'}
          />
        </Box>
      )}
    </>
  );
}
