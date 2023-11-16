import { Notification, setNotifications } from '../components/App/Notifications/notificationsSlice';
import store from '../redux/stores/store';

export function setNotificationsInStore(notifications: Notification[] | Notification) {
  store.dispatch(setNotifications(notifications));
}

// export { Notification };
