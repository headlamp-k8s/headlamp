import { Icon } from '@iconify/react';
import { Box } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../lib/k8s/apiProxy';
import Pod from '../../lib/k8s/pod';
import { METRIC_REFETCH_INTERVAL_MS, PodMetrics } from '../../lib/k8s/PodMetrics';
import { formatMetricValueUnit, parseCpu, parseRam } from '../../lib/units';
import { timeAgo } from '../../lib/util';
import { useNamespaces } from '../../redux/filterSlice';
import { HeadlampEventType, useEventCallback } from '../../redux/headlampEventSlice';
import { LightTooltip, Link, SimpleTableProps } from '../common';
import { StatusLabel, StatusLabelProps } from '../common/Label';
import ResourceListView from '../common/Resource/ResourceListView';

export function makePodStatusLabel(pod: Pod) {
  const phase = pod.status.phase;
  let status: StatusLabelProps['status'] = '';

  const { reason, message: tooltip } = pod.getDetailedStatus();

  if (phase === 'Failed') {
    status = 'error';
  } else if (phase === 'Succeeded' || phase === 'Running') {
    const readyCondition = pod.status.conditions.find(condition => condition.type === 'Ready');
    if (readyCondition?.status === 'True' || phase === 'Succeeded') {
      status = 'success';
    } else {
      status = 'warning';
    }
  }

  return (
    <LightTooltip title={tooltip} interactive>
      <Box display="inline">
        <StatusLabel status={status}>
          {reason}
          {(status === 'warning' || status === 'error') && (
            <Icon aria-label="hidden" icon="mdi:alert-outline" width="1.2rem" height="1.2rem" />
          )}
        </StatusLabel>
      </Box>
    </LightTooltip>
  );
}

function getReadinessGatesStatus(pods: Pod) {
  const readinessGates = pods?.spec?.readinessGates?.map(gate => gate.conditionType) || [];
  const readinessGatesMap: { [key: string]: string } = {};
  if (readinessGates.length === 0) {
    return readinessGatesMap;
  }

  pods?.status?.conditions?.forEach(condition => {
    if (readinessGates.includes(condition.type)) {
      readinessGatesMap[condition.type] = condition.status;
    }
  });

  return readinessGatesMap;
}

export interface PodListProps {
  pods: Pod[] | null;
  metrics: PodMetrics[] | null;
  hideColumns?: ('namespace' | 'restarts')[];
  reflectTableInURL?: SimpleTableProps['reflectInURL'];
  noNamespaceFilter?: boolean;
  errors?: ApiError[] | null;
}

