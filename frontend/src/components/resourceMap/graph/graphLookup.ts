import { GraphEdge, GraphNode } from './graphModel';

/**
 * Constant time lookup of graph elements
 */
export interface GraphLookup<N, E> {
  /** Get list of outgoing edges from the given node */
  getOutgoingEdges(nodeId: string): E[] | undefined;
  /** Get list of incoming edges to the given node */
  getIncomingEdges(nodeId: string): E[] | undefined;
  /** Get Node by its' ID */
  getNode(nodeId: string): N | undefined;
}

/**
 * Creates a utility for constant time lookup of graph elements
 *
 * @param nodes - list of graph Nodes
 * @param edges - list of graph Edges
 * @returns lookup {@link GraphLookup}
 */
export function makeGraphLookup<N extends GraphNode, E extends GraphEdge>(
  nodes: N[],
  edges: E[]
): GraphLookup<N, E> {
  const nodeMap = new Map<string, N>();
  nodes.forEach(n => {
    nodeMap.set(n.id, n);
  });

  // Create map for incoming and outgoing edges where key is node ID
  const outgoingEdges = new Map<string, E[]>();
  const incomingEdges = new Map<string, E[]>();

  edges.forEach(edge => {
    const s = outgoingEdges.get(edge.source) ?? [];
    s.push(edge);
    outgoingEdges.set(edge.source, s);

    const t = incomingEdges.get(edge.target) ?? [];
    t.push(edge);
    incomingEdges.set(edge.target, t);
  });

  return {
    getOutgoingEdges(nodeId) {
      return outgoingEdges.get(nodeId);
    },
    getIncomingEdges(nodeId) {
      return incomingEdges.get(nodeId);
    },
    getNode(nodeId) {
      return nodeMap.get(nodeId);
    },
  };
}
