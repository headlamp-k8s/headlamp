import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import CronJob from '../../lib/k8s/cronJob';
import Job from '../../lib/k8s/job';
import { DetailsGrid } from '../common/Resource';
import DetailsViewSection from '../DetailsViewSection';
import { JobsListRenderer } from '../job/List';
import { getLastScheduleTime, getSchedule } from './List';

export default function CronJobDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t, i18n } = useTranslation('glossary');

  const [jobs, jobsError] = Job.useList();

  function filterOwnedJobs(jobs?: Job[] | null) {
    if (!jobs) {
      return null;
    }

    return jobs.filter(job => {
      type OwnerRef = {
        name: string;
        kind: string;
      };
      return !!job.metadata?.ownerReferences?.find(
        (ownerRef: OwnerRef) => ownerRef.kind === 'CronJob' && ownerRef.name === name
      );
    });
  }

  const ownedJobs = filterOwnedJobs(jobs);

  return (
    <DetailsGrid
      resourceType={CronJob}
      name={name}
      namespace={namespace}
      extraInfo={item =>
        item && [
          {
            name: t('Schedule'),
            value: getSchedule(item, i18n.language),
          },
          {
            name: t('Suspend'),
            value: item.spec.suspend.toString(),
          },
          {
            name: t('Starting deadline'),
            value: `${item.spec.startingDeadlineSeconds}s`,
            hide: !item.spec.startingDeadlineSeconds,
          },
          {
            name: t('Last Schedule'),
            value: getLastScheduleTime(item),
          },
        ]
      }
      sectionsFunc={item => (
        <>
          {item && <JobsListRenderer jobs={ownedJobs} error={CronJob.getErrorMessage(jobsError)} />}
          <DetailsViewSection resource={item} />
        </>
      )}
    />
  );
}
