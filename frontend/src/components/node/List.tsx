import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeMetrics } from '../../lib/k8s/cluster';
import Node from '../../lib/k8s/node';
import { useFilterFunc } from '../../lib/util';
import { Link } from '../common';
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
  const [nodes, setNodes] = React.useState<Node[] | null>(null);
  const [nodeMetrics, setNodeMetrics] = React.useState<KubeMetrics[] | null>(null);
  const filterFunc = useFilterFunc();

  Node.useApiList(setNodes);

  useConnectApi(
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
            getter: (node) => <Link kubeObject={node} />
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
            getter: (node) => node.getAge()
          },
        ]}
        data={nodes}
      />
    </SectionBox>
  );
}
