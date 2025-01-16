import { Icon } from '@iconify/react';
import Pod from '../../lib/k8s/pod';
import { TestContext } from '../../test';
import { podList } from '../pod/storyHelper';
import { GraphNode, GraphSource } from './graph/graphModel';
import { GraphView } from './GraphView';

export default {
  title: 'GraphView',
  component: GraphView,
  argTypes: {},
  parameters: {},
};

const mockNodes: GraphNode[] = [
  {
    id: 'mock-id',
    kubeObject: new Pod(podList[0]),
  },
  {
    id: 'custom-node',
    label: 'Node Label',
    subtitle: 'Node Subtitle',
  },
  {
    id: 'custom-node-with-icon',
    label: 'Node with an icon',
    subtitle: 'Node Subtitle',
    icon: <Icon icon="mdi:plus-circle-outline" width="32px" />,
  },
  {
    id: 'custon-node-2',
    label: 'Node with children',
    nodes: [
      {
        id: 'some-id',
        label: 'Nested node 1',
      },
      {
        id: 'some-id-2',
        label: 'Nested node 2',
      },
    ],
    edges: [
      {
        id: 'some-edge-1',
        source: 'some-id',
        target: 'some-id-2',
      },
    ],
  },
];

const data = { nodes: mockNodes };

const mockSource: GraphSource = {
  id: 'mock-source',
  label: 'Pods',
  useData() {
    return data;
  },
};

export const BasicExample = () => (
  <TestContext>
    <GraphView height="600px" defaultSources={[mockSource]} />;
  </TestContext>
);
BasicExample.args = {};
