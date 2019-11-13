import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function Overview() {
  const [workloadsData, dispatch] = React.useReducer(setWorkloads, {});

  function setWorkloads(workloads, newWorkloads) {
    let data = {...workloads};

    newWorkloads.forEach((item) => {
      if (!(item.kind in data)) data[item.kind] = [];
      data[item.kind].push({
        kind: item.kind,
        name: item.metadata.name,
        namespace: item.metadata.namespace,
        pods: getPods(item),
        date: timeAgo(item.metadata.creationTimestamp),
      });
    });

    return data;
  }

  function getPods(item) {
    const ready = (item.status.readyReplicas || item.status.numberReady || 0);
    const total = (item.spec.replicas || item.status.currentNumberScheduled || 0);
    return `${ready}/${total}`;
  }

  function getJointItems() {
    let joint = [];
    for (let items of Object.values(workloadsData)) {
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

  return (
    <Paper>
      <SectionHeader title="Workloads" />
      <Box margin={1}>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          columns={[
            {
              label: 'Type',
              datum: 'kind'
            },
            {
              label: 'Name',
              datum: 'name'
            },
            {
              label: 'Namespace',
              datum: 'namespace',
            },
            {
              label: 'Pods',
              datum: 'pods',
            },
            {
              label: 'Age',
              datum: 'date',
            },
          ]}
          data={getJointItems()}
        />
      </Box>
    </Paper>
  );
}