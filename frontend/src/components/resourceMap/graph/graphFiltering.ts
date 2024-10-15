import { getStatus } from '../nodes/KubeObjectStatus';
import { GraphEdge, GraphNode } from './graphModel';

export type GraphFilter =
  | {
      type: 'name';
      query: string;
    }
  | {
      type: 'hasErrors';
    }
  | {
      type: 'namespace';
      namespaces: Set<string>;
    }
  | {
      type: 'related';
      id: string;
    }
  | {
      type: 'custom';
      label: string;
      filterFn: (node: GraphNode) => boolean;
    };

export function filterGraph(nodes: GraphNode[], edges: GraphEdge[], filters: GraphFilter[]) {
  const filteredNodes: GraphNode[] = [];
  const filteredEdges: GraphEdge[] = [];

  const visitedNodes = new Set();
  const visitedEdges = new Set();

  function pushRelatedNodes(node: GraphNode) {
    if (visitedNodes.has(node.id)) return;
    visitedNodes.add(node.id);
    filteredNodes.push(node);
    edges.forEach(edge => {
      if (edge.source === node.id) {
        const targetNode = nodes.find(it => it.id === edge.target);
        if (targetNode && !visitedNodes.has(targetNode.id)) pushRelatedNodes(targetNode);
      }
      if (edge.target === node.id) {
        const sourceNode = nodes.find(it => it.id === edge.source);
        if (sourceNode && !visitedNodes.has(sourceNode.id)) pushRelatedNodes(sourceNode);
      }

      if (edge.target === node.id || edge.source === node.id) {
        if (!visitedEdges.has(edge.id)) {
          visitedEdges.add(edge.id);
          filteredEdges.push(edge);
        }
      }
    });
  }

  nodes.forEach(node => {
    let keep = true;

    filters.forEach(filter => {
      if (filter.type === 'name' && filter.query.trim().length > 0) {
        keep &&=
          'resource' in node.data && node.data.resource?.metadata?.name?.includes(filter.query);
      }
      if (filter.type === 'related') {
        keep &&= node.id === filter.id;
      }
      if (filter.type === 'hasErrors') {
        keep &&= 'resource' in node.data && getStatus(node?.data?.resource) !== 'success';
      }
      if (filter.type === 'namespace' && filter.namespaces.size > 0) {
        keep &&=
          'resource' in node.data &&
          filter.namespaces.has(node.data?.resource?.metadata?.namespace);
      }
      if (filter.type === 'custom') {
        keep &&= filter.filterFn(node);
      }
    });

    if (keep) {
      pushRelatedNodes(node);
    }
  });

  return {
    edges: filteredEdges,
    nodes: filteredNodes,
  };
}
