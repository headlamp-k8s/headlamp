import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeMetrics, KubeObjectInterface } from '../../lib/k8s/cluster';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { ResourceLink } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';
import { UsageBarChart } from './Charts';
import { NodeReadyLabel } from './Details';

const useStyle = makeStyles({
  chartCell: {
    width: '20%',
  },
});

export default function NodeList() {
  const classes = useStyle();
  const [nodes, setNodes] = React.useState<KubeObjectInterface | null>(null);
  const [nodeMetrics, setNodeMetrics] = React.useState<KubeMetrics[] | null>(null);
  const filterFunc = useFilterFunc();

  useConnectApi(
    api.node.list.bind(null, setNodes),
    api.metrics.nodes.bind(null, setNodeMetrics)
  );

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Nodes"
          noNamespaceFilter
        />
      }
    >
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
  );
}
