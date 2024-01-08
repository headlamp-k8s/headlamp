import { Meta, StoryFn } from '@storybook/react';
import { LogViewer, LogViewerProps } from './LogViewer';

export default {
  title: 'LogViewer',
  component: LogViewer,
  argTypes: {
    onClose: { action: 'closed' },
  },
} as Meta;

const Template: StoryFn<LogViewerProps> = args => <LogViewer {...args} />;

export const SomeLogs = Template.bind({});
SomeLogs.args = {
  logs: ['one log\n', 'two log\n', 'three log\n', 'four\n'],
  title: 'Some logs',
  downloadName: 'a-file-of-logs.txt',
  open: true,
};