export function PodListRenderer(props: PodListProps) {
  const {
    pods,
    metrics,
    hideColumns = [],
    reflectTableInURL = 'pods',
    noNamespaceFilter,
    errors,
  } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  const getCpuUsage = (pod: Pod) => {
    const metric = metrics?.find(it => it.getName() === pod.getName());
    if (!metric) return;

    return (
      metric?.jsonData.containers.map(it => parseCpu(it.usage.cpu)).reduce((a, b) => a + b, 0) ?? 0
    );
  };

  const getMemoryUsage = (pod: Pod) => {
    const metric = metrics?.find(it => it.getName() === pod.getName());
    if (!metric) return;

    return (
      metric?.jsonData.containers.map(it => parseRam(it.usage.memory)).reduce((a, b) => a + b, 0) ??
      0
    );
  };

  return (
    <ResourceListView
      title={t('Pods')}
      headerProps={{
        noNamespaceFilter,
      }}
      hideColumns={hideColumns}
      errors={errors}
      columns={[
        'name',
        'namespace',
        'cluster',
        {
          label: t('Restarts'),
          gridTemplate: 'min-content',
          getValue: pod => {
            const { restarts, lastRestartDate } = pod.getDetailedStatus();
            return lastRestartDate.getTime() !== 0
              ? t('{{ restarts }} ({{ abbrevTime }} ago)', {
                  restarts: restarts,
                  abbrevTime: timeAgo(lastRestartDate, { format: 'mini' }),
                })
              : restarts;
          },
        },
        {
          id: 'ready',
          gridTemplate: 'min-content',
          label: t('translation|Ready'),
          getValue: pod => {
            const podRow = pod.getDetailedStatus();
            return `${podRow.readyContainers}/${podRow.totalContainers}`;
          },
        },
        {
          id: 'status',
          gridTemplate: 'min-content',
          label: t('translation|Status'),
          getValue: pod => pod.getDetailedStatus().reason,
          render: makePodStatusLabel,
        },
        ...(metrics?.length
          ? [
              {
                id: 'cpu',
                label: t('CPU'),
                gridTemplate: 'min-content',
                render: (pod: Pod) => {
                  const cpu = getCpuUsage(pod);
                  if (cpu === undefined) return;

                  return formatMetricValueUnit(cpu, '', 'cpu', cpu < 1 ? 0 : 1);
                },
                getValue: (pod: Pod) => getCpuUsage(pod) ?? 0,
              },
              {
                id: 'memory',
                label: t('Memory'),
                gridTemplate: 'min-content',
                render: (pod: Pod) => {
                  const memory = getMemoryUsage(pod);
                  if (memory === undefined) return;

                  return formatMetricValueUnit(memory, '', 'binary', memory < 1e9 ? 0 : 1);
                },
                getValue: (pod: Pod) => getMemoryUsage(pod) ?? 0,
              },
            ]
          : []),
        {
          id: 'ip',
          gridTemplate: 'min-content',
          label: t('glossary|IP'),
          getValue: pod => pod.status?.podIP ?? '',
        },
        {
          id: 'node',
          label: t('glossary|Node'),
          gridTemplate: 'auto',
          getValue: pod => pod?.spec?.nodeName,
          render: pod =>
            pod?.spec?.nodeName && (
              <Link routeName="node" params={{ name: pod.spec.nodeName }} tooltip>
                {pod.spec.nodeName}
              </Link>
            ),
        },
        {
          id: 'nominatedNode',
          label: t('glossary|Nominated Node'),
          getValue: pod => pod?.status?.nominatedNodeName,
          render: pod =>
            !!pod?.status?.nominatedNodeName && (
              <Link routeName="node" params={{ name: pod?.status?.nominatedNodeName }} tooltip>
                {pod?.status?.nominatedNodeName}
              </Link>
            ),
          show: false,
        },
        {
          id: 'readinessGates',
          label: t('glossary|Readiness Gates'),
          getValue: pod => {
            const readinessGatesStatus = getReadinessGatesStatus(pod);
            const total = Object.keys(readinessGatesStatus).length;

            if (total === 0) {
              return '';
            }

            const statusTrueCount = Object.values(readinessGatesStatus).filter(
              status => status === 'True'
            ).length;

            return statusTrueCount;
          },
          render: pod => {
            const readinessGatesStatus = getReadinessGatesStatus(pod);
            const total = Object.keys(readinessGatesStatus).length;

            if (total === 0) {
              return null;
            }

            const statusTrueCount = Object.values(readinessGatesStatus).filter(
              status => status === 'True'
            ).length;

            return (
              <LightTooltip
                title={Object.keys(readinessGatesStatus)
                  .map(conditionType => `${conditionType}: ${readinessGatesStatus[conditionType]}`)
                  .join('\n')}
                interactive
              >
                <span>{`${statusTrueCount}/${total}`}</span>
              </LightTooltip>
            );
          },
          sort: (p1: Pod, p2: Pod) => {
            const readinessGatesStatus1 = getReadinessGatesStatus(p1);
            const readinessGatesStatus2 = getReadinessGatesStatus(p2);
            const total1 = Object.keys(readinessGatesStatus1).length;
            const total2 = Object.keys(readinessGatesStatus2).length;

            if (total1 !== total2) {
              return total1 - total2;
            }

            const statusTrueCount1 = Object.values(readinessGatesStatus1).filter(
              status => status === 'True'
            ).length;
            const statusTrueCount2 = Object.values(readinessGatesStatus2).filter(
              status => status === 'True'
            ).length;

            return statusTrueCount1 - statusTrueCount2;
          },
          show: false,
        },
        'age',
      ]}
      data={pods}
      reflectInURL={reflectTableInURL}
      id="headlamp-pods"
    />
  );
}

export default function PodList() {
  const { items, errors } = Pod.useList({ namespace: useNamespaces() });
  const { items: podMetrics } = PodMetrics.useList({
    namespace: useNamespaces(),
    refetchInterval: METRIC_REFETCH_INTERVAL_MS,
  });

  const dispatchHeadlampEvent = useEventCallback(HeadlampEventType.LIST_VIEW);

  React.useEffect(() => {
    dispatchHeadlampEvent({
      resources: items ?? [],
      resourceKind: 'Pod',
      error: errors?.[0] || undefined,
    });
  }, [items, errors]);

  return <PodListRenderer pods={items} errors={errors} metrics={podMetrics} reflectTableInURL />;
}
