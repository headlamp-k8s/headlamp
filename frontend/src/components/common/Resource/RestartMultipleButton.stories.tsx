import { Meta, StoryFn } from '@storybook/react';
import { TestContext } from '../../../test';
import { RestartableResource } from './RestartButton';
import RestartMultipleButton from './RestartMultipleButton';

export default {
  title: 'Resource/RestartMultipleButton',
  component: RestartMultipleButton,

  decorators: [
    Story => (
      <TestContext>
        <Story />
      </TestContext>
    ),
  ],
} as Meta;

const Template: StoryFn<typeof RestartMultipleButton> = args => <RestartMultipleButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  items: [
    { metadata: { uid: '1', name: 'Resource 1', creationTimestamp: new Date().toISOString() } },
    { metadata: { uid: '2', name: 'Resource 2', creationTimestamp: new Date().toISOString() } },
  ] as RestartableResource[],
};

export const AfterConfirmCallback = Template.bind({});
AfterConfirmCallback.args = {
  items: [
    { metadata: { uid: '1', name: 'Resource 1', creationTimestamp: new Date().toISOString() } },
    { metadata: { uid: '2', name: 'Resource 2', creationTimestamp: new Date().toISOString() } },
  ] as RestartableResource[],
  afterConfirm: () => {
    console.log('afterConfirm callback executed!');
  },
};

export const MenuButtonStyle = Template.bind({});
MenuButtonStyle.args = {
  items: [
    { metadata: { uid: '1', name: 'Resource 1', creationTimestamp: new Date().toISOString() } },
    { metadata: { uid: '2', name: 'Resource 2', creationTimestamp: new Date().toISOString() } },
  ] as RestartableResource[],
  buttonStyle: 'menu',
};
