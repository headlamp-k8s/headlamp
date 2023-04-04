import humanizeDuration from 'humanize-duration';
import { JSONPath } from 'jsonpath-plus';
import React from 'react';
import { matchPath, useHistory } from 'react-router';
import helpers from '../helpers';
import { useTypedSelector } from '../redux/reducers/reducers';
import store from '../redux/stores/store';
import { loadGroupSettings } from './clusterAroup';
import { ApiError } from './k8s/apiProxy';
import { KubeMetrics, KubeObjectInterface, Workload } from './k8s/cluster';
import { KubeEvent } from './k8s/event';
import Node from './k8s/node';
import { parseCpu, parseRam, unparseCpu, unparseRam } from './units';

// @todo: these are exported to window.pluginLib.

const humanize = humanizeDuration.humanizer();
humanize.languages['en-mini'] = {
  y: () => 'y',
  mo: () => 'mo',
  w: () => 'w',
  d: () => 'd',
  h: () => 'h',
  m: () => 'm',
  s: () => 's',
  ms: () => 'ms',
};

export const CLUSTER_ACTION_GRACE_PERIOD = 5000; // ms

export type DateParam = string | number | Date;

export type DateFormatOptions = 'brief' | 'mini';

export interface TimeAgoOptions {
  format?: DateFormatOptions;
}

/**
 * Show the time passed since the given date, in the desired format.
 *
 * @param date - The date since which to calculate the duration.
 * @param options - `format` takes "brief" or "mini". "brief" rounds the date and uses the largest suitable unit (e.g. "4 weeks"). "mini" uses something like "4w" (for 4 weeks).
 * @returns The formatted date.
 */
export function timeAgo(date: DateParam, options: TimeAgoOptions = {}) {
  const { format = 'brief' } = options;

  const fromDate = new Date(date);
  let now = new Date();

  if (process.env.UNDER_TEST === 'true') {
    // For testing, we consider the current moment to be 3 months from the dates we are testing.
    const days = 24 * 3600 * 1000; // in ms
    now = new Date(fromDate.getTime() + 90 * days);
  }

  if (format === 'brief') {
    return humanize(now.getTime() - fromDate.getTime(), {
      fallbacks: ['en'],
      round: true,
      largest: 1,
    });
  }

  return humanize(now.getTime() - fromDate.getTime(), {
    language: 'en-mini',
    spacer: '',
    fallbacks: ['en'],
    round: true,
    largest: 1,
  });
}

