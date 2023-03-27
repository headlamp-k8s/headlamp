import { Icon, InlineIcon } from '@iconify/react';
import { IconButton, Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { apply } from '../../lib/k8s/apiProxy';
import { KubeMetrics } from '../../lib/k8s/cluster';
import Node from '../../lib/k8s/node';
import { timeAgo } from '../../lib/util';
import { clusterAction } from '../../redux/actions/actions';
import { CpuCircularChart, MemoryCircularChart } from '../cluster/Charts';
import { StatusLabelProps } from '../common';
import { HeaderLabel, StatusLabel, ValueLabel } from '../common/Label';
import { DetailsGrid, OwnedPodsSection } from '../common/Resource';
import AuthVisible from '../common/Resource/AuthVisible';
import { SectionBox } from '../common/SectionBox';
import { NameValueTable } from '../common/SimpleTable';
import DetailsViewSection from '../DetailsViewSection';

function NodeConditionsLabel(props: { node: Node }) {
  const { node } = props;
  const unschedulable = node?.jsonData?.spec?.unschedulable;
  const { t } = useTranslation();
  return unschedulable ? (
    <StatusLabel status="warning">{t('frequent|Scheduling Disabled')}</StatusLabel>
  ) : (
    <StatusLabel status="success">{t('frequent|Scheduling Enabled')}</StatusLabel>
  );
}

export default function NodeDetails() {
  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation('glossary');
  const dispatch = useDispatch();

  const [nodeMetrics, metricsError] = Node.useMetrics();

  const noMetrics = metricsError?.status === 404;

  function getAddresses(item: Node) {
    return item.status.addresses.map(({ type, address }) => {
      return {
        name: type,
        value: address,
      };
    });
  }

  function handleNodeScheduleState(node: Node, cordon: boolean) {
    const cloneNode = _.cloneDeep(node);

    cloneNode.spec.unschedulable = !cordon;
    dispatch(
      clusterAction(() => apply(cloneNode.jsonData), {
        startMessage: cordon
          ? t('Uncordoning node {{name}}...', {
              name: node.metadata.name,
            })
          : t('Cordoning node {{name}}…', { name: node.metadata.name }),
        successMessage: cordon
          ? t('Uncordoned node {{name}}.', { name: node.metadata.name })
          : t('Cordoned node {{name}}.', { name: node.metadata.name }),
        errorMessage: cordon
          ? t('Failed to uncordon node {{name}}.', { name: node.metadata.name })
          : t('Failed to cordon node {{name}}.', { name: node.metadata.name }),
      })
    );
  }

  return (
    <DetailsGrid
      headerSection={item => (
        <ChartsSection node={item} metrics={nodeMetrics} noMetrics={noMetrics} />
      )}
      resourceType={Node}
      name={name}
      withEvents
      actions={item => {
        const cordon = item?.jsonData?.spec?.unschedulable;
        const cordonOrUncordon = cordon ? t('Uncordon') : t('Cordon');
        return [
          <AuthVisible item={item} authVerb="update">
            <Tooltip title={cordonOrUncordon as string}>
              <IconButton
                aria-label={cordonOrUncordon}
                onClick={() => handleNodeScheduleState(item, cordon)}
              >
                {cordon ? <Icon icon="mdi:check-circle-outline" /> : <Icon icon="mdi:cancel" />}
              </IconButton>
            </Tooltip>
          </AuthVisible>,
        ];
      }}
      extraInfo={item =>
        item && [
          {
            name: t('frequent|Ready'),
            value: <NodeReadyLabel node={item} />,
          },
          {
            name: t('frequent|Conditions'),
            value: <NodeConditionsLabel node={item} />,
          },
          {
            name: t('Pod CIDR'),
            value: item.spec.podCIDR,
          },
          ...getAddresses(item),
        ]
      }
      sectionsFunc={item =>
        !!item && (
          <>
            <SystemInfoSection node={item} />
            <OwnedPodsSection resource={item?.jsonData} />
            <DetailsViewSection resource={item} />
          </>
        )
      }
    />
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

    return t('frequent|Not ready yet!');
  }

  return (
    <Box py={2}>
      <Grid
        container
        justifyContent="space-around"
        style={{
          marginBottom: '2rem',
        }}
      >
        <Grid item>
          <HeaderLabel value={getUptime()} label={t('Uptime')} />
        </Grid>
        <Grid item>
          <CpuCircularChart items={node && [node]} itemsMetrics={metrics} noMetrics={noMetrics} />
        </Grid>
        <Grid item>
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
    label = t('frequent|Yes');
  } else {
    status = 'error';
    label = t('frequent|No');
  }

  return <StatusLabel status={status}>{label}</StatusLabel>;
}
