import { InlineIcon } from '@iconify/react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { apply, drainNode, drainNodeStatus } from '../../lib/k8s/apiProxy';
import { KubeMetrics } from '../../lib/k8s/cluster';
import Node from '../../lib/k8s/node';
import { getCluster, timeAgo } from '../../lib/util';
import { clusterAction } from '../../redux/clusterActionSlice';
import { CpuCircularChart, MemoryCircularChart } from '../cluster/Charts';
import { ActionButton, ObjectEventList, StatusLabelProps } from '../common';
import { HeaderLabel, StatusLabel, ValueLabel } from '../common/Label';
import { MainInfoSection, OwnedPodsSection, PageGrid } from '../common/Resource';
import AuthVisible from '../common/Resource/AuthVisible';
import { SectionBox } from '../common/SectionBox';
import { NameValueTable } from '../common/SimpleTable';
import DetailsViewSection from '../DetailsViewSection';

function NodeConditionsLabel(props: { node: Node }) {
  const { node } = props;
  const unschedulable = node?.jsonData?.spec?.unschedulable;
  const { t } = useTranslation();
  return unschedulable ? (
    <StatusLabel status="warning">{t('translation|Scheduling Disabled')}</StatusLabel>
  ) : (
    <StatusLabel status="success">{t('translation|Scheduling Enabled')}</StatusLabel>
  );
}

export default function NodeDetails() {
  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation(['glossary']);
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const [nodeMetrics, metricsError] = Node.useMetrics();
  const [isupdatingNodeScheduleProperty, setisUpdatingNodeScheduleProperty] = React.useState(false);
  const [isNodeDrainInProgress, setisNodeDrainInProgress] = React.useState(false);
  const [nodeFromAPI, nodeError] = Node.useGet(name);
  const [node, setNode] = useState(nodeFromAPI);
  const noMetrics = metricsError?.status === 404;

  useEffect(() => {
    setNode(nodeFromAPI);
  }, [nodeFromAPI]);

  function getAddresses(item: Node) {
    return item.status.addresses.map(({ type, address }) => {
      return {
        name: type,
        value: address,
      };
    });
  }

  function handleNodeScheduleState(node: Node, cordon: boolean) {
    setisUpdatingNodeScheduleProperty(true);
    const cloneNode = _.cloneDeep(node);

    cloneNode.spec.unschedulable = !cordon;
    dispatch(
      clusterAction(
        () =>
          apply(cloneNode.jsonData)
            .then(() => {
              setNode(cloneNode);
            })
            .finally(() => {
              setisUpdatingNodeScheduleProperty(false);
            }),
        {
          startMessage: cordon
            ? t('Uncordoning node {{name}}…', {
                name: node.metadata.name,
              })
            : t('Cordoning node {{name}}…', { name: node.metadata.name }),
          successMessage: cordon
            ? t('Uncordoned node {{name}}.', { name: node.metadata.name })
            : t('Cordoned node {{name}}.', { name: node.metadata.name }),
          errorMessage: cordon
            ? t('Failed to uncordon node {{name}}.', { name: node.metadata.name })
            : t('Failed to cordon node {{name}}.', { name: node.metadata.name }),
          cancelledMessage: cordon
            ? t('Uncordon node {{name}} cancelled.', { name: node.metadata.name })
            : t('Cordon node {{name}} cancelled.', { name: node.metadata.name }),
          cancelCallback: () => {
            setisUpdatingNodeScheduleProperty(false);
          },
        }
      )
    );
  }

  function getDrainNodeStatus(cluster: string, nodeName: string) {
    setTimeout(() => {
      drainNodeStatus(cluster, nodeName)
        .then(data => {
          if (data && data.id.startsWith('error')) {
            enqueueSnackbar(data.id, { variant: 'error' });
            return;
          }
          if (data && data.id !== 'success') {
            getDrainNodeStatus(cluster, nodeName);
            return;
          }
          const cloneNode = _.cloneDeep(node);

          cloneNode.spec.unschedulable = !node.spec.unschedulable;
          setNode(cloneNode);
        })
        .catch(error => {
          enqueueSnackbar(error.message, { variant: 'error' });
        });
    }, 1000);
  }

  function handleNodeDrain(node: Node) {
    const cluster = getCluster();
    if (!cluster) return;

    setisNodeDrainInProgress(true);
    dispatch(
      clusterAction(
        () =>
          drainNode(cluster, node.metadata.name)
            .then(() => {
              getDrainNodeStatus(cluster, node.metadata.name);
            })
            .catch(error => {
              enqueueSnackbar(error.message, { variant: 'error' });
            })
            .finally(() => {
              setisNodeDrainInProgress(false);
            }),
        {
          startMessage: t('Draining node {{name}}…', { name: node.metadata.name }),
          successMessage: t('Drained node {{name}}.', { name: node.metadata.name }),
          errorMessage: t('Failed to drain node {{name}}.', { name: node.metadata.name }),
          cancelledMessage: t('Draining node {{name}} cancelled.', { name: node.metadata.name }),
          cancelCallback: () => {
            setisNodeDrainInProgress(false);
          },
        }
      )
    );
  }

  return (
    <PageGrid>
      <MainInfoSection
        error={nodeError}
        headerSection={item => (
          <ChartsSection node={item} metrics={nodeMetrics} noMetrics={noMetrics} />
        )}
        resource={node}
        actions={item => {
          const cordon = item?.jsonData?.spec?.unschedulable;
          const cordonOrUncordon = cordon ? t('Uncordon') : t('Cordon');

          return [
            {
              id: 'headlamp.node-togglecordon',
              action: (
                <AuthVisible item={item} authVerb="update">
                  <ActionButton
                    description={cordonOrUncordon}
                    icon={cordon ? 'mdi:check-circle-outline' : 'mdi:cancel'}
                    onClick={() => handleNodeScheduleState(item, cordon)}
                    iconButtonProps={{
                      disabled: isupdatingNodeScheduleProperty,
                    }}
                  />
                </AuthVisible>
              ),
            },
            {
              id: 'headlamp.node-togglecordon',
              action: (
                <AuthVisible item={item} authVerb="delete">
                  <ActionButton
                    description={t('Drain')}
                    icon="mdi:delete-variant"
                    onClick={() => handleNodeDrain(item)}
                    iconButtonProps={{
                      disabled: isNodeDrainInProgress,
                    }}
                  />
                </AuthVisible>
              ),
            },
          ];
        }}
        extraInfo={item =>
          item && [
            {
              name: t('translation|Ready'),
              value: <NodeReadyLabel node={item} />,
            },
            {
              name: t('translation|Conditions'),
              value: <NodeConditionsLabel node={item} />,
            },
            {
              name: t('Pod CIDR'),
              value: item.spec.podCIDR,
            },
            ...getAddresses(item),
          ]
        }
      />
      {!!node && (
        <>
          <SystemInfoSection node={node} />
          <OwnedPodsSection resource={node?.jsonData} />
          <DetailsViewSection resource={node} />
          {node && <ObjectEventList object={node} />}
        </>
      )}
    </PageGrid>
  );
}

