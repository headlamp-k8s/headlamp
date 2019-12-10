import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import { unparseCpu, unparseRam, parseCpu, parseRam } from './units';
TimeAgo.addLocale(en)

const TIME_AGO = new TimeAgo();

export function timeAgo(date) {
  return TIME_AGO.format(new Date(date), 'time');
}

export function localeDate(date) {
  return new Date(date).toLocaleString();
}

export function getPercentStr(value, total) {
  if (total === 0) {
    return null;
  }
  const percentage = value / total * 100;
  const decimals = percentage % 10 > 0 ? 1 : 0;
  return `${percentage.toFixed(decimals)} %`;

}

export function getResourceStr(value, resourceType) {
  const resourceFormatters = {
    cpu: unparseCpu,
    memory: unparseRam,
  };

  const valueInfo = resourceFormatters[resourceType](value);
  return `${valueInfo.value}${valueInfo.unit}`
}

export function getResourceMetrics(item, metrics, resourceType) {
  const type = resourceType.toLowerCase();
  const resourceParsers = {
    cpu: parseCpu,
    memory: parseRam,
  };

  const parser = resourceParsers[type];
  const itemMetrics = metrics.find(itemMetrics => itemMetrics.metadata.name == item.metadata.name);

  const used = parser(itemMetrics.usage[type]);
  const capacity = parser(item.status.capacity[type]);

  return [used, capacity];
}

export function filterResource(item, filter) {
  let matches = true;

  if (filter.namespaces.size > 0) {
    matches = filter.namespaces.has(item.metadata.namespace);
  }

  if (matches && filter.search) {
    const filterString = filter.search.toLowerCase();
    matches = item.metadata.namespace.toLowerCase().includes(filterString);
  }

  return matches;
}
