import cronstrue from 'cronstrue/i18n';
import { useTranslation } from 'react-i18next';
import CronJob from '../../lib/k8s/cronJob';
import { DateLabel, HoverInfoLabel } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export function getSchedule(cronJob: CronJob, locale: string) {
  const { schedule } = cronJob.spec;
  let described = '';
  if (!schedule.startsWith('@')) {
    try {
      described = cronstrue.toString(schedule, { locale });
    } catch (e) {
      console.debug(
        `Could not describe cron "${schedule}" for cronJob ${cronJob.metadata.namespace}/${cronJob.metadata.name}:`,
        e
      );
    }
  }
  return <HoverInfoLabel label={schedule} hoverInfo={described} />;
}

export function getLastScheduleTime(cronJob: CronJob) {
  const { lastScheduleTime } = cronJob.status;
  if (!lastScheduleTime) {
    return '';
  }
  return <DateLabel date={lastScheduleTime} />;
}

export default function CronJobList() {
  const { t, i18n } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Cron Jobs')} />}>
      <ResourceTable
        resourceClass={CronJob}
        columns={[
          'name',
          'namespace',
          {
            label: t('Schedule'),
            getter: cronJob => getSchedule(cronJob, i18n.language),
          },
          {
            label: t('Suspend'),
            getter: cronJob => cronJob.spec.suspend.toString(),
          },
          {
            label: t('Last Schedule'),
            getter: cronJob => getLastScheduleTime(cronJob),
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
