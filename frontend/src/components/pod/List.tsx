import { Icon } from '@iconify/react';
import { Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../lib/k8s/apiProxy';
import Pod, { KubePod } from '../../lib/k8s/pod';
import { timeAgoByDate } from '../../lib/util';
import { LightTooltip, SectionFilterHeader } from '../common';
import { StatusLabel, StatusLabelProps } from '../common/Label';
import ResourceTable, { ResourceTableProps } from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';

export function makePodStatusLabel(pod: Pod) {
  const phase = pod.status.phase;
  let status: StatusLabelProps['status'] = '';
  let tooltip = '';

  const podRow = getPodTableInfo(pod.jsonData);
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
          {podRow.reason}
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

  function getDataCols() {
    const dataCols: ResourceTableProps['columns'] = [
      'name',
      {
        label: t('frequent|Ready'),
        getter: (pod: Pod) => {
          const podRow = getPodTableInfo(pod.jsonData);
          return `${podRow.readyContainers}/${podRow.totalContainers}`;
        },
      },
      {
        label: t('Status'),
        getter: makePodStatusLabel,
        sort: (pod: Pod) => {
          const podRow = getPodTableInfo(pod.jsonData);
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
          const podRow = getPodTableInfo(pod.jsonData);
          return podRow.restartsStr;
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
      />
    </SectionBox>
  );
}

export default function PodList() {
  const [pods, error] = Pod.useList();

  return <PodListRenderer pods={pods} error={error} />;
}

interface PodTableRow {
  restartsStr: string;
  reason: string;
  totalContainers: number;
  readyContainers: number;
  lastRestartDate: Date;
}

// Source Code: https://github.com/kubernetes/kubernetes/blob/33bf8a8ebd33eae0d45c18feb1c05baa6a055cde/pkg/printers/internalversion/printers.go#L558
function getPodTableInfo(pod: KubePod): PodTableRow {
  let restarts = 0;
  const totalContainers = (pod.spec.containers ?? []).length;
  let readyContainers = 0;
  let lastRestartDate = new Date(0);

  let reason = pod.status.phase;
  if (!!pod.status.reason) {
    reason = pod.status.reason;
  }

  let initializing = false;
  for (const i in pod.status.initContainerStatuses) {
    const container = pod.status.initContainerStatuses[i];
    restarts += container.restartCount;
    if (!!container.lastState.terminated) {
      const terminatedDate = new Date(container.lastState.terminated.finishedAt);
      if (lastRestartDate.getTime() < terminatedDate.getTime()) {
        lastRestartDate = terminatedDate;
      }
    }

    switch (true) {
      case !!container.state.terminated && container.state.terminated.exitCode === 0:
        continue;
      case !!container.state.terminated:
        if (!container.state.terminated.reason) {
          if (container.state.terminated.signal !== 0) {
            reason = `Init:Signal:${container.state.terminated.signal}`;
          } else {
            reason = `Init:ExitCode:${container.state.terminated.exitCode}`;
          }
        } else {
          reason = 'Init:' + container.state.terminated.reason;
        }
        initializing = true;
        break;
      case !!container.state.waiting &&
        !!container.state.waiting.reason &&
        container.state.waiting.reason !== 'PodInitializing':
        reason = 'Init:' + container.state.waiting.reason;
        initializing = true;
        break;
      default:
        reason = `Init:${i}/${(pod.spec.initContainers || []).length}`;
        initializing = true;
    }
    break;
  }

  if (!initializing) {
    restarts = 0;
    let hasRunning = false;
    for (let i = pod.status.containerStatuses.length - 1; i >= 0; i--) {
      const container = pod.status.containerStatuses[i];

      restarts += container.restartCount;
      if (!!container.lastState?.terminated) {
        const terminatedDate = new Date(container.lastState.terminated.finishedAt);
        if (lastRestartDate.getTime() < terminatedDate.getTime()) {
          lastRestartDate = terminatedDate;
        }
      }

      if (!!container.state.waiting && !!container.state.waiting.reason) {
        reason = container.state.waiting.reason;
      } else if (!!container.state.terminated && !!container.state.terminated.reason) {
        reason = container.state.terminated.reason;
      } else if (!!container.state.terminated && !container.state.terminated.reason) {
        if (container.state.terminated.signal !== 0) {
          reason = `Signal:${container.state.terminated.signal}`;
        } else {
          reason = `ExitCode:${container.state.terminated.exitCode}`;
        }
      } else if (container.ready && !!container.state.running) {
        hasRunning = true;
        readyContainers++;
      }
    }

    // change pod status back to "Running" if there is at least one container still reporting as "Running" status
    if (reason === 'Completed' && hasRunning) {
      if (hasPodReadyCondition(pod.status.conditions)) {
        alert('Running');
        reason = 'Running';
      } else {
        reason = 'NotReady';
      }
    }
  }

  // Instead of `pod.deletionTimestamp`. Important!
  const deletionTimestamp = pod.metadata.deletionTimestamp;

  if (!!deletionTimestamp && pod.status.reason === 'NodeLost') {
    reason = 'Unknown';
  } else if (!!deletionTimestamp) {
    reason = 'Terminating';
  }

  let restartsStr = `${restarts}`;
  if (lastRestartDate.getTime() !== 0) {
    restartsStr = `${restarts} (${timeAgoByDate(lastRestartDate)} ago)`;
  }

  return {
    restartsStr: restartsStr,
    totalContainers: totalContainers,
    readyContainers: readyContainers,
    reason: reason,
    lastRestartDate: lastRestartDate,
  };
}

function hasPodReadyCondition(conditions: any): boolean {
  for (const condition of conditions) {
    if (condition.type === 'Ready' && condition.Status === 'True') {
      return true;
    }
  }
  return false;
}
