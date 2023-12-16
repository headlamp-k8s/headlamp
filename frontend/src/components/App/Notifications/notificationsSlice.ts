import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { getCluster } from '../../../lib/cluster';

/**
 * The maximum number of notifications to store in localStorage.
 */
const defaultMaxNotificationsStored = 200;

interface NotificationOptions {
  /**
   * The message of the notification.
   */
  message?: string;
  /**
   * The date of the notification from the server (or where the notification was created).
   */
  date?: number | string | Date;
  /**
   * The cluster the notification is for.
   */
  cluster?: string | null;
}

/** @deprecated use ${NotificationOptions} instead */
type NotificationMessageString = string;
/** @deprecated use ${NotifictionOptions} instead */
type OldNotificationDateArg = number | string;

export interface NotificationIface {
  /**
   * The cluster the notification is for.
   */
  cluster: string | null;
  /**
   * The date the notification was created.
   */
  date: number | string;
  /**
   * True if the notification has been deleted.
   */
  deleted: boolean;
  /**
   * The id of the notification.
   */
  id: string;
  /**
   * The message of the notification.
   */
  message: string;
  /**
   * True if the notification has been seen by the user.
   */
  seen: boolean;
  /**
   * The url to redirect to when the notification is clicked.
   */
  url?: string;
}

export class Notification implements NotificationIface {
  cluster: string | null = getCluster();
  date: number | string = new Date().getTime();
  deleted: boolean = false;
  id: string;
  message: string = '';
  seen: boolean = false;
  url?: string;

  constructor(
    messageOrOptions?: NotificationOptions | NotificationMessageString,
    date?: OldNotificationDateArg
  ) {
    if (typeof messageOrOptions === 'string') {
      console.warn(
        `Notification constructor with a string arg is deprecated. Please use NotificationOptions as args instead`
      );
      if (messageOrOptions) {
        this.message = this.prepareMessage(messageOrOptions);
      }
      if (date) {
        this.date = date;
      }
    } else if (messageOrOptions) {
      const { message, date, cluster } = messageOrOptions;
      if (message) {
        this.message = this.prepareMessage(message);
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

  prepareMessage(message: string) {
    let trimmedMessage = message;
    if (message && message.length > 250) {
      // I am not sure if this applies well to all languages, but it should be good enough for now.
      trimmedMessage = message.slice(0, 249) + '…';
    }
    return trimmedMessage;
  }

  static fromJSON(json: any) {
    const notification = new Notification({
      message: json.message,
      date: json.date,
      cluster: json.cluster,
    });
    notification.id = json.id;
    notification.seen = json.seen;
    notification.url = json.url;
    notification.deleted = json.deleted;
    return notification;
  }

  // Avoid marshalling the entire object to JSON, as well as
  // private properties with the _ prefix.
  toJSON() {
    return {
      id: this.id,
      seen: this.seen,
      url: this.url,
      date: this.date,
      deleted: this.deleted,
      cluster: this.cluster,
      message: this.message,
    };
  }
}

interface NotificationStoreOptions {
  max?: number;
}

export interface NotificationsState {
  notifications: NotificationIface[];
}
export const initialState: NotificationsState = {
  notifications: loadNotifications(),
};

/**
 * Store the given notifications to localStorage.
 * @param notifications - The notifications to store.
 * @param options - Options for storing notifications.
 */
function storeNotifications(
  notifications: Notification[] | NotificationIface[],
  options: NotificationStoreOptions = {}
): NotificationIface[] {
  const { max = defaultMaxNotificationsStored } = options;

  const jsonNotifications = notifications
    .slice(0, max)
    .map(n => ('toJSON' in n ? (n as Notification).toJSON() : n));

  localStorage.setItem('notifications', JSON.stringify(jsonNotifications));
  return jsonNotifications;
}

/**
 * @returns An array of NotificationIface objects from localStorage.
 */
export function loadNotifications(): NotificationIface[] {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  return notifications.map((n: any) => Notification.fromJSON(n).toJSON());
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    /**
     * Set notifications. Overwrites current notifications with new notifications.
     */
    setNotifications(
      state,
      action: PayloadAction<Notification[] | NotificationIface[] | NotificationIface>
    ) {
      let notifications = Array.isArray(action.payload) ? action.payload : [action.payload];

      if (notifications.length === 0) {
        const newState: Notification[] = [];
        storeNotifications(newState);
        return {
          notifications: newState,
        };
      }

      notifications = _.uniqBy([...notifications, ...state.notifications], 'id');
      notifications.sort((n1, n2) => new Date(n2.date).getTime() - new Date(n1.date).getTime());

      return {
        notifications: storeNotifications(notifications),
      };
    },

    /**
     * Update existing notifications with new notifications data.
     */
    updateNotifications(state, action: PayloadAction<NotificationIface[] | NotificationIface>) {
      const dispatchedNotifications = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      const updatedState = state.notifications.map(notification => {
        const updatedNotification = dispatchedNotifications.find(n => n.id === notification.id);
        return updatedNotification
          ? Notification.fromJSON({ ...updatedNotification, seen: true })
          : notification;
      });

      const newNotifications = dispatchedNotifications.filter(
        n => !updatedState.some(s => s.id === n.id)
      );
      updatedState.push(...newNotifications);

      return {
        notifications: storeNotifications(updatedState),
      };
    },
  },
});

export { notificationsSlice, defaultMaxNotificationsStored, storeNotifications };
export const { setNotifications, updateNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
