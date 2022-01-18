import React from 'react';
import { useTranslation } from 'react-i18next';
import CronJob from '../../lib/k8s/cronJob';
import { useFilterFunc } from '../../lib/util';
import { Link } from '../common';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function CronJobList() {
  const [cronJobs, error] = CronJob.useList();
  const filterFunc = useFilterFunc();
  const { t } = useTranslation('glossary');

  function getLastScheduleTime(cronJob: CronJob) {
    const { lastScheduleTime } = cronJob.status;
    if (!lastScheduleTime) {
      return t('frequent|N/A');
    }
    const oneDay = 24 * 60 * 60 * 1000;
    return t('frequent|{{ age }} days', {
      age: new Date().getTime() - new Date(lastScheduleTime).getTime() / oneDay,
    });
  }

  return (
    <SectionBox title={<SectionFilterHeader title={t('Cron Jobs')} />}>
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={CronJob.getErrorMessage(error)}
        columns={[
          {
            label: t('frequent|Name'),
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
            label: t('glossary|Namespace'),
            getter: cronJob => cronJob.getNamespace(),
            sort: true,
          },
          {
            label: t('Schedule'),
            getter: cronJob => cronJob.spec.schedule,
          },
          {
            label: t('Suspend'),
            getter: cronJob => cronJob.spec.suspend,
          },
          {
            label: t('Last Schedule'),
            getter: cronJob => getLastScheduleTime(cronJob),
          },
          {
            label: t('frequent|Age'),
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
