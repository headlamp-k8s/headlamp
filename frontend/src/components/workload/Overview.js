import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { Controller } from '../../lib/cluster/workload';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { PageGrid, ResourceLink } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';
import { WorkloadCircleChart } from './Charts';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function Overview() {
  const [workloadsData, dispatch] = React.useReducer(setWorkloads, {});
  const filterFunc = useFilterFunc();

  function setWorkloads(workloads, {items, kind}) {
    let data = {...workloads};
    data[kind] = items;

    return data;
  }

  function getPods(item) {
    return `${Controller.getReadyReplicas(item)}/${Controller.getTotalReplicas(item)}`;
  }

  function getJointItems() {
    let joint = [];
    for (let items of Object.values(workloadsData)) {
      joint = joint.concat(items);
    }
    return joint;
  }

  useConnectApi(
    api.daemonSet.list.bind(null, null, (items) => dispatch({items, kind: 'DaemonSet'})),
    api.deployment.list.bind(null, null, (items) => dispatch({items, kind: 'Deployment'})),
    api.job.list.bind(null, null, (items) => dispatch({items, kind: 'Job'})),
    api.cronJob.list.bind(null, null, (items) => dispatch({items, kind: 'CronJob'})),
    api.replicaSet.list.bind(null, null, (items) => dispatch({items, kind: 'ReplicaSet'})),
    api.statefulSet.list.bind(null, null, (items) => dispatch({items, kind: 'StatefulSet'})),
  );

  // @todo: Abstract the kind, title/name, and API methods into classes,
  // then simplify this.
  const chartDefinitions = [
    {
      kind: 'Deployment',
      title: 'Deployments',
    },
    {
      kind: 'DaemonSet',
      title: 'DaemonSets',
    },
    {
      kind: 'StatefulSet',
      title: 'StatefulSets',
    },
    {
      kind: 'ReplicaSet',
      title: 'ReplicaSets',
    },
    {
      kind: 'Job',
      title: 'Jobs',
    },
    {
      kind: 'CronJob',
      title: 'CronJobs',
    },
  ];

  return (
    <PageGrid>
      <Paper>
        <SectionHeader title="Overview" />
        <SectionBox>
          <Grid
            container
            justify="space-around"
            alignItems="flex-start"
            spacing={1}
          >
            {chartDefinitions.map(({kind, title}) =>
              <Grid
                item
                lg={2}
                md={4}
                xs={6}
                key={kind}>
                <WorkloadCircleChart
                  workloadData={workloadsData[kind] || []}
                  title={title}
                  partialLabel="Failed"
                  totalLabel="Running"
                />
              </Grid>
            )}
          </Grid>
        </SectionBox>
      </Paper>
      <Paper>
        <SectionFilterHeader title="Workloads" />
        <SectionBox>
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
                  <ResourceLink resource={item} />
              },
              {
                label: 'Namespace',
                getter: (item) => item.metadata.namespace
              },
              {
                label: 'Pods',
                getter: (item) => getPods(item)
              },
              {
                label: 'Age',
                getter: (item) => timeAgo(item.metadata.creationTimestamp)
              },
            ]}
            data={getJointItems()}
          />
        </SectionBox>
      </Paper>
    </PageGrid>
  );
}
