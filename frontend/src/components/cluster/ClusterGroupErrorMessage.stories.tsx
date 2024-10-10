import type { Meta, StoryObj } from '@storybook/react';
import {
  ClusterGroupErrorMessage,
  ClusterGroupErrorMessageProps,
} from './ClusterGroupErrorMessage';

const meta: Meta<typeof ClusterGroupErrorMessage> = {
  component: ClusterGroupErrorMessage,
};

export default meta;
type Story = StoryObj<ClusterGroupErrorMessageProps>;

export const WithClusterErrors: Story = {
  args: {
    clusterErrors: {
      cluster1: 'Error in cluster 1',
      cluster3: 'Error in cluster 3',
    },
  },
};

export const WithMessageUsed: Story = {
  args: {
    message: 'This message is used and not clusterErrors.',
    clusterErrors: {
      cluster1: 'Error in cluster 1',
      cluster3: 'Error in cluster 3',
    },
  },
};

export const WithDetailedClusterErrors: Story = {
  args: {
    clusterErrors: {
      cluster1: 'Error in cluster 1',
      cluster3: null,
    },
  },
};
