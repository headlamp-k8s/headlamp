import { configureStore } from '@reduxjs/toolkit';
import { Meta, Story } from '@storybook/react/types-6-0';
import { Provider } from 'react-redux';
import helpers from '../../helpers';
import VersionDialogComponent from './VersionDialog';

const store = configureStore({
  reducer: (state = { ui: { isVersionDialogOpen: false } }) => state,
  preloadedState: {
    ui: {
      isVersionDialogOpen: true,
    },
  },
});

export default {
  title: 'Version Dialog',
  component: VersionDialogComponent,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
} as Meta;

// Let's override this function so we don't have to change the snapshot at every version change.
helpers.getVersion = () => ({
  VERSION: '0.0.1',
  GIT_VERSION: 'abc123abc123abc123abc123abc123abc123abc123abc123abc123',
});

const Template: Story = () => {
  return <VersionDialogComponent />;
};

export const VersionDialog = Template.bind({});
