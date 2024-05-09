import cronstrue from 'cronstrue/i18n';
import { useTranslation } from 'react-i18next';
import CronJob from '../../lib/k8s/cronJob';
import { DateLabel, HoverInfoLabel, LightTooltip } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';

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
  return <DateLabel date={lastScheduleTime} format="mini" />;
}

export default function CronJobList() {
  const { t, i18n } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Cron Jobs')}
      resourceClass={CronJob}
      columns={[
        'name',
        'namespace',
        {
          id: 'schedule',
          label: t('Schedule'),
          getValue: cronJob => cronJob.spec.schedule,
          render: cronJob => getSchedule(cronJob, i18n.language),
        },
        {
          id: 'suspend',
          label: t('translation|Suspend'),
          getValue: cronJob => cronJob.spec.suspend.toString(),
          gridTemplate: 0.6,
        },
        {
          id: 'active',
          label: t('translation|Active'),
          getValue: cronJob => cronJob.status?.active?.length || 0,
          gridTemplate: 0.6,
        },
        {
          id: 'lastScheduleTime',
          label: t('Last Schedule'),
          getValue: cronJob => cronJob.status.lastScheduletime ?? '',
          render: cronJob => getLastScheduleTime(cronJob),
        },
        {
          id: 'containers',
          label: t('Containers'),
          getValue: deployment =>
            deployment
              .getContainers()
              .map(c => c.name)
              .join(', '),
          render: deployment => {
            const containers = deployment.getContainers().map(c => c.name);
            const containerText = containers.join(', ');
            const containerTooltip = containers.join('\n');
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
          getValue: deployment =>
            deployment
              .getContainers()
              .map(c => c.image)
              .join(', '),
          render: deployment => {
            const images = deployment.getContainers().map(c => c.image);
            const imageText = images.join(', ');
            const imageTooltip = images.join('\n');
            return (
              <LightTooltip title={imageTooltip} interactive>
                {imageText}
              </LightTooltip>
            );
          },
        },
        'age',
      ]}
    />
  );
}
