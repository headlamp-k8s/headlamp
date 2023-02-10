import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { apply } from '../../lib/k8s/apiProxy';
import { KubeObjectInterface } from '../../lib/k8s/cluster';
import CronJob from '../../lib/k8s/cronJob';
import Job from '../../lib/k8s/job';
import { clusterAction } from '../../redux/actions/actions';
import { ActionButton } from '../common';
import { MainInfoSection } from '../common/Resource';
import AuthVisible from '../common/Resource/AuthVisible';
import DetailsViewSection from '../DetailsViewSection';
import { JobsListRenderer } from '../job/List';
import { getLastScheduleTime, getSchedule } from './List';

export default function CronJobDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const { t, i18n } = useTranslation('glossary');

  const [jobs, jobsError] = Job.useList();
  const [cronJob, cronJobError] = CronJob.useGet(name, namespace);
  const [isCronSuspended, setIsCronSuspended] = useState(false);
  const [isCheckingCronSuspendStatus, setIsCheckingCronSuspendStatus] = useState(true);
  const dispatch = useDispatch();

  function applyFunc(newItem: KubeObjectInterface) {
    setIsCheckingCronSuspendStatus(true);
    return apply(newItem);
  }

  useEffect(() => {
    if (cronJob) {
      setIsCronSuspended(cronJob.spec.suspend);
      setIsCheckingCronSuspendStatus(false);
    }
  }, [cronJob]);

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

  function handleCron(suspend: boolean) {
    cronJob.spec.suspend = suspend;
    setIsCheckingCronSuspendStatus(true);
    dispatch(
      clusterAction(() => applyFunc(cronJob.jsonData), {
        startMessage: suspend
          ? t('resource|Suspending CronJob {{ newItemName }}…', {
              newItemName: cronJob.metadata.name,
            })
          : t('resource|Resuming CronJob {{ newItemName }}…', {
              newItemName: cronJob.metadata.name,
            }),
        cancelledMessage: suspend
          ? t('resource|Cancelled suspending CronJob {{ newItemName }}.', {
              newItemName: cronJob.metadata.name,
            })
          : t('resource|Cancelled resuming CronJob {{ newItemName }}.', {
              newItemName: cronJob.metadata.name,
            }),
        successMessage: suspend
          ? t('resource|Suspended CronJob {{ newItemName }}.', {
              newItemName: cronJob.metadata.name,
            })
          : t('resource|Resumed CronJob {{ newItemName }}.', {
              newItemName: cronJob.metadata.name,
            }),
        errorMessage: suspend
          ? t('resource|Failed to suspend CronJob {{ newItemName }}.', {
              newItemName: cronJob.metadata.name,
            })
          : t('resource|Failed to resume CronJob {{ newItemName }}.', {
              newItemName: cronJob.metadata.name,
            }),
      })
    );
  }

  const actions = [];

  actions.push(
    <AuthVisible authVerb="modify" item={cronJob}>
      <ActionButton
        description={isCronSuspended ? t('frequent|Resume') : t('frequent|Suspend')}
        onClick={() => {
          handleCron(!isCronSuspended);
        }}
        icon={isCronSuspended ? 'mdi:play-circle' : 'mdi:pause-circle'}
        iconButtonProps={{
          disabled: isCheckingCronSuspendStatus,
        }}
      />
    </AuthVisible>
  );

  return (
    <>
      <MainInfoSection
        resource={cronJob}
        actions={actions}
        error={CronJob.getErrorMessage(cronJobError)}
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
      />
      {cronJob && <JobsListRenderer jobs={ownedJobs} error={CronJob.getErrorMessage(jobsError)} />}
      <DetailsViewSection resource={cronJob} />
    </>
  );
}
