import { configureStore } from '@reduxjs/toolkit';
import { Meta, Story } from '@storybook/react/types-6-0';
import { initialState as CONFIG_INITIAL_STATE } from '../../../redux/configSlice';
import { initialState as FILTER_INITIAL_STATE } from '../../../redux/filterSlice';
import { INITIAL_STATE as UI_INITIAL_STATE } from '../../../redux/reducers/ui';
import { TestContext } from '../../../test';
import NotificationList from './List';
import { loadNotifications, Notification, storeNotifications } from './notificationsSlice';

function createNotifications() {
  const notifications = [];
  for (let i = 0; i < 100; i++) {
    notifications.push(
      new Notification({
        message: `Notification ${i}`,
        date: '2022-08-01',
      })
    );

    if (i % 10 === 0) {
      notifications[i].cluster = 'cluster';
    }
  }

  storeNotifications(notifications);
}

createNotifications();

const store = configureStore({
  reducer: (
    state = {
      filter: { ...FILTER_INITIAL_STATE },
      config: { ...CONFIG_INITIAL_STATE },
      ui: { ...UI_INITIAL_STATE },
    }
  ) => state,
  preloadedState: {
    config: {
      ...CONFIG_INITIAL_STATE,
      // create a few mock data clusters...
      clusters: [
        {
          name: 'cluster',
          server: 'https://example.com/',
          certificateAuthorityData: 'data',
        },
        {
          name: 'cluster2',
          server: 'https://example.com/',
          certificateAuthorityData: 'data',
        },
      ],
    },
    filter: { ...FILTER_INITIAL_STATE },
    ui: {
      ...UI_INITIAL_STATE,
    },
    notifications: {
      notifications: loadNotifications(),
    },
  },
});

export default {
  title: 'Notifications',
  component: NotificationList,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext store={store}>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

const Template: Story = () => {
  return <NotificationList />;
};

export const List = Template.bind({});
