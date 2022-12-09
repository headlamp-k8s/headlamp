import { InlineIcon } from '@iconify/react';
import { Box, Button, CircularProgress, Tooltip, Typography } from '@material-ui/core';
import MuiLink from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useTranslation } from 'react-i18next';
import helpers from '../../../helpers';
import { deletePortForward, listPortForward, startPortForward } from '../../../lib/k8s/apiProxy';
import { KubeContainer } from '../../../lib/k8s/cluster';
import Pod from '../../../lib/k8s/pod';
import Service from '../../../lib/k8s/service';
import { getCluster } from '../../../lib/util';
import ActionButton from '../ActionButton';

interface PortForwardProps {
  isPod: boolean;
  containerPort: number | string;
  service?: Service;
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

function getPortNumberFromPortName(containers: KubeContainer[], namedPort: string) {
  let portNumber = 0;
  containers.every((container: KubeContainer) => {
    container.ports?.find((port: any) => {
      if (port.name === namedPort) {
        portNumber = port.containerPort;
        return false;
      }
    });
    return true;
  });
  return portNumber;
}

function getPodsSelectorFilter(service?: Service) {
  if (!service) {
    return '';
  }
  const selector = service?.jsonData.spec?.selector;
  if (selector) {
    return Object.keys(service?.jsonData.spec?.selector)
      .map(item => `${item}=${selector[item]}`)
      .join(',');
  }
  return '';
}

export default function PortForward(props: PortForwardProps) {
  const { isPod, containerPort, namespace, name, isPodRunning, service } = props;
  const [error, setError] = React.useState(null);
  const [portForward, setPortForward] = React.useState<PortForwardState | null>(null);
  const [loading, setLoading] = React.useState(false);
  const cluster = getCluster();
  const { t } = useTranslation('frequent');
  const [pods, podsFetchError] = Pod.useList({ labelSelector: getPodsSelectorFilter(service) });

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
          (item.namespace === namespace || item.serviceNamespace === namespace) &&
          (item.pod === name || item.service === name) &&
          item.cluster === cluster
        ) {
          setPortForward(portforwards[key]);
          return;
        }
      }
    });
  }, []);

  if (!helpers.isElectron()) {
    return null;
  }

  if (!isPod && podsFetchError) {
    return null;
  }

  if (!isPod && (!pods || pods.length === 0)) {
    return null;
  }

  function handlePortForward() {
    if (!namespace || !cluster) {
      return;
    }

    setError(null);

    const massagedResourceName = name || '';
    const massagedResourceNamespace = isPod ? namespace : pods[0].metadata.namespace;
    const serviceNamespace = namespace;
    const serviceName = !isPod ? massagedResourceName : '';
    const podName = isPod ? massagedResourceName : pods[0].metadata.name;
    const massagedContainerPort =
      typeof containerPort === 'string' && isNaN(parseInt(containerPort))
        ? getPortNumberFromPortName(pods[0].spec.containers, containerPort)
        : containerPort;
    setLoading(true);
    startPortForward(
      cluster,
      massagedResourceNamespace,
      podName,
      massagedContainerPort,
      serviceName,
      serviceNamespace
    )
      .then((data: any) => {
        setLoading(false);
        setPortForward(data);
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
  );
}
