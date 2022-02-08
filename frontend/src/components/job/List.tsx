import { Icon } from '@iconify/react';
import { Box } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../lib/k8s/apiProxy';
import Job from '../../lib/k8s/job';
import { useFilterFunc } from '../../lib/util';
import { LightTooltip, Link, StatusLabel, StatusLabelProps } from '../common';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

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
      icon: 'mdi:pauseIcon',
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
  return <JobsListRenderer jobs={jobs} error={error} />;
}

export interface JobsListRendererProps {
  jobs?: Job[] | null;
  error?: ApiError | null;
}

export function JobsListRenderer(props: JobsListRendererProps) {
  const { jobs = null, error } = props;
  const { t } = useTranslation('glossary');
  const filterFunc = useFilterFunc();

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

  return (
    <SectionBox title={<SectionFilterHeader title={t('Jobs')} />}>
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={Job.getErrorMessage(error)}
        columns={[
          {
            label: t('frequent|Name'),
            getter: job => <Link kubeObject={job} />,
            sort: (j1: Job, j2: Job) => {
              if (j1.metadata.name < j2.metadata.name) {
                return -1;
              } else if (j1.metadata.name > j2.metadata.name) {
                return 1;
              }
              return 0;
            },
          },
          {
            label: t('glossary|Namespace'),
            getter: job => job.getNamespace(),
            sort: true,
          },
          {
            label: t('Completions'),
            getter: job => getCompletions(job),
            sort: sortByCompletions,
          },
          {
            label: t('Conditions'),
            getter: job => makePodStatusLabel(job),
          },
          {
            label: t('frequent|Age'),
            getter: job => job.getAge(),
            sort: (j1: Job, j2: Job) =>
              new Date(j2.metadata.creationTimestamp).getTime() -
              new Date(j1.metadata.creationTimestamp).getTime(),
          },
        ]}
        data={jobs}
        defaultSortingColumn={5}
      />
    </SectionBox>
  );
}
