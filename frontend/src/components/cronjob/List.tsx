import React from 'react';
import CronJob from '../../lib/k8s/cronJob';
import { useFilterFunc } from '../../lib/util';
import { Link } from '../common';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function CronJobList() {
  const [cronJobs, error] = CronJob.useList();
  const filterFunc = useFilterFunc();

  function getSchedule(cronJob: CronJob) {
    const { schedule } = cronJob.spec;
    if (!schedule.startsWith('@')) {
      return 'never';
    }
    return schedule;
  }

  function getLastScheduleTime(cronJob: CronJob) {
    const { lastScheduleTime } = cronJob.status;
    if (!lastScheduleTime) {
      return 'N/A';
    }
    const oneDay = 24 * 60 * 60 * 1000;
    return `${new Date().getTime() - new Date(lastScheduleTime).getTime() / oneDay} days`;
  }

  return (
    <SectionBox title={<SectionFilterHeader title="Cron Jobs" />}>
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={CronJob.getErrorMessage(error)}
        columns={[
          {
            label: 'Name',
            getter: cronJob => <Link kubeObject={cronJob} />,
            sort: (c1: CronJob, c2: CronJob) => {
              if (c1.metadata.name < c2.metadata.name) {
                return -1;
              } else if (c1.metadata.name > c2.metadata.name) {
                return 1;
              }
              return 0;
            },
          },
          {
            label: 'Namespace',
            getter: cronJob => cronJob.getNamespace(),
          },
          {
            label: 'Schedule',
            getter: cronJob => getSchedule(cronJob),
          },
          {
            label: 'Suspend',
            getter: cronJob => cronJob.spec.schedule.toString(),
          },
          {
            label: 'Last Schedule',
            getter: cronJob => getLastScheduleTime(cronJob),
          },
          {
            label: 'Age',
            getter: cronJob => cronJob.getAge(),
            sort: (c1: CronJob, c2: CronJob) =>
              new Date(c2.metadata.creationTimestamp).getTime() -
              new Date(c1.metadata.creationTimestamp).getTime(),
          },
        ]}
        data={cronJobs}
        defaultSortingColumn={6}
      />
    </SectionBox>
  );
}
