import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { JSONPath } from 'jsonpath-plus';
import React from 'react';
import { matchPath } from 'react-router';
import helpers from '../helpers';
import { useTypedSelector } from '../redux/reducers/reducers';
import { ApiError } from './k8s/apiProxy';
import { KubeMetrics, KubeObjectInterface, Workload } from './k8s/cluster';
import Node from './k8s/node';
import { parseCpu, parseRam, unparseCpu, unparseRam } from './units';
TimeAgo.addLocale(en);

// @todo: these are exported to window.pluginLib.

const TIME_AGO = new TimeAgo();

export const CLUSTER_ACTION_GRACE_PERIOD = 5000; // ms

export type DateParam = string | number | Date;

export function timeAgo(date: DateParam) {
  return TIME_AGO.format(new Date(date), 'time');
}

export function localeDate(date: DateParam) {
  if (process.env.TEST_TZ) {
    return new Date(date).toLocaleString('en-US', { timeZone: 'UTC' });
  } else {
    return new Date(date).toLocaleString();
  }
}

export function getPercentStr(value: number, total: number) {
  if (total === 0) {
    return null;
  }
  const percentage = (value / total) * 100;
  const decimals = percentage % 10 > 0 ? 1 : 0;
  return `${percentage.toFixed(decimals)} %`;
}

export function getReadyReplicas(item: Workload) {
  return item.status.readyReplicas || item.status.numberReady || 0;
}

export function getTotalReplicas(item: Workload) {
  return item.spec.replicas || item.status.currentNumberScheduled || 0;
}

export function getResourceStr(value: number, resourceType: 'cpu' | 'memory') {
  const resourceFormatters: any = {
    cpu: unparseCpu,
    memory: unparseRam,
  };

  const valueInfo = resourceFormatters[resourceType](value);
  return `${valueInfo.value}${valueInfo.unit}`;
}

export function getResourceMetrics(
  item: Node,
  metrics: KubeMetrics[],
  resourceType: 'cpu' | 'memory'
) {
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

export interface FilterState {
  namespaces: Set<string>;
  search: string;
}

export function filterResource(
  item: KubeObjectInterface,
  filter: FilterState,
  matchCriteria?: string[]
) {
  let matches: boolean = true;

  if (item?.metadata?.namespace && filter.namespaces.size > 0) {
    matches = filter.namespaces.has(item?.metadata?.namespace);
  }

  if (matches && filter.search) {
    const filterString = filter.search.toLowerCase();
    const usedMatchCriteria = [
      item?.metadata?.uid?.toLowerCase(),
      item?.metadata?.namespace ? item.metadata.namespace.toLowerCase() : '',
      item?.metadata?.name?.toLowerCase(),
      ...Object.keys(item?.metadata?.labels || {}).map(item => item.toLowerCase()),
      ...Object.values(item?.metadata?.labels || {}).map(item => item.toLowerCase()),
    ];

    // Use the custom matchCriteria if any
    (matchCriteria || []).forEach(jsonPath => {
      let values: any[];
      try {
        values = JSONPath({ path: '$' + jsonPath, json: item });
      } catch (err) {
        console.debug(
          `Failed to get value from JSONPath when filtering ${jsonPath} on item ${item}; skipping criteria`
        );
        return;
      }

      // Include matches values in the criteria
      values.forEach((value: any) => {
        if (typeof value === 'string') {
          // Don't use empty string, otherwise it'll match everything
          if (value !== '') {
            usedMatchCriteria.push(value.toLowerCase());
          }
        } else if (Array.isArray(value)) {
          value.forEach((elem: any) => {
            if (!!elem && typeof elem === 'string') {
              usedMatchCriteria.push(elem.toLowerCase());
            }
          });
        }
      });
    });

    matches = !!usedMatchCriteria.find(item => item?.includes(filterString));
  }

  return matches;
}

export function useFilterFunc(matchCriteria?: string[]) {
  const filter = useTypedSelector(state => state.filter);
  return (item: KubeObjectInterface) => filterResource(item, filter, matchCriteria);
}

export function getClusterPrefixedPath(path?: string | null) {
  const baseClusterPath = '/c/:cluster';
  if (!path) {
    return baseClusterPath;
  }
  return baseClusterPath + (path[0] === '/' ? '' : '/') + path;
}

export function getCluster(): string | null {
  const prefix = helpers.getBaseUrl();
  const urlPath = helpers.isElectron()
    ? window.location.hash.substr(1)
    : window.location.pathname.slice(prefix.length);

  const clusterURLMatch = matchPath<{ cluster?: string }>(urlPath, {
    path: getClusterPrefixedPath(),
  });
  return (!!clusterURLMatch && clusterURLMatch.params.cluster) || null;
}

export function useErrorState(dependentSetter?: (...args: any) => void) {
  const [error, setError] = React.useState<ApiError | null>(null);

  React.useEffect(
    () => {
      if (!!error && !!dependentSetter) {
        dependentSetter(null);
      }
    },
    // eslint-disable-next-line
    [error]
  );

  // Adding "as any" here because it was getting difficult to validate the setter type.
  return [error, setError as any];
}

// Make units available from here
export * as auth from './auth';
export * as units from './units';
