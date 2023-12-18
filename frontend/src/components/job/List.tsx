import { Icon } from '@iconify/react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { KubeContainer } from '../../lib/k8s/cluster';
import Job from '../../lib/k8s/job';
import { formatDuration } from '../../lib/util';
import { LightTooltip, SimpleTableProps, StatusLabel, StatusLabelProps } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';
import { ResourceTableProps } from '../common/Resource/ResourceTable';

export function makePodStatusLabel(job: Job) {
  if (!job?.status?.conditions) {
    return null;
  }

  const condition = job.status.conditions.find(
    ({ status }: { status: string }) => status === 'True'
  );

  const tooltip = '';

  const conditionOptions = {
    Failed: {
      status: 'error',
      icon: 'mdi:alert-outline',
    },
    Complete: {
      status: 'success',
      icon: 'mdi:check-bold',
    },
    Suspended: {
      status: '',
      icon: 'mdi:pause',
    },
  };

  const conditionInfo = conditionOptions[(condition.type as 'Complete' | 'Failed') || 'Suspended'];

  return (
    <LightTooltip title={tooltip} interactive>
      <Box display="inline">
        <StatusLabel status={conditionInfo.status as StatusLabelProps['status']}>
          {condition.type}
          <Box
            aria-label="hidden"
            display="inline"
            paddingTop={1}
            paddingLeft={0.5}
            style={{ verticalAlign: 'text-top' }}
          >
            <Icon icon={conditionInfo.icon} width="1.2rem" height="1.2rem" />
          </Box>
        </StatusLabel>
      </Box>
    </LightTooltip>
  );
}

export default function JobsList() {
  const [jobs, error] = Job.useList();
  return <JobsListRenderer jobs={jobs} error={Job.getErrorMessage(error)} reflectTableInURL />;
}

export interface JobsListRendererProps {
  jobs: Job[] | null;
  error: string | null;
  hideColumns?: 'namespace'[];
  reflectTableInURL?: SimpleTableProps['reflectInURL'];
  noNamespaceFilter?: boolean;
}

export function JobsListRenderer(props: JobsListRendererProps) {
  const { jobs, error, hideColumns = [], reflectTableInURL = 'jobs', noNamespaceFilter } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  function getCompletions(job: Job) {
    return `${job.spec.completions}/${job.spec.parallelism}`;
  }

  function sortByCompletions(job1: Job, job2: Job) {
    const parallelismSorted = job1.spec.parallelism - job2.spec.parallelism;
    if (parallelismSorted === 0) {
      return job1.spec.completions - job2.spec.completions;
    }
    return parallelismSorted;
  }

  function getDataCols() {
    const dataCols: ResourceTableProps['columns'] = [
      'name',
      {
        id: 'completions',
        label: t('Completions'),
        getter: job => getCompletions(job),
        sort: sortByCompletions,
      },
      {
        id: 'conditions',
        label: t('translation|Conditions'),
        getter: job => makePodStatusLabel(job),
      },
      {
        id: 'duration',
        label: t('translation|Duration'),
        getter: job => {
          const startTime = job.status?.startTime;
          const completionTime = job.status?.completionTime;
          if (!!startTime && !!completionTime) {
            const duration = new Date(completionTime).getTime() - new Date(startTime).getTime();
            return formatDuration(duration, { format: 'mini' });
          }
          return '-';
        },
        gridTemplate: 0.6,
        sort: true,
      },
      {
        id: 'containers',
        label: t('Containers'),
        getter: job => {
          const containerNames = job.getContainers().map((c: KubeContainer) => c.name);
          const containerTooltip = containerNames.join('\n');
          const containerText = containerNames.join(', ');
          return (
            <LightTooltip title={containerTooltip} interactive>
              {containerText}
            </LightTooltip>
          );
        },
      },
      {
        id: 'images',
        label: t('Images'),
        getter: job => {
          const containerImages = job.getContainers().map((c: KubeContainer) => c.image);
          const containerTooltip = containerImages.join('\n');
          const containerText = containerImages.join(', ');
          return (
            <LightTooltip title={containerTooltip} interactive>
              {containerText}
            </LightTooltip>
          );
        },
      },
      'age',
    ];

    let insertIndex = 1;

    if (!hideColumns.includes('namespace')) {
      dataCols.splice(insertIndex++, 0, 'namespace');
    }
    return dataCols;
  }

  return (
    <ResourceListView
      title={t('Jobs')}
      headerProps={{
        noNamespaceFilter,
      }}
      errorMessage={error}
      columns={getDataCols()}
      data={jobs}
      reflectInURL={reflectTableInURL}
      id="headlamp-jobs"
    />
  );
}
