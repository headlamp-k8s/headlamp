import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function NodeList() {
  const [nodesData, setNodesData] = React.useState([]);

  function setNodes(nodes) {
    const data = nodes.map(node => {
      return {
        name: node.metadata.name,
        status: node.status.phase,
        date: timeAgo(node.metadata.creationTimestamp),
        // @todo: Add CPU/RAM data
      };
    });
    setNodesData(data);
  }

  useConnectApi(
    api.node.list.bind(null, setNodes),
  );

  return (
    <Paper>
      <SectionHeader title="Nodes" />
      <Box margin={1}>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          columns={[
            {
              label: 'Name',
              datum: 'name'
            },
            {
              label: 'Ready',
              datum: 'ready',
            },
            {
              label: 'CPU Requests',
              datum: 'cpu_requests',
            },
            {
              label: 'CPU Limits',
              datum: 'cpu_limits',
            },
            {
              label: 'Memory Requests',
              datum: 'ram_requests',
            },
            {
              label: 'Memory Limits',
              datum: 'ram_limits',
            },
            {
              label: 'Age',
              datum: 'date',
            },
          ]}
          data={nodesData}
        />
      </Box>
    </Paper>
  );
}
