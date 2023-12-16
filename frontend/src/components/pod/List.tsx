import { Icon } from '@iconify/react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../lib/k8s/apiProxy';
import Pod from '../../lib/k8s/pod';
import { timeAgo } from '../../lib/util';
import { LightTooltip, Link, SimpleTableProps } from '../common';
import { StatusLabel, StatusLabelProps } from '../common/Label';
import ResourceListView from '../common/Resource/ResourceListView';
import { ResourceTableProps } from '../common/Resource/ResourceTable';

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
            <Box
              aria-label="hidden"
              display="inline"
              paddingTop={1}
              paddingLeft={0.5}
              style={{ verticalAlign: 'text-top' }}
            >
              <Icon icon="mdi:alert-outline" width="1.2rem" height="1.2rem" />
            </Box>
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
  error: ApiError | null;
  hideColumns?: ('namespace' | 'restarts')[];
  reflectTableInURL?: SimpleTableProps['reflectInURL'];
  noNamespaceFilter?: boolean;
}

export function PodListRenderer(props: PodListProps) {
  const { pods, error, hideColumns = [], reflectTableInURL = 'pods', noNamespaceFilter } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  function getDataCols() {
    const dataCols: ResourceTableProps['columns'] = [
      'name',
      {
        id: 'ready',
        label: t('translation|Ready'),
        getter: (pod: Pod) => {
          const podRow = pod.getDetailedStatus();
          return `${podRow.readyContainers}/${podRow.totalContainers}`;
        },
      },
      {
        id: 'status',
        label: t('translation|Status'),
        getter: makePodStatusLabel,
        sort: (pod: Pod) => {
          const podRow = pod.getDetailedStatus();
          return podRow.reason;
        },
      },
      {
        id: 'ip',
        label: t('glossary|IP'),
        getter: (pod: Pod) => pod.status.podIP,
        sort: true,
      },
      {
        id: 'node',
        label: t('glossary|Node'),
        getter: (pod: Pod) =>
          pod?.spec?.nodeName && (
            <Link routeName="node" params={{ name: pod.spec.nodeName }} tooltip>
              {pod.spec.nodeName}
            </Link>
          ),
        sort: (p1: Pod, p2: Pod) => {
          return p1?.spec?.nodeName?.localeCompare(p2?.spec?.nodeName || '') || 0;
        },
      },
      {
        id: 'nominatedNode',
        label: t('glossary|Nominated Node'),
        getter: (pod: Pod) =>
          !!pod?.status?.nominatedNodeName && (
            <Link routeName="node" params={{ name: pod?.status?.nominatedNodeName }} tooltip>
              {pod?.status?.nominatedNodeName}
            </Link>
          ),
        sort: (p1: Pod, p2: Pod) => {
          return (
            p1?.status?.nominatedNodeName?.localeCompare(p2?.status?.nominatedNodeName || '') || 0
          );
        },
        show: false,
      },
      {
        id: 'readinessGates',
        label: t('glossary|Readiness Gates'),
        getter: (pod: Pod) => {
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
    ];

    let insertIndex = 1;

    if (!hideColumns.includes('namespace')) {
      dataCols.splice(insertIndex++, 0, 'namespace');
    }

    if (!hideColumns.includes('restarts')) {
      dataCols.splice(insertIndex++, 0, {
        label: t('Restarts'),
        getter: (pod: Pod) => {
          const { restarts, lastRestartDate } = pod.getDetailedStatus();
          return lastRestartDate.getTime() !== 0
            ? t('{{ restarts }} ({{ abbrevTime }} ago)', {
                restarts: restarts,
                abbrevTime: timeAgo(lastRestartDate, { format: 'mini' }),
              })
            : restarts;
        },
        sort: true,
      });
    }

    return dataCols;
  }

  return (
    <ResourceListView
      title={t('Pods')}
      headerProps={{
        noNamespaceFilter,
      }}
      errorMessage={Pod.getErrorMessage(error)}
      columns={getDataCols()}
      data={pods}
      reflectInURL={reflectTableInURL}
      id="headlamp-pods"
    />
  );
}

export default function PodList() {
  const [pods, error] = Pod.useList();

  return <PodListRenderer pods={pods} error={error} reflectTableInURL />;
}
