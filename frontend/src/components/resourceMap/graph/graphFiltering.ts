import { getStatus } from '../nodes/KubeObjectStatus';
import { GraphEdge, GraphNode } from './graphModel';

export type GraphFilter =
  | {
      type: 'hasErrors';
    }
  | {
      type: 'namespace';
      namespaces: Set<string>;
    };

/**
 * Filters the graph nodes and edges based on the provided filters
 * The filters are applied using an OR logic, meaning node will be included if it matches any of the filters
 *
 * Along with the matched node result also includes all the nodes that are related to it,
 * even if they don't match the filter
 *
 * The filters can be of the following types:
 * - `hasErrors`: Filters nodes that have errors based on their resource status. See {@link getStatus}
 * - `namespace`: Filters nodes by their namespace
 *
 * @param nodes - List of all the nodes in the graph
 * @param edges - List of all the edges in the graph
 * @param filters - List of fitlers to apply
 */
export function filterGraph(nodes: GraphNode[], edges: GraphEdge[], filters: GraphFilter[]) {
  const filteredNodes: GraphNode[] = [];
  const filteredEdges: GraphEdge[] = [];

  const visitedNodes = new Set();
  const visitedEdges = new Set();

  /**
   * Add all the nodes that are related to the given node
   * Related means connected by an edge
   * @param node - Given node
   */
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
      if (filter.type === 'hasErrors') {
        keep &&= 'resource' in node.data && getStatus(node?.data?.resource) !== 'success';
      }
      if (filter.type === 'namespace' && filter.namespaces.size > 0) {
        keep &&=
          'resource' in node.data &&
          !!node.data?.resource?.metadata?.namespace &&
          filter.namespaces.has(node.data?.resource?.metadata?.namespace);
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
