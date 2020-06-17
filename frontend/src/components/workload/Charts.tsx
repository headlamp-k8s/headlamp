import { useTheme } from '@material-ui/core/styles';
import React from 'react';
import { KubeWorkload } from '../../lib/k8s/cluster';
import { getPercentStr, getReadyReplicas, getTotalReplicas } from '../../lib/util';
import { PercentageCircle, PercentageCircleProps } from '../common/Chart';

interface WorkloadCircleChartProps extends Omit<PercentageCircleProps, 'data'> {
  workloadData: KubeWorkload[];
  partialLabel: string;
  totalLabel: string;
}

export function WorkloadCircleChart(props: WorkloadCircleChartProps) {
  const theme = useTheme();

  const {
    workloadData,
    partialLabel = '',
    totalLabel = '',
    ...other
  } = props;

  const total = workloadData.length;
  const partial = workloadData.filter(item =>
    getReadyReplicas(item) !== getTotalReplicas(item)).length;

  function makeData() {
    return [
      {
        name: 'failed',
        value: partial,
        fill: theme.palette.error.main,
      },
    ];
  }

  function getLabel() {
    return getPercentStr((total - partial), total);
  }

  function getLegend() {
    if (total === 0) {
      return null;
    }
    if (partial !== 0) {
      return `${partial} ${partialLabel} / ${total} ${totalLabel}`;
    }

    return `${total} ${totalLabel}`;
  }

  return (
    <PercentageCircle
      data={makeData()}
      total={workloadData.length}
      totalProps={{
        fill: theme.palette.primary.main
      }}
      label={getLabel()}
      legend={getLegend()}
      {...other}
    />
  );
}
