import { GraphEdge, GraphNode } from './GraphModel';

export type GraphFilter =
  | {
      type: 'name';
      query: string;
    }
  | {
      type: 'related';
      id: string;
    };

export function filterGraph(
  nodes: GraphNode[],
  edges: GraphEdge[],
  filters: GraphFilter[]
): GraphNode[] {
  const relatedNodes: GraphNode[] = [];

  const visited = new Set();

  function pushRelatedNodes(node: GraphNode) {
    if (visited.has(node.id)) return;
    visited.add(node.id);
    relatedNodes.push(node);
    edges.forEach(edge => {
      if (edge.source === node.id) {
        const targetNode = nodes.find(it => it.id === edge.target);
        if (targetNode && !visited.has(targetNode.id)) pushRelatedNodes(targetNode);
      }
      if (edge.target === node.id) {
        const sourceNode = nodes.find(it => it.id === edge.source);
        if (sourceNode && !visited.has(sourceNode.id)) pushRelatedNodes(sourceNode);
      }
    });
  }

  nodes.forEach(node => {
    let keep = true;

    filters.forEach(filter => {
      if (filter.type === 'name' && filter.query.trim().length > 0) {
        keep &&= node.data.resource?.metadata?.name?.includes(filter.query);
      }
      if (filter.type === 'related') {
        keep &&= node.id === filter.id;
      }
    });

    if (keep) {
      pushRelatedNodes(node);
    }
  });

  return relatedNodes;
}
