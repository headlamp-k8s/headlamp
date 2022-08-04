import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Workload } from '../../lib/k8s/cluster';
import CronJob from '../../lib/k8s/cronJob';
import DaemonSet from '../../lib/k8s/daemonSet';
import Deployment from '../../lib/k8s/deployment';
import Job from '../../lib/k8s/job';
import ReplicaSet from '../../lib/k8s/replicaSet';
import StatefulSet from '../../lib/k8s/statefulSet';
import { getReadyReplicas, getTotalReplicas, useFilterFunc } from '../../lib/util';
import { PageGrid, ResourceLink } from '../common/Resource';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import { WorkloadCircleChart } from './Charts';

interface WorkloadDict {
  [key: string]: Workload[];
}

export default function Overview() {
  const [workloadsData, dispatch] = React.useReducer(setWorkloads, {});
  const location = useLocation();
  const filterFunc = useFilterFunc(['.jsonData.kind']);
  const { t } = useTranslation('glossary');

  function setWorkloads(
    workloads: WorkloadDict,
    { items, kind }: { items: Workload[]; kind: string }
  ) {
    const data = { ...workloads };
    data[kind] = items;

    return data;
  }

  function getPods(item: Workload) {
    return `${getReadyReplicas(item)}/${getTotalReplicas(item)}`;
  }

  function sortByReplicas(w1: Workload, w2: Workload) {
    const totalReplicasDiff = getTotalReplicas(w1) - getTotalReplicas(w2);
    if (totalReplicasDiff === 0) {
      return getReadyReplicas(w1) - getReadyReplicas(w2);
    }

    return totalReplicasDiff;
  }

  function getJointItems() {
    let joint: Workload[] = [];
    for (const items of Object.values(workloadsData)) {
      joint = joint.concat(items);
    }
    return joint;
  }

  const workloads = [DaemonSet, Deployment, Job, CronJob, ReplicaSet, StatefulSet];
  workloads.forEach(workloadClass => {
    workloadClass.useApiList((items: InstanceType<typeof workloadClass>[]) =>
      dispatch({ items, kind: workloadClass.className })
    );
  });

  return (
    <PageGrid>
      <SectionBox py={2}>
        <Grid container justifyContent="space-around" alignItems="flex-start" spacing={1}>
          {workloads.map(({ className: name }) => (
            <Grid item lg={2} md={4} xs={6} key={name}>
              <WorkloadCircleChart
                workloadData={workloadsData[name] || []}
                // @todo: Use a plural from from the class itself when we have it
                title={name + 's'}
                partialLabel={t('frequent|Failed')}
                totalLabel={t('frequent|Running')}
              />
            </Grid>
          ))}
        </Grid>
      </SectionBox>
      <SectionBox title={<SectionFilterHeader title={t('Workloads')} />}>
        <ResourceTable
          filterFunction={filterFunc}
          columns={[
            'kind',
            {
              label: t('frequent|Name'),
              getter: item => (
                <ResourceLink resource={item} state={{ backLink: { ...location } }} />
              ),
              sort: (w1: Workload, w2: Workload) => {
                if (w1.metadata.name < w2.metadata.name) {
                  return -1;
                } else if (w1.metadata.name > w2.metadata.name) {
                  return 1;
                }
                return 0;
              },
            },
            'namespace',
            {
              label: t('Pods'),
              getter: item => item && getPods(item),
              sort: sortByReplicas,
            },
            'age',
          ]}
          data={getJointItems()}
        />
      </SectionBox>
    </PageGrid>
  );
}