interface ChartsSectionProps {
  node: Node | null;
  metrics: KubeMetrics[] | null;
  noMetrics?: boolean;
}

function ChartsSection(props: ChartsSectionProps) {
  const { node, metrics, noMetrics } = props;
  const { t } = useTranslation('glossary');

  function getUptime() {
    if (!node) {
      return '…';
    }

    const readyInfo = node.status.conditions.find(({ type }) => type === 'Ready');
    if (readyInfo) {
      return timeAgo(readyInfo.lastTransitionTime as string);
    }

    return t('translation|Not ready yet!');
  }

  return (
    <Box py={2}>
      <Grid
        container
        justifyContent="space-around"
        style={{
          marginBottom: '2rem',
        }}
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs>
          <HeaderLabel value={getUptime()} label={t('Uptime')} />
        </Grid>
        <Grid item xs>
          <CpuCircularChart items={node && [node]} itemsMetrics={metrics} noMetrics={noMetrics} />
        </Grid>
        <Grid item xs>
          <MemoryCircularChart
            items={node && [node]}
            itemsMetrics={metrics}
            noMetrics={noMetrics}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

interface SystemInfoSectionProps {
  node: Node;
}

function SystemInfoSection(props: SystemInfoSectionProps) {
  const { node } = props;
  const { t } = useTranslation('glossary');

  function getOSComponent(osName: string) {
    let icon = null;

    if (osName.toLowerCase() === 'linux') {
      icon = <InlineIcon icon="mdi:penguin" />;
    }

    return (
      <React.Fragment>
        {icon}
        <ValueLabel>{osName}</ValueLabel>
      </React.Fragment>
    );
  }

  if (!node) {
    return null;
  }

  return (
    <SectionBox title={t('System Info')}>
      <NameValueTable
        rows={[
          {
            name: t('Architecture'),
            value: node.status.nodeInfo.architecture,
          },
          {
            name: t('Boot ID'),
            value: node.status.nodeInfo.bootID,
          },
          {
            name: t('System UUID'),
            value: node.status.nodeInfo.systemUUID,
          },
          {
            name: t('OS'),
            value: getOSComponent(node.status.nodeInfo.operatingSystem),
          },
          {
            name: t('Image'),
            value: node.status.nodeInfo.osImage,
          },
          {
            name: t('Kernel Version'),
            value: node.status.nodeInfo.kernelVersion,
          },
          {
            name: t('Machine ID'),
            value: node.status.nodeInfo.machineID,
          },
          {
            name: t('Kube Proxy Version'),
            value: node.status.nodeInfo.kubeProxyVersion,
          },
          {
            name: t('Kubelet Version'),
            value: node.status.nodeInfo.kubeletVersion,
          },
          {
            name: t('Container Runtime Version'),
            value: node.status.nodeInfo.containerRuntimeVersion,
          },
        ]}
      />
    </SectionBox>
  );
}

interface NodeReadyLabelProps {
  node: Node;
}

export function NodeReadyLabel(props: NodeReadyLabelProps) {
  const { node } = props;
  const isReady = !!node.status.conditions.find(
    condition => condition.type === 'Ready' && condition.status === 'True'
  );
  const { t } = useTranslation();

  let status: StatusLabelProps['status'] = '';
  let label = null;
  if (isReady) {
    status = 'success';
    label = t('translation|Yes');
  } else {
    status = 'error';
    label = t('translation|No');
  }

  return <StatusLabel status={status}>{label}</StatusLabel>;
}
