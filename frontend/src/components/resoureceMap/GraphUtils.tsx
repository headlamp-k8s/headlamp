import { groupBy } from 'lodash';
import { GraphEdge, GraphGroup, GraphNode } from './GraphModel';

/**
 * Connected component is a subgraph where all nodes are connected to each other
 * but not to any other node in the graph. Essentialy a separate graph
 */
export const getConnectedComponents = (nodes: GraphNode[], edges: GraphEdge[]): GraphGroup[] => {
  const components: GraphGroup[] = [];
  const visited: { [key: string]: boolean } = {};

  const dfs = (node: GraphNode, componentNodes: GraphNode[]) => {
    visited[node.id] = true;
    componentNodes.push(node);
    edges.forEach(edge => {
      if (edge.source === node.id && !visited[edge.target]) {
        const targetNode = nodes.find(n => n.id === edge.target);
        if (targetNode) dfs(targetNode, componentNodes);
      } else if (edge.target === node.id && !visited[edge.source]) {
        const sourceNode = nodes.find(n => n.id === edge.source);
        if (sourceNode) dfs(sourceNode, componentNodes);
      }
    });
  };

  nodes.forEach(node => {
    if (!visited[node.id]) {
      const componentNodes: GraphNode[] = [];
      dfs(node, componentNodes);
      // Find edges for the current component
      const componentEdges = edges.filter(
        edge =>
          componentNodes.find(n => n.id === edge.source) &&
          componentNodes.find(n => n.id === edge.target)
      );
      const name = getComponentName(componentNodes);
      const id = 'group-' + componentNodes[0].id;
      components.push({
        id: id,
        data: {
          label: name,
        },
        nodes: componentNodes,
        edges: componentEdges,
      });
    }
  });

  return components;
};

export const getComponentName = (nodes: GraphNode[]) => {
  const deployment = nodes.find(it => it.data.resource?.kind === 'Deployment');
  if (deployment) return deployment.data.resource.metadata.name;

  if (nodes[0].data.resource) {
    return nodes[0].data.resource.metadata.name;
  }

  return 'group';
};

export const groupByNamespace = (components: GraphGroup[]): GraphGroup[] => {
  const groups = Object.entries(
    groupBy(components, component => component.nodes[0].data.resource?.metadata.namespace)
  ).map(
    ([namespace, components]): GraphGroup => ({
      id: 'namespace-' + namespace,
      nodes: [],
      edges: [],
      data: {
        label: 'namespace: ' + namespace,
      },
      children: components,
    })
  );

  return groups;
};

export const groupByNode = (components: GraphGroup[]): GraphGroup[] => {
  const groups = Object.entries(
    groupBy(components, component => {
      const maybePod = component.nodes.find(it => it.data.resource?.kind === 'Pod');

      return maybePod?.data.resource?.spec?.nodeName ?? 'no-node';
    })
  ).map(
    ([name, components]): GraphGroup => ({
      id: 'node-' + name,
      nodes: [],
      edges: [],
      data: {
        label: 'node: ' + name,
      },
      children: components,
    })
  );

  return groups;
};
