import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import CommandDialog from './CommandDialog';

export default {
  title: 'Components/CommandDialog',
  component: CommandDialog,
  argTypes: {
    onClose: { action: 'onClose' },
    onConfirm: { action: 'onConfirm' },
  },
} as Meta<typeof CommandDialog>;

const Template: StoryFn<typeof CommandDialog> = args => <CommandDialog {...args} />;

export const Ask = Template.bind({});
Ask.args = {
  open: true,
  initialClusterName: 'test-cluster',
  command: 'start',
  title: 'Start Cluster',
  acting: false,
  running: false,
  commandDone: false,
  useGrid: false,
};

export const NotRunningYet = Template.bind({});
NotRunningYet.args = {
  open: true,
  initialClusterName: 'test-cluster',
  command: 'stop',
  title: 'Stop Cluster',
  acting: true,
  running: false,
  commandDone: false,
  useGrid: false,
};

export const RunningCommand = Template.bind({});
RunningCommand.args = {
  open: true,
  initialClusterName: 'test-cluster',
  command: 'stop',
  title: 'Stop Cluster',
  acting: true,
  running: true,
  actingLines: ['Stopping cluster...', 'Cluster stopped successfully'],
  commandDone: false,
  useGrid: false,
};

export const CommandCompleted = Template.bind({});
CommandCompleted.args = {
  open: true,
  initialClusterName: 'test-cluster',
  command: 'delete',
  title: 'Delete Cluster',
  actingLines: ['Deleting cluster...', 'Cluster deleted successfully'],
  acting: true,
  running: true,
  commandDone: true,
  useGrid: false,
};

export const GridAsk = Template.bind({});
GridAsk.args = {
  open: true,
  initialClusterName: '',
  command: 'start',
  title: 'Start Cluster',
  acting: false,
  running: false,
  commandDone: false,
  useGrid: true,
  askClusterName: true,
};

export const GridNotRunningYet = Template.bind({});
GridNotRunningYet.args = {
  open: true,
  initialClusterName: 'test-cluster',
  command: 'stop',
  title: 'Stop Cluster',
  acting: true,
  running: false,
  commandDone: false,
  useGrid: true,
};

export const GridRunningCommand = Template.bind({});
GridRunningCommand.args = {
  open: true,
  initialClusterName: 'test-cluster',
  command: 'stop',
  title: 'Stop Cluster',
  acting: true,
  running: true,
  actingLines: ['Stopping cluster...', 'Cluster stopped successfully'],
  commandDone: false,
  useGrid: true,
};

export const GridCommandCompleted = Template.bind({});
GridCommandCompleted.args = {
  open: true,
  initialClusterName: 'test-cluster',
  command: 'delete',
  title: 'Delete Cluster',
  actingLines: ['Deleting cluster...', 'Cluster deleted successfully'],
  acting: true,
  running: true,
  commandDone: true,
  useGrid: true,
};
