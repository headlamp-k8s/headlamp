import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import { ResourceLink } from '../common/Resource';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function NodeList() {
  const [nodes, setNodes] = React.useState(null);

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
              getter: (node) =>
                <ResourceLink resource={node} />
            },
            {
              label: 'Ready',
              getter: (node) => node.status.phase
            },
            {
              label: 'CPU Requests',
              getter: (node) => null // @todo: TBD
            },
            {
              label: 'CPU Limits',
              getter: (node) => null // @todo: TBD
            },
            {
              label: 'Memory Requests',
              getter: (node) => null // @todo: TBD
            },
            {
              label: 'Memory Limits',
              getter: (node) => null // @todo: TBD
            },
            {
              label: 'Age',
              getter: (node) => timeAgo(node.metadata.creationTimestamp)
            },
          ]}
          data={nodes}
        />
      </Box>
    </Paper>
  );
}