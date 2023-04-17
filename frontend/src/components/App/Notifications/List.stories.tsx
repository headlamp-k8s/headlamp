import { configureStore } from '@reduxjs/toolkit';
import { Meta, Story } from '@storybook/react/types-6-0';
import helpers from '../../../helpers';
import { Notification } from '../../../lib/notification';
import { INITIAL_STATE as CONFIG_INITIAL_STATE } from '../../../redux/reducers/config';
import { INITIAL_STATE as FILTER_INITIAL_STATE } from '../../../redux/reducers/filter';
import { INITIAL_STATE as UI_INITIAL_STATE } from '../../../redux/reducers/ui';
import { TestContext } from '../../../test';
import NotificationList from './List';

function createNotifications() {
  const notifications = [];
  for (let i = 0; i < 100; i++) {
    notifications.push(
      new Notification({
        message: `Notification ${i}`,
        date: '2022-08-01',
      })
    );
  }

  helpers.storeNotifications(notifications);
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
    },
    filter: { ...FILTER_INITIAL_STATE },
    ui: {
      ...UI_INITIAL_STATE,
      notifications: helpers.loadNotifications(),
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
