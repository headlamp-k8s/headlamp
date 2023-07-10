import { useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Workload } from '../../lib/k8s/cluster';
import { getPercentStr, getReadyReplicas, getTotalReplicas } from '../../lib/util';
import { PercentageCircleProps } from '../common/Chart';
import TileChart from '../common/TileChart';

interface WorkloadCircleChartProps extends Omit<PercentageCircleProps, 'data'> {
  workloadData: Workload[];
  partialLabel: string;
  totalLabel: string;
}

export function WorkloadCircleChart(props: WorkloadCircleChartProps) {
  const theme = useTheme();
  const { t } = useTranslation('workload');

  const { workloadData, partialLabel = '', totalLabel = '', ...other } = props;

  const total = workloadData.length;
  const partial = workloadData.filter(
    item => getReadyReplicas(item) !== getTotalReplicas(item)
  ).length;

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
    return getPercentStr(total - partial, total);
  }

  function getLegend() {
    if (total === 0) {
      return t('workload|0 Running');
    }
    if (partial !== 0) {
      return `${partial} ${partialLabel} / ${total} ${totalLabel}`;
    }

    return `${total} ${totalLabel}`;
  }

  return (
    <TileChart
      data={makeData()}
      total={workloadData.length}
      totalProps={{
        fill: theme.palette.chartStyles.fillColor || theme.palette.common.black,
      }}
      label={getLabel()}
      legend={getLegend()}
      {...other}
    />
  );
}
