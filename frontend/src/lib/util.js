import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addLocale(en);

const TIME_AGO = new TimeAgo();

export function timeAgo(date) {
  return TIME_AGO.format(new Date(date), 'time');
}

export function getPercentStr(value, total) {
  if (total === 0) {
    return null;
  }
  const percentage = value / total * 100;
  const decimals = percentage % 10 > 0 ? 1 : 0;
  return `${percentage.toFixed(decimals)} %`;

}

export function getReadyReplicas(item) {
  return (item.status.readyReplicas || item.status.numberReady || 0);
}

export function getTotalReplicas(item) {
  return (item.spec.replicas || item.status.currentNumberScheduled || 0);
}
