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
    type: 'kubeObject',
    data: {
      resource: new Pod(podList[0]),
    },
  },
];

const mockSource: GraphSource = {
  id: 'mock-source',
  label: 'Pods',
  useData() {
    return { nodes: mockNodes, edges: [] };
  },
};

export const BasicExample = () => (
  <TestContext>
    <GraphView height="600px" defaultSources={[mockSource]} />;
  </TestContext>
);
BasicExample.args = {};
