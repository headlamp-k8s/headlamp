import { Icon } from '@iconify/react';
import { Box } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../lib/k8s/apiProxy';
import Pod from '../../lib/k8s/pod';
import { LightTooltip, SectionFilterHeader } from '../common';
import { StatusLabel, StatusLabelProps } from '../common/Label';
import ResourceTable, { ResourceTableProps } from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';

export function makePodStatusLabel(pod: Pod) {
  const phase = pod.status.phase;
  let status: StatusLabelProps['status'] = '';
  let tooltip = '';

  if (phase === 'Failed') {
    status = 'error';
  } else if (phase === 'Succeeded' || phase === 'Running') {
    const readyCondition = pod.status.conditions.find(condition => condition.type === 'Ready');
    if (readyCondition?.status === 'True' || phase === 'Succeeded') {
      status = 'success';
    } else {
      status = 'warning';
      if (!!readyCondition?.reason) {
        tooltip = `${readyCondition.reason}: ${readyCondition.message}`;
      }
    }
  }

  return (
    <LightTooltip title={tooltip} interactive>
      <Box display="inline">
        <StatusLabel status={status}>
          {phase}
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
}

export function PodListRenderer(props: PodListProps) {
  const { pods, error, hideColumns = [] } = props;
  const { t } = useTranslation('glossary');

  function getRestartCount(pod: Pod) {
    if (!pod) {
      return 0;
    }
    return _.sumBy(pod.status.containerStatuses, container => container.restartCount);
  }

  function getDataCols() {
    const dataCols: ResourceTableProps['columns'] = [
      'name',
      {
        label: t('Status'),
        getter: makePodStatusLabel,
        sort: (pod: Pod) => pod?.status.phase,
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
        getter: (pod: Pod) => getRestartCount(pod),
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
      />
    </SectionBox>
  );
}

export default function PodList() {
  const [pods, error] = Pod.useList();

  return <PodListRenderer pods={pods} error={error} />;
}
