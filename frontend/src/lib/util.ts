import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { matchPath } from 'react-router';
import { FilterState } from '../redux/reducers/filter';
import { useTypedSelector } from '../redux/reducers/reducers';
import { KubeMetrics, KubeObjectInterface, KubeWorkload } from './k8s/cluster';
import Node from './k8s/node';
import { parseCpu, parseRam, unparseCpu, unparseRam } from './units';
TimeAgo.addLocale(en);

const TIME_AGO = new TimeAgo();

export const CLUSTER_ACTION_GRACE_PERIOD = 5000; // ms

type DateParam = string | number | Date;

export function timeAgo(date: DateParam) {
  return TIME_AGO.format(new Date(date), 'time');
}

export function localeDate(date: DateParam) {
  return new Date(date).toLocaleString();
}

export function getPercentStr(value: number, total: number) {
  if (total === 0) {
    return null;
  }
  const percentage = value / total * 100;
  const decimals = percentage % 10 > 0 ? 1 : 0;
  return `${percentage.toFixed(decimals)} %`;

}

export function getReadyReplicas(item: KubeWorkload) {
  return (item.status.readyReplicas || item.status.numberReady || 0);
}

export function getTotalReplicas(item: KubeWorkload) {
  return (item.spec.replicas || item.status.currentNumberScheduled || 0);
}

export function getResourceStr(value: number, resourceType: 'cpu' | 'memory') {
  const resourceFormatters: any = {
    cpu: unparseCpu,
    memory: unparseRam,
  };

  const valueInfo = resourceFormatters[resourceType](value);
  return `${valueInfo.value}${valueInfo.unit}`;
}

export function getResourceMetrics(item: Node, metrics: KubeMetrics[], resourceType: 'cpu' | 'memory') {
  const resourceParsers: any = {
    cpu: parseCpu,
    memory: parseRam,
  };

  const parser = resourceParsers[resourceType];
  const itemMetrics = metrics.find(itemMetrics => itemMetrics.metadata.name === item.getName());

  const used = parser(itemMetrics ? itemMetrics.usage[resourceType] : '0');
  const capacity = parser(item.status.capacity[resourceType]);

  return [used, capacity];
}

export function filterResource(item: KubeObjectInterface, filter: FilterState) {
  let matches: boolean = true;

  if (item.metadata.namespace && filter.namespaces.size > 0) {
    matches = filter.namespaces.has(item.metadata.namespace);
  }

  if (matches && filter.search) {
    const filterString = filter.search.toLowerCase();
    const matchCriteria = [
      item.metadata.namespace ? item.metadata.namespace.toLowerCase() : '',
      item.metadata.name.toLowerCase(),
      ...Object.keys(item.metadata.labels || {}).map(item => item.toLowerCase()),
      ...Object.values(item.metadata.labels || {}).map(item => item.toLowerCase()),
    ];

    matches = !!matchCriteria.find(item => item.includes(filterString));
  }

  return matches;
}

export function useFilterFunc() {
  const filter = useTypedSelector(state => state.filter);
  return (item: KubeObjectInterface) => filterResource(item, filter);
}

export function getClusterPrefixedPath(path?: string | null) {
  const baseClusterPath = '/c/:cluster';
  if (!path) {
    return baseClusterPath;
  }
  return baseClusterPath + (path[0] === '/' ? '' : '/') + path;
}

export function getCluster(): string | null {
  const clusterURLMatch =
    matchPath<{cluster?: string}>(window.location.pathname, {path: getClusterPrefixedPath()});
  return (!!clusterURLMatch && clusterURLMatch.params.cluster) || null;
}
