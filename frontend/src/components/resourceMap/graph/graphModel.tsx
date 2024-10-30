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

export const isGroupType = (type?: string) => type === 'group' || type === 'kubeGroup';

export function isGroup(node: GraphNode): node is KubeGroupNode | GroupNode {
  return isGroupType(node.type);
}

/**
 * Iterates graph, breadth first
 */
export function forEachNode(graph: GraphNode, cb: (item: GraphNode) => void) {
  cb(graph);
  if ('nodes' in graph.data) {
    graph.data.nodes.forEach(it => forEachNode(it, cb));
  }
}

/**
 * Edge connecting two Nodes on Map
 */
export interface GraphEdge {
  /** Type of the edge */
  type: string;
  /** Unique ID */
  id: string;
  /** ID of the source Node */
  source: string;
  /** ID of the target Node */
  target: string;
  /** Optional label */
  label?: ReactNode;
  /** Animate this edge during transitions */
  animated?: boolean;
  /** Custom data for this node */
  data?: any;
}

/**
 * Graph Source defines a group of Nodes and Edges
 * that can be loaded on the Map
 *
 * Graph Source may contain other GraphSources
 */
export type GraphSource = {
  /**
   * ID of the source, should be uniquie
   */
  id: string;
  /**
   * Descriptive label of the source
   */
  label: string;
  /**
   * Optional icon to display
   */
  icon?: ReactNode;
  /**
   * Controls wherther the source is shown by default
   * @default true
   */
  isEnabledByDefault?: boolean;
} & (
  | {
      /**
       * Child sources
       */
      sources: GraphSource[];
    }
  | {
      /**
       * Hooks that loads nodes and edges for this source
       */
      useData: () => { nodes?: GraphNode[]; edges?: GraphEdge[] } | null;
    }
);
