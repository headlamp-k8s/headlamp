import _ from 'lodash';
import React from 'react';
import { parseRam, TO_GB } from '../../lib/units';
import { PercentageCircle } from '../common/Chart';

export function MemoryCircularChart(props) {
  const [usedMemory, totalMemory] = getMemoryUsage(props);

  function filterMetrics(items, metrics) {
    if (!items || !metrics)
      return [];

    const names = items.map(({metadata}) => metadata.name);
    return metrics.filter(item => names.includes(item.metadata.name));
  }

  function getLabel() {
    if (totalMemory === 0) {
      return '…';
    }
    return `${(usedMemory / totalMemory * 100).toFixed(1)} %`;
  }

  function getMemoryUsage() {
    let { nodes, nodesMetrics } = props;

    if (!nodes)
      return [0, 0];

    const nodeMetrics = filterMetrics(nodes, nodesMetrics);
    const usedMemory = _.sumBy(nodeMetrics, item => parseRam(item.usage.memory) / TO_GB);
    const totalMemory = _.sumBy(nodes, item => parseRam(item.status.capacity.memory) / TO_GB);

    return [usedMemory, totalMemory];
  }

  function makeData() {
    return [
      {
        name: 'used',
        value: usedMemory,
      }
    ];
  }

  function getLegend() {
    if (totalMemory === 0) {
      return null;
    }

    return `${usedMemory.toFixed(2)} / ${totalMemory.toFixed(2)} GB`;
  }

  return (
    <PercentageCircle
      title="Memory Usage"
      data={makeData()}
      total={totalMemory}
      label={getLabel()}
      legend={getLegend()}
    />
  );
}
