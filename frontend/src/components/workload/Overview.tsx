import Grid from '@mui/material/Grid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { KubeObject, Workload } from '../../lib/k8s/cluster';
import CronJob from '../../lib/k8s/cronJob';
import DaemonSet from '../../lib/k8s/daemonSet';
import Deployment from '../../lib/k8s/deployment';
import Job from '../../lib/k8s/job';
import Pod from '../../lib/k8s/pod';
import ReplicaSet from '../../lib/k8s/replicaSet';
import StatefulSet from '../../lib/k8s/statefulSet';
import { getReadyReplicas, getTotalReplicas } from '../../lib/util';
import { Link } from '../common';
import { PageGrid, ResourceLink } from '../common/Resource';
import ResourceListView from '../common/Resource/ResourceListView';
import { SectionBox } from '../common/SectionBox';
import { WorkloadCircleChart } from './Charts';

interface WorkloadDict {
  [key: string]: Workload[];
}

export default function Overview() {
  const { items: pods } = Pod.useListQuery();
  const { items: deployments } = Deployment.useListQuery();
  const { items: statefulSets } = StatefulSet.useListQuery();
  const { items: daemonSets } = DaemonSet.useListQuery();
  const { items: replicaSets } = ReplicaSet.useListQuery();
  const { items: jobs } = Job.useListQuery();
  const { items: cronJobs } = CronJob.useListQuery();

  const workloadsData: WorkloadDict = {
    Pod: pods ?? [],
    Deployment: deployments ?? [],
    StatefulSet: statefulSets ?? [],
    DaemonSet: daemonSets ?? [],
    ReplicaSet: replicaSets ?? [],
    Job: jobs ?? [],
    CronJob: cronJobs ?? [],
  };

  const location = useLocation();
  const { t } = useTranslation('glossary');

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

  // All items except the pods since those shouldn't be shown in the table (only the chart).
  const jointItems = React.useMemo(() => {
    let joint: Workload[] = [];

    // Get all items except the pods since those shouldn't be shown in the table (only the chart).
    for (const [key, items] of Object.entries(workloadsData)) {
      if (key === 'Pod') {
        continue;
      }
      joint = joint.concat(items);
    }

    joint = joint.filter(Boolean);

    // Return null if no items are yet loaded, so we show the spinner in the table.
    if (joint.length === 0) {
      return null;
    }

    return joint;
  }, [workloadsData]);

  const workloads: KubeObject[] = [
    Pod,
    Deployment,
    StatefulSet,
    DaemonSet,
    ReplicaSet,
    Job,
    CronJob,
  ];

  function ChartLink(workload: KubeObject) {
    const linkName = workload.pluralName;
    return <Link routeName={linkName}>{linkName}</Link>;
  }

  return (
    <PageGrid>
      <SectionBox py={2} mt={1}>
        <Grid container justifyContent="flex-start" alignItems="flex-start" spacing={2}>
          {workloads.map(workload => (
            <Grid item lg={3} md={4} xs={6} key={workload.className}>
              <WorkloadCircleChart
                workloadData={workloadsData[workload.className] || null}
                // @todo: Use a plural from from the class itself when we have it
                title={ChartLink(workloads.find(w => w.className === name))}
                partialLabel={t('translation|Failed')}
                totalLabel={t('translation|Running')}
              />
            </Grid>
          ))}
        </Grid>
      </SectionBox>
      <ResourceListView
        title={t('Workloads')}
        columns={[
          'kind',
          {
            id: 'name',
            label: t('translation|Name'),
            getValue: item => item.metadata.name,
            render: item => (
              <ResourceLink resource={item as KubeObject} state={{ backLink: { ...location } }} />
            ),
          },
          'namespace',
          {
            id: 'pods',
            label: t('Pods'),
            getValue: item => item && getPods(item),
            sort: sortByReplicas,
          },
          'age',
        ]}
        data={jointItems}
        headerProps={{
          noNamespaceFilter: false,
        }}
        id="headlamp-workloads"
      />
    </PageGrid>
  );
}
