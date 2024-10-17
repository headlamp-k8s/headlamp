import { ReactNode } from 'react';
import { KubeObject } from '../../../lib/k8s/cluster';

/**
 * Node representing one Kube resource
 */
export type KubeObjectNode = {
  id: string;
  type: 'kubeObject';
  data: {
    resource: KubeObject;
  };
};

/**
 * Group of only KubeObjects
 */
export type KubeGroupNode = {
  id: string;
  type: 'kubeGroup';
  data: {
    label?: string;
    nodes: KubeObjectNode[];
    edges: GraphEdge[];
    collapsed?: boolean;
  };
};

/**
 * Group of any kind of node
 */
export type GroupNode = {
  id: string;
  type: 'group';
  data: {
    label?: string;
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
};

export type GraphNode = KubeObjectNode | KubeGroupNode | GroupNode;

export function isGroup(node: GraphNode): node is KubeGroupNode | GroupNode {
  return node.type === 'group' || node.type === 'kubeGroup';
}

export function forEachNode(graph: GraphNode, cb: (item: GraphNode) => void) {
  cb(graph);
  if ('nodes' in graph.data) {
    graph.data.nodes.forEach(it => forEachNode(it, cb));
  }
}

export interface GraphEdge {
  type: string;
  id: string;
  source: string;
  target: string;
  label?: ReactNode;
  animated?: boolean;
  data?: any;
}

/**
 * Graph source is a way to add nodes and edges to the graph.
 */
export type GraphSource = {
  id: string;
  label: string;
  icon?: any;
  isEnabledByDefault?: boolean;
} & (
  | {
      sources: GraphSource[];
    }
  | {
      useData: () => { nodes?: GraphNode[]; edges?: GraphEdge[] } | null;
    }
);
