import { Meta, StoryObj } from '@storybook/react';
import { ClusterNameEditor } from './ClusterNameEditor';

const meta: Meta<typeof ClusterNameEditor> = {
  title: 'Settings/ClusterNameEditor',
  component: ClusterNameEditor,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ClusterNameEditor>;

export const Default: Story = {
  args: {
    cluster: 'my-cluster',
    newClusterName: '',
    isValidCurrentName: true,
    source: 'dynamic_cluster',
    onClusterNameChange: () => {},
    onUpdateClusterName: () => {},
  },
};

export const WithInvalidName: Story = {
  args: {
    ...Default.args,
    newClusterName: 'Invalid Cluster Name',
    isValidCurrentName: false,
  },
};

export const WithNewName: Story = {
  args: {
    ...Default.args,
    newClusterName: 'new-cluster-name',
  },
};
