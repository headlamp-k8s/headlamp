import { useTheme } from '@mui/material';
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Controls,
  Edge,
  EdgeMouseHandler,
  Node,
  NodeMouseHandler,
  OnMoveStart,
  ReactFlow,
} from '@xyflow/react';
import { KubeRelationEdge } from './edges/KubeRelationEdge';
import { GroupNodeComponent } from './nodes/GroupNode';
import { KubeGroupNodeComponent } from './nodes/KubeGroupNode';
import { KubeObjectNodeComponent } from './nodes/KubeObjectNode';

export const nodeTypes = {
  kubeObject: KubeObjectNodeComponent,
  kubeGroup: KubeGroupNodeComponent,
  group: GroupNodeComponent,
};

const edgeTypes = {
  kubeRelation: KubeRelationEdge,
};

export function GraphRenderer({
  nodes,
  edges,
  onNodeClick,
  onEdgeClick,
  onMoveStart,
  onBackgroundClick,
  children,
}: {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: NodeMouseHandler<Node>;
  onEdgeClick?: EdgeMouseHandler<Edge>;
  onMoveStart?: OnMoveStart;
  onBackgroundClick?: () => void;
  children?: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      onMove={onMoveStart}
      onClick={e => {
        if ((e.target as HTMLElement).className.includes('react-flow__pane')) {
          onBackgroundClick?.();
        }
      }}
      minZoom={0.1}
      maxZoom={1.2}
      connectionMode={ConnectionMode.Loose}
    >
      <Background variant={BackgroundVariant.Dots} style={{ color: theme.palette.divider }} />
      <Controls showInteractive={false} showFitView={false} />
      {children}
    </ReactFlow>
  );
}
