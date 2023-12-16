import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Workload } from '../../lib/k8s/cluster';
import { getPercentStr, getReadyReplicas, getTotalReplicas } from '../../lib/util';
import { PercentageCircleProps } from '../common/Chart';
import TileChart from '../common/TileChart';

interface WorkloadCircleChartProps extends Omit<PercentageCircleProps, 'data'> {
  workloadData: Workload[] | null;
  partialLabel: string;
  totalLabel: string;
}

export function WorkloadCircleChart(props: WorkloadCircleChartProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const { workloadData, partialLabel = '', totalLabel = '', ...other } = props;

  const [total, partial] = useMemo(() => {
    // Total as -1 means it's loading.
    const total = !workloadData ? -1 : workloadData.length;
    const partial =
      workloadData?.filter(item => getReadyReplicas(item) !== getTotalReplicas(item)).length || 0;

    return [total, partial];
  }, [workloadData]);

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
    return total > 0 ? getPercentStr(total - partial, total) : '';
  }

  function getLegend() {
    if (total === -1) {
      return '…';
    }
    if (total === 0) {
      return t('translation|0 Running');
    }
    if (partial !== 0) {
      return `${partial} ${partialLabel} / ${total} ${totalLabel}`;
    }

    return `${total} ${totalLabel}`;
  }

  return (
    <TileChart
      data={makeData()}
      total={total}
      totalProps={{
        fill: theme.palette.chartStyles.fillColor || theme.palette.common.black,
      }}
      label={getLabel()}
      legend={getLegend()}
      {...other}
    />
  );
}
