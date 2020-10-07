import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
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
  const [nodes, error] = Node.useList();
  const [nodeMetrics, metricsError] = Node.useMetrics();
  const filterFunc = useFilterFunc();

  const noMetrics = metricsError?.status === 404;

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
        errorMessage={Node.getErrorMessage(error)}
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
                noMetrics={noMetrics}
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
                noMetrics={noMetrics}
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
