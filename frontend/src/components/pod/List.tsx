import alertIcon from '@iconify/icons-mdi/alert-outline';
import Icon from '@iconify/react';
import { Box } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../lib/k8s/apiProxy';
import Pod from '../../lib/k8s/pod';
import { useFilterFunc } from '../../lib/util';
import { LightTooltip, SectionFilterHeader } from '../common';
import { StatusLabel, StatusLabelProps } from '../common/Label';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SimpleTable, { SimpleTableProps } from '../common/SimpleTable';

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
              <Icon icon={alertIcon} width="1.2rem" height="1.2rem" />
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
  const filterFunc = useFilterFunc();
  const { t } = useTranslation('glossary');

  function getRestartCount(pod: Pod) {
    if (!pod) {
      return 0;
    }
    return _.sumBy(pod.status.containerStatuses, container => container.restartCount);
  }

  function getDataCols() {
    const dataCols: SimpleTableProps['columns'] = [
      {
        label: t('frequent|Name'),
        getter: (pod: Pod) => <Link kubeObject={pod} />,
        sort: (p1: Pod, p2: Pod) => {
          if (p1.metadata.name < p2.metadata.name) {
            return -1;
          } else if (p1.metadata.name > p2.metadata.name) {
            return 1;
          }
          return 0;
        },
      },

      {
        label: t('Status'),
        getter: makePodStatusLabel,
        sort: (pod: Pod) => pod?.status.phase,
      },
      {
        label: t('frequent|Age'),
        getter: (pod: Pod) => pod.getAge(),
        sort: (p1: Pod, p2: Pod) =>
          new Date(p2.metadata.creationTimestamp).getTime() -
          new Date(p1.metadata.creationTimestamp).getTime(),
      },
    ];

    let insertIndex = 1;

    if (!hideColumns.includes('namespace')) {
      dataCols.splice(insertIndex++, 0, {
        label: t('glossary|Namespace'),
        getter: (pod: Pod) => pod.getNamespace(),
        sort: true,
      });
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
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={Pod.getErrorMessage(error)}
        columns={getDataCols()}
        data={pods}
        defaultSortingColumn={5}
      />
    </SectionBox>
  );
}

export default function PodList() {
  const [pods, error] = Pod.useList();

  return <PodListRenderer pods={pods} error={error} />;
}
