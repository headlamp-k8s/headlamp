import '../../../i18n/config';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { KubeMetrics, KubeObject } from '../../../lib/k8s/cluster';
import { PercentageCircleProps } from '../Chart';
import TileChart from '../TileChart';

export interface CircularChartProps extends Omit<PercentageCircleProps, 'data'> {
  /** Items to display in the chart (should have a corresponding value in @param itemsMetrics) */
  items: KubeObject[] | null;
  /** Metrics to display in the chart (for items in @param items) */
  itemsMetrics: KubeMetrics[] | null;
  /** Whether no metrics are available. If true, then instead of a chart, a message will be displayed */
  noMetrics?: boolean;
  /** Function to get the "used" value for the metrics in question */
  resourceUsedGetter?: (node: KubeObject) => number;
  /** Function to get the "available" value for the metrics in question */
  resourceAvailableGetter?: (node: KubeObject) => number;
  /** Function to create a legend for the data */
  getLegend?: (used: number, available: number) => string;
  /** Tooltip to display when hovering over the chart */
  tooltip?: string | null;
}

export function CircularChart(props: CircularChartProps) {
  const {
    items,
    itemsMetrics,
    noMetrics = false,
    resourceUsedGetter,
    resourceAvailableGetter,
    title,
    getLegend,
    ...others
  } = props;
  const { t } = useTranslation();

  const [used, available] = getResourceUsage();

  function filterMetrics(items: KubeObject[], metrics: KubeMetrics[] | null) {
    if (!items || !metrics) return [];

    const names = items.map(({ metadata }) => metadata.name);
    return metrics.filter(item => names.includes(item.metadata.name));
  }

  function getLabel() {
    if (available === 0 || used === -1) {
      return '…';
    }
    return `${((used / available) * 100).toFixed(1)} %`;
  }

  function getResourceUsage() {
    if (!items) return [-1, -1];

    const nodeMetrics = filterMetrics(items, itemsMetrics);
    const usedValue = _.sumBy(nodeMetrics, resourceUsedGetter);
    const availableValue = _.sumBy(items, resourceAvailableGetter);

    return [usedValue, availableValue];
  }

  function makeData() {
    if (used === -1) {
      return [];
    }

    return [
      {
        name: 'used',
        value: used,
      },
    ];
  }

  return (
    <TileChart
      title={title}
      data={noMetrics ? null : makeData()}
      legend={!!getLegend ? getLegend(used, available) : ''}
      label={getLabel()}
      total={available}
      infoTooltip={
        noMetrics ? t('translation|Install the metrics-server to get usage data.') : null
      }
      {...others}
    />
  );
}

export default CircularChart;
