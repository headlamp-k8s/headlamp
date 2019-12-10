import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { ResourceLink } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';
import { UsageBarChart } from './Charts';
import { StatusLabel } from '../common/Label';
import { NodeReadyLabel } from './Details';

const useStyle = makeStyles(theme => ({
  chartCell: {
    width: '20%',
  },
}));

export default function NodeList() {
  const classes = useStyle();
  const [nodes, setNodes] = React.useState(null);
  const [nodeMetrics, setNodeMetrics] = React.useState(null);
  const filterFunc = useFilterFunc();

  useConnectApi(
    api.node.list.bind(null, setNodes),
    api.metrics.nodes.bind(null, setNodeMetrics)
  );

  return (
    <Paper>
      <SectionFilterHeader
        title="Nodes"
        noNamespaceFilter
      />
      <SectionBox>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          filterFunction={filterFunc}
          columns={[
            {
              label: 'Name',
              getter: (node) =>
                <ResourceLink resource={node} />
            },
            {
              label: 'Ready',
              getter: (node) => <NodeReadyLabel node={node} />
            },
            {
              label: 'CPU',
              cellProps: {
                className: classes.chartCell,
              },
              getter: (node) =>
                <UsageBarChart
                  node={node}
                  nodeMetrics={nodeMetrics}
                  resourceType="cpu"
                />
            },
            {
              label: 'Memory',
              cellProps: {
                className: classes.chartCell,
              },
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
