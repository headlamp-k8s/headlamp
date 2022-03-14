import { setUINotifications } from '../redux/actions/actions';
import store from '../redux/stores/store';

export class Notification {
  message: string = '';
  id: string;
  seen: boolean = false;
  url?: string;
  date: number | string = new Date().getTime();

  constructor(message?: string, date?: number | string) {
    if (message) {
      this.message = message;
    }
    if (date) {
      this.date = date;
    }
    // generate the id based on the message and the date attached to a notification
    this.id = btoa(`${this.date},${this.message}`);
  }
}

export function setNotificationsInStore(notifications: Notification[] | Notification) {
  store.dispatch(setUINotifications(notifications));
}
