import { setUINotifications } from '../redux/actions/actions';
import store from '../redux/stores/store';
import { getCluster } from './util';

interface NotificationOptions {
  message?: string;
  date?: number | string | Date;
  cluster?: string | null;
}

/** @deprecated use ${NotificationOptions} instead */
type NotificationMessageString = string;
/** @deprecated use ${NotifictionOptions} instead */
type OldNotificationDateArg = number | string;

export class Notification {
  message: string = '';
  id: string;
  seen: boolean = false;
  url?: string;
  date: number | string = new Date().getTime();
  deleted: boolean = false;
  cluster: string | null = getCluster();

  constructor(
    messageOrOptions?: NotificationOptions | NotificationMessageString,
    date?: OldNotificationDateArg
  ) {
    if (typeof messageOrOptions === 'string') {
      console.warn(
        `Notification constructor with a string arg is deprecated. Please use NotificationOptions as args instead`
      );
      if (messageOrOptions) {
        this.message = messageOrOptions;
      }
      if (date) {
        this.date = date;
      }
    } else if (messageOrOptions) {
      const { message, date, cluster } = messageOrOptions;
      if (message) {
        this.message = message;
      }
      if (date) {
        if (date instanceof Date) {
          this.date = date.getTime();
        } else {
          this.date = date;
        }
      }
      if (cluster) {
        this.cluster = cluster;
      }
    }
    // generate the id based on the message and the date attached to a notification
    this.id = btoa(unescape(encodeURIComponent(`${this.date},${this.message},${this.cluster}`)));
  }
}

export function setNotificationsInStore(notifications: Notification[] | Notification) {
  store.dispatch(setUINotifications(notifications));
}
