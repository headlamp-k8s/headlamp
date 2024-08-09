import { Card } from '@mui/material';
import { EventsDetails } from './EventsDetails';
import { GraphNode } from './GraphModel';
import { KubeNodeDetails } from './KubeNodeDetails';

interface GraphNodeDetailsSection {
  id: string;
  nodeType?: string;
  render: (node: GraphNode) => any;
}

const nodeDetailsSection: GraphNodeDetailsSection = {
  id: 'nodeDetails',
  render: node => <div>{node.id}</div>,
};

const kubeNodeDetailsSection: GraphNodeDetailsSection = {
  id: 'kubeObjectDetails',
  nodeType: 'kubeObject',
  render: node => <KubeNodeDetails node={node} />,
};

const kubeNodeEventsSection: GraphNodeDetailsSection = {
  id: 'kubeObjectEvents',
  nodeType: 'kubeObject',
  render: node => <EventsDetails resource={node.data.resource} />,
};

const defaultSections = [nodeDetailsSection, kubeNodeDetailsSection, kubeNodeEventsSection];

export function GraphNodeDetails({
  sections = defaultSections,
  node,
}: {
  sections?: GraphNodeDetailsSection[];
  node: GraphNode;
}) {
  return (
    <Card
      sx={{
        position: 'absolute',
        zIndex: 99999,
        right: 0,
        margin: '1rem',
        padding: '1rem',
        width: '600px',
      }}
    >
      {sections.filter(it => it.nodeType === node.type).map(it => it.render(node))}
    </Card>
  );
}
