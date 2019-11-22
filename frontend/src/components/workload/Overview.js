import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { getReadyReplicas, getTotalReplicas, timeAgo } from '../../lib/util';
import { ResourceLink } from '../common/Resource';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';
import { WorkloadCircleChart } from './Charts';

export default function Overview() {
  const [workloadsData, dispatch] = React.useReducer(setWorkloads, {});

  function setWorkloads(workloads, newWorkloads) {
    const data = {...workloads};

    newWorkloads.forEach((item) => {
      if (!(item.kind in data)) {
        data[item.kind] = [];
      }
      data[item.kind].push(item);
    });

    return data;
  }

  function getPods(item) {
    return `${getReadyReplicas(item)}/${getTotalReplicas(item)}`;
  }

  function getJointItems() {
    let joint = [];
    for (const items of Object.values(workloadsData)) {
      joint = joint.concat(items);
    }
    return joint;
  }

  useConnectApi(
    api.cronJob.list.bind(null, null, dispatch),
    api.daemonSet.list.bind(null, null, dispatch),
    api.deployment.list.bind(null, null, dispatch),
    api.job.list.bind(null, null, dispatch),
    api.statefulSet.list.bind(null, null, dispatch),
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
      kind: 'Job',
      title: 'Jobs',
    },
  ];

  return (
    <React.Fragment>
      <Paper>
        <SectionHeader title="Overview" />
        <Box m={2} p={2}>
          <Grid
            container
            justify="space-around"
            alignItems="center"
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
        </Box>
      </Paper>
      <Paper>
        <SectionHeader title="Workloads" />
        <Box margin={1}>
          <SimpleTable
            rowsPerPage={[15, 25, 50]}
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
        </Box>
      </Paper>
    </React.Fragment>
  );
}
