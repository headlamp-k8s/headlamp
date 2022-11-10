import { Icon } from '@iconify/react';
import { Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../lib/k8s/apiProxy';
import Pod from '../../lib/k8s/pod';
import { timeAgo } from '../../lib/util';
import { LightTooltip, SectionFilterHeader, SimpleTableProps } from '../common';
import { StatusLabel, StatusLabelProps } from '../common/Label';
import ResourceTable, { ResourceTableProps } from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';

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

export interface PodListProps {
  pods: Pod[] | null;
  error: ApiError | null;
  hideColumns?: ('namespace' | 'restarts')[];
  reflectTableInURL?: SimpleTableProps['reflectInURL'];
}

export function PodListRenderer(props: PodListProps) {
  const { pods, error, hideColumns = [], reflectTableInURL = 'pods' } = props;
  const { t } = useTranslation('glossary');

  function getDataCols() {
    const dataCols: ResourceTableProps['columns'] = [
      'name',
      {
        label: t('frequent|Ready'),
        getter: (pod: Pod) => {
          const podRow = pod.getDetailedStatus();
          return `${podRow.readyContainers}/${podRow.totalContainers}`;
        },
      },
      {
        label: t('Status'),
        getter: makePodStatusLabel,
        sort: (pod: Pod) => {
          const podRow = pod.getDetailedStatus();
          return podRow.reason;
        },
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
    <SectionBox title={<SectionFilterHeader title={t('Pods')} />}>
      <ResourceTable
        errorMessage={Pod.getErrorMessage(error)}
        columns={getDataCols()}
        data={pods}
        reflectInURL={reflectTableInURL}
      />
    </SectionBox>
  );
}

export default function PodList() {
  const [pods, error] = Pod.useList();

  return <PodListRenderer pods={pods} error={error} reflectTableInURL />;
}
