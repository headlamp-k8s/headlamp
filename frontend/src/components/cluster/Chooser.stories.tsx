import { configureStore } from '@reduxjs/toolkit';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Cluster } from '../../lib/k8s/cluster';
import { initialState } from '../../redux/configSlice';
import { TestContext } from '../../test';
import Chooser from './Chooser';

const ourState = (clusters?: Cluster[]) => ({
  config: {
    ...initialState,
    clusters: clusters || [
      {
        name: 'cluster1',
        auth_type: '',
      },
      {
        name: 'cluster2',
        auth_type: '',
      },
      {
        name: 'cluster3',
        auth_type: '',
      },
    ],
    allClusters:
      clusters === null
        ? null
        : clusters?.reduce((acc, cluster) => {
            acc[cluster.name] = cluster;
            return acc;
          }, {} as Record<string, Cluster>) || null,
  },
  filter: {
    search: '',
  },
  plugins: {
    loaded: true,
  },
  ui: {
    clusterChooserButtonComponent: null,
  },
  theme: {
    logo: null,
    name: 'light',
  },
});

export default {
  title: 'cluster/Chooser',
  component: Chooser,
  parameters: {
    docs: {
      description: {
        component:
          'A dialog component for choosing a cluster. Can be controlled via open/onClose props.',
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether the dialog is open',
    },
    onClose: {
      action: 'closed',
      description: 'Callback fired when the dialog requests to be closed',
    },
  },
} as Meta;

const Template: StoryFn = args => {
  const { clusters, ...otherProps } = args;

  // Clear recent clusters for clean state
  localStorage.setItem('recent_clusters', '[]');

  return (
    <TestContext
      store={configureStore({
        reducer: (state = ourState()) => state,
        preloadedState: ourState(clusters),
      })}
      urlPrefix="/c"
    >
      <Chooser {...otherProps} />
    </TestContext>
  );
};

export const Normal = Template.bind({});
Normal.args = {
  clusters: ourState().config.clusters,
  open: true,
};

export const SingleCluster = Template.bind({});
SingleCluster.args = {
  clusters: [
    {
      name: 'only-cluster',
      auth_type: '',
    },
  ],
  open: true,
};

export const ManyClusters = Template.bind({});
ManyClusters.args = {
  clusters: Array(10)
    .fill(0)
    .map((_, i) => ({
      name: `cluster-${i + 1}`,
      auth_type: '',
    })),
  open: true,
};

export const NoClusters = Template.bind({});
NoClusters.args = {
  clusters: [],
  open: true,
};

export const Closed = Template.bind({});
Closed.args = {
  clusters: ourState().config.clusters,
  open: false,
};
