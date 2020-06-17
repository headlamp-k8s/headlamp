import Typography from '@material-ui/core/Typography';
import React from 'react';
import { KubeMetrics, KubeNode } from '../../lib/k8s/cluster';
import { getPercentStr, getResourceMetrics, getResourceStr } from '../../lib/util';
import { PercentageBar } from '../common/Chart';

interface UsageBarChartProps {
  node: KubeNode;
  nodeMetrics: KubeMetrics[] | null;
  resourceType: keyof (KubeMetrics['usage']);
}

export function UsageBarChart(props: UsageBarChartProps) {
  const { node, nodeMetrics, resourceType } = props;
  let [used, capacity] = [0, 0];

  if (node && nodeMetrics) {
    [used, capacity] = getResourceMetrics(node, nodeMetrics, resourceType);
  }

  const data = [
    {
      name: 'used',
      value: used,
    },
  ];

  function tooltipFunc() {
    return (
      <Typography>
        {getResourceStr(used, resourceType)} of {getResourceStr(capacity, resourceType)}{' '}
        ({getPercentStr(used, capacity)})
      </Typography>
    );
  }

  return (
    <PercentageBar
      data={data}
      total={capacity}
      tooltipFunc={tooltipFunc}
    />
  );
}
