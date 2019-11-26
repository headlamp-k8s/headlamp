import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import { ResourceLink } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';
import { UsageBarChart } from './Charts';

export default function NodeList() {
  const [nodes, setNodes] = React.useState(null);
  const [nodeMetrics, setNodeMetrics] = React.useState(null);

  useConnectApi(
    api.node.list.bind(null, setNodes),
    api.metrics.nodes.bind(null, setNodeMetrics)
  );

  return (
    <Paper>
      <SectionHeader title="Nodes" />
      <SectionBox>
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
              label: 'CPU',
              getter: (node) =>
                <UsageBarChart
                  node={node}
                  nodeMetrics={nodeMetrics}
                  resourceType="cpu"
                />
            },
            {
              label: 'Memory',
              getter: (node) =>
                <UsageBarChart
                  node={node}
                  nodeMetrics={nodeMetrics}
                  resourceType="memory"
                />
            },
            {
              label: 'Age',
              getter: (node) => timeAgo(node.metadata.creationTimestamp)
            },
          ]}
          data={nodes}
        />
      </SectionBox>
    </Paper>
  );
}
