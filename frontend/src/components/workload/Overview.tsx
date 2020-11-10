import Grid from '@material-ui/core/Grid';
import React from 'react';
import { Workload } from '../../lib/k8s/cluster';
import CronJob from '../../lib/k8s/cronJob';
import DaemonSet from '../../lib/k8s/daemonSet';
import Deployment from '../../lib/k8s/deployment';
import Job from '../../lib/k8s/job';
import ReplicaSet from '../../lib/k8s/replicaSet';
import StatefulSet from '../../lib/k8s/statefulSet';
import { getReadyReplicas, getTotalReplicas, timeAgo, useFilterFunc } from '../../lib/util';
import { PageGrid, ResourceLink } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';
import { WorkloadCircleChart } from './Charts';

interface WorkloadDict {
  [key: string]: Workload[];
}

export default function Overview() {
  const [workloadsData, dispatch] = React.useReducer(setWorkloads, {});
  const filterFunc = useFilterFunc();

  function setWorkloads(workloads: WorkloadDict,
                        {items, kind}: {items: Workload[]; kind: string}) {
    const data = {...workloads};
    data[kind] = items;

    return data;
  }

  function getPods(item: Workload) {
    return `${getReadyReplicas(item)}/${getTotalReplicas(item)}`;
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
    workloadClass.useApiList((items: InstanceType<(typeof workloadClass)>[]) =>
      dispatch({items, kind: workloadClass.className})
    );
  });

  return (
    <PageGrid>
      <SectionBox py={2}>
        <Grid
          container
          justify="space-around"
          alignItems="flex-start"
          spacing={1}
        >
          {workloads.map(({className: name}) =>
            <Grid
              item
              lg={2}
              md={4}
              xs={6}
              key={name}
            >
              <WorkloadCircleChart
                workloadData={workloadsData[name] || []}
                // @todo: Use a plural from from the class itself when we have it
                title={name + 's'}
                partialLabel="Failed"
                totalLabel="Running"
              />
            </Grid>
          )}
        </Grid>
      </SectionBox>
      <SectionBox
        title={<SectionFilterHeader title="Workloads" />}
      >
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          filterFunction={filterFunc}
          columns={[
            {
              label: 'Type',
              getter: (item) => item.kind
            },
            {
              label: 'Name',
              getter: (item) =>
                <ResourceLink resource={item} />,
              sort: (w1: Workload, w2: Workload) => {
                if (w1.metadata.name < w2.metadata.name) {
                  return -1;
                } else if (w1.metadata.name > w2.metadata.name) {
                  return 1;
                }
                return 0;
              }
            },
            {
              label: 'Namespace',
              getter: (item) => item.metadata.namespace
            },
            {
              label: 'Pods',
              getter: (item) => item && getPods(item)
            },
            {
              label: 'Age',
              getter: (item) => timeAgo(item.metadata.creationTimestamp),
              sort: (w1: Workload, w2: Workload) =>
                new Date(w2.metadata.creationTimestamp).getTime() -
                new Date(w1.metadata.creationTimestamp).getTime()
            },
          ]}
          data={getJointItems()}
          defaultSortingColumn={5}
        />
      </SectionBox>
    </PageGrid>
  );
}
