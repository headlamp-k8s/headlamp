import { configureStore } from '@reduxjs/toolkit';
import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Cluster } from '../../lib/k8s/cluster';
import { initialState } from '../../redux/configSlice';
import { TestContext } from '../../test';
import ClusterChooserPopup from './ClusterChooserPopup';

const ourState = (clusters?: Cluster[]) => ({
  config: {
    ...initialState,
    clusters: clusters || [
      {
        name: 'cluster0',
      },
      {
        name: 'cluster1',
      },
      {
        name: 'cluster2',
      },
      {
        name: 'cluster3',
      },
      {
        name: 'cluster4',
      },
    ],
  },
  filter: {
    search: '',
  },
});

export default {
  title: 'cluster/ClusterChooserPopup',
  component: ClusterChooserPopup,
  decorators: [Story => <Story />],
} as Meta;

const Template: Story = args => {
  const { cluster, clusters, recentClusters = [] } = args;
  const ref = React.useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  localStorage.setItem('recent_clusters', '[]');
  for (const clusterName of recentClusters) {
    localStorage.setItem('recent_clusters', JSON.stringify([...recentClusters, clusterName]));
  }

  React.useEffect(() => {
    setAnchor(ref.current);
  }, [ref]);

  return (
    <TestContext
      store={configureStore({
        reducer: (state = ourState()) => state,
        preloadedState: ourState(clusters),
      })}
      routerMap={{ cluster: cluster }}
      urlPrefix="/c"
    >
      <span ref={ref} />
      <ClusterChooserPopup anchor={anchor} />
    </TestContext>
  );
};

// The subtitle for "Current" for the current cluster is missing because
// until we have a way to pretend we have that cluster set up.
export const Normal = Template.bind({});
Normal.args = {
  cluster: 'cluster2',
  // We place the current cluster in the middle so we verify that it's still put
  // at the top of the popover.
  recentClusters: ['cluster1', 'cluster2', 'cluster3'],
};

export const NoRecentClusters = Template.bind({});
NoRecentClusters.args = {
  cluster: 'cluster0',
  recentClusters: [],
};

export const NoClustersButRecent = Template.bind({});
NoClustersButRecent.args = {
  cluster: 'cluster0',
  recentClusters: ourState()
    .config.clusters.slice(0, 3)
    .map(c => c.name),
  clusters: ourState().config.clusters.slice(0, 3),
};

export const Scrollbar = Template.bind({});
Scrollbar.args = {
  cluster: 'cluster2',
  recentClusters: ['cluster2', 'cluster3', 'cluster4'],
  clusters: ourState(
    Array(20)
      .fill(0)
      .map((_, i) => ({ name: `cluster${i}`, auth_type: '' }))
  ).config.clusters,
};
