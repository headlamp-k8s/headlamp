import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer, {
  defaultMaxNotificationsStored,
  Notification,
  setNotifications,
  storeNotifications,
  updateNotifications,
} from './notificationsSlice';

describe('notifications', () => {
  it('should limit message length', () => {
    const notification = new Notification({
      message: 'm'.repeat(251),
    });

    expect(notification.message.length).toBe(250);
  });

  it('should limit the number of notifications stored to defaultMaxNotificationsStored', () => {
    const oneMoreThanMax = defaultMaxNotificationsStored + 1;
    const notifications: Notification[] = [...Array(oneMoreThanMax)].map(
      (_, i) => new Notification({ message: `notification ${i}` })
    );

    storeNotifications(notifications);

    const notificationsFromStorage = JSON.parse(localStorage.getItem('notifications') || '[]');
    expect(notificationsFromStorage.length).toBe(defaultMaxNotificationsStored);
  });

  it('should add new notifications with deprecated message, date constructor', () => {
    const dateNum = 1234;
    const newNotification = new Notification('New message', dateNum);
    expect(newNotification.message).toEqual('New message');
    expect(newNotification.date).toEqual(dateNum);
    expect(newNotification.id).toBeDefined();
  });
});
describe('notificationsSlice', () => {
  let store = configureStore({
    reducer: {
      notifications: notificationsReducer,
    },
  });

  beforeEach(() => {
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    localStorage = mockLocalStorage as any;

    store = configureStore({
      reducer: {
        notifications: notificationsReducer,
      },
    });
  });

  describe('setNotifications', () => {
    it('should overwrite current notifications', () => {
      const initialNotifications = [
        new Notification({
          message: 'Initial message',
          cluster: 'minikube',
          date: new Date(),
        }).toJSON(),
      ];
      store.dispatch(setNotifications(initialNotifications));
      const addedNotifications = [new Notification({ message: 'New message' }).toJSON()];
      store.dispatch(setNotifications(addedNotifications));

      expect(store.getState().notifications.notifications).toContainEqual(
        expect.objectContaining({ message: 'New message' })
      );
    });

    it('should handle empty notifications array', () => {
      store.dispatch(setNotifications([]));
      expect(store.getState().notifications.notifications).toEqual([]);
    });

    it('should deduplicate notifications', () => {
      const duplicateNotification = new Notification({ message: 'Duplicate message' });
      const uniqueNotification = new Notification({ message: 'Unique message' });
      store.dispatch(
        setNotifications(
          [duplicateNotification, duplicateNotification, uniqueNotification].map(n => n.toJSON())
        )
      );

      expect(store.getState().notifications.notifications).toContainEqual(
        expect.objectContaining({ message: 'Unique message' })
      );
      expect(store.getState().notifications.notifications).toContainEqual(
        expect.objectContaining({ message: 'Duplicate message' })
      );
    });
  });

  describe('updateNotifications', () => {
    it('should update existing notifications', () => {
      const initialNotification = new Notification({ message: 'Initial message' });
      store.dispatch(setNotifications([initialNotification.toJSON()]));
      initialNotification.message = 'Updated message';
      store.dispatch(updateNotifications([initialNotification.toJSON()]));

      expect(store.getState().notifications.notifications[0]).toEqual(
        expect.objectContaining({ message: 'Updated message' })
      );
    });

    it('should add new notifications', () => {
      const initialNotification = new Notification({ message: 'Initial message' });
      store.dispatch(setNotifications([initialNotification.toJSON()]));
      const newNotification = new Notification({ message: 'New message' });
      store.dispatch(updateNotifications([newNotification.toJSON()]));

      expect(store.getState().notifications.notifications).toContainEqual(
        expect.objectContaining({ message: 'Initial message' })
      );
      expect(store.getState().notifications.notifications).toContainEqual(
        expect.objectContaining({ message: 'New message' })
      );
    });
  });
});
