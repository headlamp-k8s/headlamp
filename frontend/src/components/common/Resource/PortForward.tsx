import { InlineIcon } from '@iconify/react';
import { Box, Button, CircularProgress, Tooltip, Typography } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import MuiLink from '@material-ui/core/Link';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useTranslation } from 'react-i18next';
import helpers from '../../../helpers';
import {
  listPortForward,
  startPortForward,
  stopOrDeletePortForward,
} from '../../../lib/k8s/apiProxy';
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
  status: string;
}

export const PORT_FORWARDS_STORAGE_KEY = 'portforwards';
export const PORT_FORWARD_STOP_STATUS = 'Stopped';
export const PORT_FORWARD_RUNNING_STATUS = 'Running';

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
  const { t } = useTranslation(['frequent', 'resource']);
  const [pods, podsFetchError] = Pod.useList({ labelSelector: getPodsSelectorFilter(service) });
  const massagedContainerPort =
    typeof containerPort === 'string' && isNaN(parseInt(containerPort))
      ? getPortNumberFromPortName(pods[0].spec.containers, containerPort)
      : containerPort;

  React.useEffect(() => {
    if (!cluster) {
      return;
    }
    listPortForward(cluster).then(result => {
      const portForwards = result;
      if (!portForwards || portForwards.length === 0) {
        return;
      }
      for (const item of portForwards) {
        if (
          (item.namespace === namespace || item.serviceNamespace === namespace) &&
          (item.pod === name || item.service === name) &&
          item.cluster === cluster &&
          item.targetPort === massagedContainerPort.toString()
        ) {
          setPortForward(item);
          return;
        }
      }
      const massagedPortForwards = [...portForwards];
      const portForwardsInStorage = localStorage.getItem(PORT_FORWARDS_STORAGE_KEY);
      const parsedPortForwards = JSON.parse(portForwardsInStorage || '[]');
      parsedPortForwards.forEach((portforward: any) => {
        const isPortForwardInStorage = portForwards.find((pf: any) => pf.id === portforward.id);
        if (!isPortForwardInStorage) {
          portforward.status = PORT_FORWARD_STOP_STATUS;
          massagedPortForwards.push(portforward);
        }
      });
      localStorage.setItem(PORT_FORWARDS_STORAGE_KEY, JSON.stringify(massagedPortForwards));
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

    setLoading(true);
    startPortForward(
      cluster,
      massagedResourceNamespace,
      podName,
      massagedContainerPort,
      serviceName,
      serviceNamespace,
      portForward?.port,
      portForward?.id
    )
      .then((data: any) => {
        setLoading(false);
        setPortForward(data);

        // append this new started portforward to storage
        const portForwardsInStorage = localStorage.getItem(PORT_FORWARDS_STORAGE_KEY);
        const parsedPortForwards = JSON.parse(portForwardsInStorage || '[]');
        parsedPortForwards.push(data);
        localStorage.setItem(PORT_FORWARDS_STORAGE_KEY, JSON.stringify(parsedPortForwards));
      })
      .catch(() => {
        setPortForward(null);
      });
  }

  function portForwardStopHandler() {
    if (!portForward || !cluster) {
      return;
    }
    setLoading(true);
    stopOrDeletePortForward(cluster, portForward.id, true)
      .then(() => {
        portForward.status = PORT_FORWARD_STOP_STATUS;
        setPortForward(portForward);
      })
      .catch(() => {
        setPortForward(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function deletePortForwardHandler() {
    const id = portForward?.id;
    const cluster = getCluster();
    setLoading(true);
    if (!cluster || !id) {
      return;
    }
    stopOrDeletePortForward(cluster, id, false).finally(() => {
      setLoading(false);
      // remove portforward from storage too
      const portforwardInStorage = localStorage.getItem(PORT_FORWARDS_STORAGE_KEY);
      const parsedPortForwards = JSON.parse(portforwardInStorage || '[]');
      const index = parsedPortForwards.findIndex((pf: any) => pf.id === id);
      if (index !== -1) {
        parsedPortForwards.splice(index, 1);
      }
      localStorage.setItem(PORT_FORWARDS_STORAGE_KEY, JSON.stringify(parsedPortForwards));
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
          aria-label={t('resource|Start port forward')}
          color="primary"
          variant="outlined"
          style={{
            textTransform: 'none',
          }}
          disabled={loading}
        >
          <InlineIcon icon="mdi:fast-forward" width={20} />
          <Typography>{t('resource|Forward port')}</Typography>
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
              <Tooltip title="error">
                <Box style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{error}</Box>
              </Tooltip>
            </Alert>
          }
        </Box>
      )}
    </Box>
  ) : (
        <Box>
          {portForward.status === PORT_FORWARD_STOP_STATUS ? (
            <Box display={'flex'} alignItems="center">
              <Typography
                style={{
                  color: grey[500],
                }}
              >{`${forwardBaseURL}:${portForward.port}`}</Typography>
              <ActionButton
                onClick={handlePortForward}
                description={t('resource|Start port forward')}
                color="primary"
                icon="mdi:fast-forward"
                iconButtonProps={{
                  size: 'small',
                  color: 'primary',
                  disabled: loading,
                }}
                width={'25'}
              />
              <ActionButton
                onClick={deletePortForwardHandler}
                description={t('resource|Delete port forward')}
                color="primary"
                icon="mdi:delete-outline"
                iconButtonProps={{
                  size: 'small',
                  color: 'primary',
                  disabled: loading,
                }}
                width={'25'}
              />
            </Box>
          ) : (
            <>
              <MuiLink
                href={`${forwardBaseURL}:${portForward.port}`}
                target="_blank"
                color="primary"
              >
                {`${forwardBaseURL}:${portForward.port}`}
              </MuiLink>
              <ActionButton
                onClick={portForwardStopHandler}
                description={t('resource|Stop port forward')}
                color="primary"
                icon="mdi:stop-circle-outline"
                iconButtonProps={{
                  size: 'small',
                  color: 'primary',
                  disabled: loading,
                }}
                width={'25'}
              />
            </>
          )}
        </Box>
  );
}