export function localeDate(date: DateParam) {
  const options: Intl.DateTimeFormatOptions = { timeZoneName: 'short' };
  let locale: string | undefined = undefined;

  // Force the same conditions under test, so snapshots are the same.
  if (process.env.UNDER_TEST === 'true') {
    options.timeZone = 'UTC';
    options.hour12 = true;
    locale = 'en-US';
    return new Date(date).toISOString();
  } else {
    options.timeZone = store.getState().config.settings.timezone;
  }

  return new Date(date).toLocaleString(locale, options);
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
  item: KubeObjectInterface | KubeEvent,
  filter: FilterState,
  matchCriteria?: string[]
) {
  let matches: boolean = true;

  if (item.metadata.namespace && filter.namespaces.size > 0) {
    matches = filter.namespaces.has(item.metadata.namespace);
  }

  if (matches && filter.search) {
    const filterString = filter.search.toLowerCase();
    const usedMatchCriteria = [
      item.metadata.uid.toLowerCase(),
      item.metadata.namespace ? item.metadata.namespace.toLowerCase() : '',
      item.metadata.name.toLowerCase(),
      ...Object.keys(item.metadata.labels || {}).map(item => item.toLowerCase()),
      ...Object.values(item.metadata.labels || {}).map(item => item.toLowerCase()),
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
        if (typeof value === 'string' || typeof value === 'number') {
          // Don't use empty string, otherwise it'll match everything
          if (value !== '') {
            usedMatchCriteria.push(value.toString().toLowerCase());
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

    matches = !!usedMatchCriteria.find(item => item.includes(filterString));
  }

  return matches;
}

export function useFilterFunc(matchCriteria?: string[]) {
  const filter = useTypedSelector(state => state.filter);
  return (item: KubeObjectInterface | KubeEvent) => filterResource(item, filter, matchCriteria);
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

export function getClusterGroup(returnWhenNoClusters: string[] = []): string[] {
  const clusterFromURL = getCluster();
  const clusterList = clusterFromURL?.split('+');
  if (!clusterList) {
    return returnWhenNoClusters;
  }

  // Verify if it's a named cluster group.
  if (clusterList.length === 1) {
    const groupInfo = loadGroupSettings(clusterList[0]);
    if (groupInfo) {
      return groupInfo.clusters;
    }
  }

  return clusterList;
}

export function getClusterGroupInfo(groupName = ''): { name: string; clusters: string[] } | null {
  const clusterName = groupName || getCluster();
  if (!clusterName) {
    return null;
  }

  // Check if this is an unnamed group
  if (clusterName.includes('+')) {
    return {
      name: '',
      clusters: clusterName.split('+'),
    };
  }

  return loadGroupSettings(clusterName);
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

/**
 * This function joins a list of items per cluster into a single list of items.
 *
 * @param args The list of objects per cluster to join.
 * @returns The joined list of items, or null if there are no items.
 */
export function flattenClusterListItems<T = any>(
  ...args: ({ [cluster: string]: T[] | null } | null)[]
): T[] | null {
  const flatItems: T[] = [];

  let hasItems = false;
  for (const clusterItems of Object.values(args)) {
    if (clusterItems === null) {
      continue;
    }
    for (const items of Object.values(clusterItems)) {
      if (items === null) {
        continue;
      }

      hasItems = true;
      flatItems.push(...items);
    }
  }

  if (!hasItems) {
    return null;
  }

  return flatItems;
}

/**
 * This function combines a list of errors per cluster.
 *
 * @param args The list of errors per cluster to join.
 * @returns The joint list of errors, or null if there are no errors.
 */
export function combineClusterListErrors(
  ...args: ({ [cluster: string]: ApiError | null } | null)[]
): { [cluster: string]: ApiError | null } | null {
  const errors: { [key: string]: ApiError | null } = {};
  let hasErrors = false;
  for (const clusterErrors of args) {
    if (clusterErrors === null) {
      continue;
    }
    hasErrors = true;
    for (const [cluster, error] of Object.entries(clusterErrors)) {
      if (error !== null) {
        errors[cluster] = error;
      }
    }
  }

  if (!hasErrors) {
    return null;
  }

  return errors;
}

type URLStateParams<T> = {
  /** The defaultValue for the URL state. */
  defaultValue: T;
  /** Whether to hide the parameter when the value is the default one (true by default). */
  hideDefault?: boolean;
  /** The prefix of the URL key to use for this state (a prefix 'my' with a key name 'key' will be used in the URL as 'my.key'). */
  prefix?: string;
};
export function useURLState(
  key: string,
  defaultValue: number
): [number, React.Dispatch<React.SetStateAction<number>>];
export function useURLState(
  key: string,
  valueOrParams: number | URLStateParams<number>
): [number, React.Dispatch<React.SetStateAction<number>>];
/**
 * A hook to manage a state variable that is also stored in the URL.
 *
 * @param key The name of the key in the URL. If empty, then the hook behaves like useState.
 * @param paramsOrDefault The default value of the state variable, or the params object.
 *
 */
export function useURLState<T extends string | number | undefined = string>(
  key: string,
  paramsOrDefault: T | URLStateParams<T>
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const params: URLStateParams<T> =
    typeof paramsOrDefault === 'object' ? paramsOrDefault : { defaultValue: paramsOrDefault };
  const { defaultValue, hideDefault = true, prefix = '' } = params;
  const history = useHistory();
  // Don't even use the prefix if the key is empty
  const fullKey = !key ? '' : !!prefix ? prefix + '.' + key : key;

  function getURLValue() {
    // An empty key means that we don't want to use the state from the URL.
    if (fullKey === '') {
      return null;
    }

    const urlParams = new URLSearchParams(history.location.search);
    const urlValue = urlParams.get(fullKey);
    if (urlValue === null) {
      return null;
    }
    let newValue: string | number = urlValue;
    if (typeof defaultValue === 'number') {
      newValue = Number(urlValue);
      if (Number.isNaN(newValue)) {
        return null;
      }
    }

    return newValue;
  }

  const initialValue = React.useMemo(() => {
    const newValue = getURLValue();
    if (newValue === null) {
      return defaultValue;
    }
    return newValue;
  }, []);
  const [value, setValue] = React.useState<T>(initialValue as T);

  React.useEffect(
    () => {
      const newValue = getURLValue();
      if (newValue === null) {
        if (defaultValue !== undefined && defaultValue !== value) {
          setValue(defaultValue);
        }
      } else if (newValue !== value) {
        setValue(newValue as T);
      }
    },
    // eslint-disable-next-line
    [history]
  );

  React.useEffect(() => {
    // An empty key means that we don't want to use the state from the URL.
    if (fullKey === '') {
      return;
    }

    const urlCurrentValue = getURLValue();

    if (urlCurrentValue === value) {
      return;
    }

    const urlParams = new URLSearchParams(history.location.search);
    let shouldUpdateURL = false;

    if ((value === null || value === defaultValue) && hideDefault) {
      if (urlParams.has(fullKey)) {
        urlParams.delete(fullKey);
        shouldUpdateURL = true;
      }
    } else if (value !== undefined) {
      const urlValue = value as NonNullable<T>;

      urlParams.set(fullKey, urlValue.toString());
      shouldUpdateURL = true;
    }

    if (shouldUpdateURL) {
      history.replace({ search: urlParams.toString() });
    }
  }, [value]);

  return [value, setValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}

// Make units available from here
export * as auth from './auth';
export * as units from './units';
