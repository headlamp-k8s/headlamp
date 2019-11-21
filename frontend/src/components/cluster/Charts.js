import _ from 'lodash';
import React from 'react';
import { parseCpu, parseRam, TO_GB, TO_ONE_CPU } from '../../lib/units';
import { PercentageCircle } from '../common/Chart';

export function ResourceCircularChart(props) {
  const {
    nodes,
    nodesMetrics,
    resourceUsedGetter,
    resourceAvailableGetter,
    ...others
  } = props;

  const [used, available] = getResourceUsage();

  function filterMetrics(items, metrics) {
    if (!items || !metrics)
      return [];

    const names = items.map(({metadata}) => metadata.name);
    return metrics.filter(item => names.includes(item.metadata.name));
  }

  function getLabel() {
    if (available === 0) {
      return '…';
    }
    return `${(used / available * 100).toFixed(1)} %`;
  }

  function getResourceUsage() {
    if (!nodes)
      return [-1, -1];

    const nodeMetrics = filterMetrics(nodes, nodesMetrics);
    const usedValue = _.sumBy(nodeMetrics, resourceUsedGetter);
    const availableValue = _.sumBy(nodes, resourceAvailableGetter);

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
      }
    ];
  }

  return (
    <PercentageCircle
      {...others}
      data={makeData()}
      total={available}
      label={getLabel()}
      legend={props.getLegend(used, available)}
    />
  );
}

export function MemoryCircularChart(props) {
  function memoryUsedGetter(item) {
    return parseRam(item.usage.memory) / TO_GB;
  }

  function memoryAvailableGetter(item) {
    return parseRam(item.status.capacity.memory) / TO_GB;
  }

  function getLegend(used, available) {
    if (available === 0) {
      return null;
    }

    return `${used.toFixed(2)} / ${available.toFixed(2)} GB`;
  }

  return (
    <ResourceCircularChart
      getLegend={getLegend}
      resourceUsedGetter={memoryUsedGetter}
      resourceAvailableGetter={memoryAvailableGetter}
      title="Memory usage"
      {...props}
    />
  );
}

export function CpuCircularChart(props) {
  function cpuUsedGetter(item) {
    return parseCpu(item.usage.cpu) / TO_ONE_CPU;
  }

  function cpuAvailableGetter(item) {
    return parseCpu(item.status.capacity.cpu) / TO_ONE_CPU;
  }

  function getLegend(used, available) {
    if (available === 0) {
      return null;
    }

    return `${used.toFixed(2)} / ${available} units`;
  }

  return (
    <ResourceCircularChart
      getLegend={getLegend}
      resourceUsedGetter={cpuUsedGetter}
      resourceAvailableGetter={cpuAvailableGetter}
      title="CPU usage"
      {...props}
    />
  );
}
