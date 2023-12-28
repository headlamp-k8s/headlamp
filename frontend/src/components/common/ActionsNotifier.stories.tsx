import { Meta, StoryFn } from '@storybook/react';
import { SnackbarProvider } from 'notistack';
import { MemoryRouter } from 'react-router-dom';
import { PureActionsNotifier, PureActionsNotifierProps } from './ActionsNotifier';

export default {
  title: 'ActionsNotifier',
  component: PureActionsNotifier,
  argTypes: {
    dispatch: { action: 'dispatch' },
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <SnackbarProvider>
          <Story />
        </SnackbarProvider>
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: StoryFn<PureActionsNotifierProps> = args => <PureActionsNotifier {...args} />;

export const Some = Template.bind({});
Some.args = {
  clusterActions: {
    '1': {
      id: '1',
      url: '/tmp',
      dismissSnackbar: '1',
      message: 'Some message',
      snackbarProps: {},
      buttons: [{ label: 'Meow', actionToDispatch: 'meow' }],
    },
  },
};

export const None = Template.bind({});
None.args = {
  clusterActions: {},
};
