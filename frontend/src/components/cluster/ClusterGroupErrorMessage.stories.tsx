import type { Meta, StoryObj } from '@storybook/react';
import { ApiError } from '../../lib/k8s/api/v2/ApiError';
import { TestContext } from '../../test';
import {
  ClusterGroupErrorMessage,
  ClusterGroupErrorMessageProps,
} from './ClusterGroupErrorMessage';

const meta: Meta<typeof ClusterGroupErrorMessage> = {
  component: ClusterGroupErrorMessage,
  decorators: [
    Story => (
      <TestContext>
        <Story />
      </TestContext>
    ),
  ],
};

export default meta;
type Story = StoryObj<ClusterGroupErrorMessageProps>;

export const WithClusterErrors: Story = {
  args: {
    errors: [
      new ApiError('Error in cluster 1', { cluster: 'cluster1' }),
      new ApiError('Error in cluster 3', { cluster: 'cluster3' }),
    ],
  },
};

export const WithMutipleErrorsPerCluster: Story = {
  args: {
    errors: [
      new ApiError('Error A in cluster 1', { cluster: 'cluster1' }),
      new ApiError('Error B in cluster 1', { cluster: 'cluster1' }),
    ],
  },
};
