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

const PODS_BACKEND_PORTFORWARD_KEY = 'pods';
const SERVICE_BACKEND_PORTFORWARD_KEY = 'services';
const PORTFORWARD_STORAGE_KEY_FOR_PODS = 'portforward-pods';
const PORTFORWARD_STORAGE_KEY_FOR_SERVICES = 'portforward-services';

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
        const portForwards = localStorage.getItem(
          isPod ? PORTFORWARD_STORAGE_KEY_FOR_PODS : PORTFORWARD_STORAGE_KEY_FOR_SERVICES
        );
        if (!portForwards) {
          const portForwardsList = [];
          portForwardsList.push(JSON.stringify(data));
          return;
        }
        const parsedPortForwards = JSON.parse(portForwards);
        parsedPortForwards.push(data);
        localStorage.setItem(
          isPod ? PORTFORWARD_STORAGE_KEY_FOR_PODS : PORTFORWARD_STORAGE_KEY_FOR_SERVICES,
          JSON.stringify(parsedPortForwards)
        );
      })
      .catch(() => {
        setPortForward(null);
      });
  }

  function portForwardStopHandler() {
    if (!portForward || !cluster) {
      return;
    }
    deletePortForward(
      cluster,
      portForward.id,
      isPod ? PODS_BACKEND_PORTFORWARD_KEY : SERVICE_BACKEND_PORTFORWARD_KEY
    )
      .then(() => {
        setPortForward(null);
        const id = portForward.id;
        const portForwards = localStorage.getItem(
          isPod ? PORTFORWARD_STORAGE_KEY_FOR_PODS : PORTFORWARD_STORAGE_KEY_FOR_SERVICES
        );
        if (!portForwards) {
          return;
        }
        const parsedPortForwards = JSON.parse(portForwards);
        const filteredPortForwards = parsedPortForwards.filter((item: any) => item.id !== id);

        localStorage.setItem(
          isPod ? PORTFORWARD_STORAGE_KEY_FOR_PODS : PORTFORWARD_STORAGE_KEY_FOR_SERVICES,
          JSON.stringify(filteredPortForwards)
        );
      })
      .catch(() => {
        setPortForward(null);
      });
  }

  React.useEffect(() => {
    if (!cluster) {
      return;
    }
    listPortForward(
      cluster,
      isPod ? PODS_BACKEND_PORTFORWARD_KEY : SERVICE_BACKEND_PORTFORWARD_KEY
    ).then(result => {
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
