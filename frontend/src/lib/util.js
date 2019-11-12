import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addLocale(en);

const TIME_AGO = new TimeAgo();

export function timeAgo(date) {
  return TIME_AGO.format(new Date(date), 'time');
}
