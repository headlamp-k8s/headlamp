import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import { ResourceLink } from '../common/Resource';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

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
    const ready = (item.status.readyReplicas || item.status.numberReady || 0);
    const total = (item.spec.replicas || item.status.currentNumberScheduled || 0);
    return `${ready}/${total}`;
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

  return (
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
  );
}
