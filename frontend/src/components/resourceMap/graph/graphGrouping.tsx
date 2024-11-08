import { groupBy } from 'lodash';
import Pod from '../../../lib/k8s/pod';
import { makeGraphLookup } from './graphLookup';
import {
  forEachNode,
  GraphEdge,
  GraphNode,
  GroupNode,
  isGroup,
  KubeGroupNode,
  KubeObjectNode,
} from './graphModel';

export type GroupBy = 'node' | 'namespace' | 'instance';

/**
 * Returns the amount of nodes in the graph
 */
export const getGraphSize = (graph: GraphNode) => {
  let size = 0;

  forEachNode(graph, () => {
    size++;
  });

  return size;
};

/**
 * Identifies and groups connected components from a set of nodes and edges.
 * Connected component is a subgraph where all nodes are connected to each other
 * but not to any other node in the graph. Essentialy a separate subgraph
 *
 * @param nodes - An array of `KubeObjectNode` representing the nodes in the graph
 * @param edges - An array of `GraphEdge` representing the edges in the graph
 * @returns An array of `GraphNode` where each element is either a single node
 *          or a group node containing multiple nodes and edges
 */
const getConnectedComponents = (nodes: KubeObjectNode[], edges: GraphEdge[]): GraphNode[] => {
  const components: KubeGroupNode[] = [];

  const graphLookup = makeGraphLookup(nodes, edges);

  const visitedNodes = new Set<string>();
  const visitedEdges = new Set<string>();

  /**
   * Recursively finds all nodes in the connected component of a given node
   * This function performs a depth-first search (DFS) to traverse and collect all nodes
   * that are part of the same connected component as the provided node
   *
   * @param node - The starting node for the connected component search
   * @param componentNodes - An array to store the nodes that are part of the connected component
   */
  const findConnectedComponent = (
    node: KubeObjectNode,
    componentNodes: KubeObjectNode[],
    componentEdges: GraphEdge[]
  ) => {
    visitedNodes.add(node.id);
    componentNodes.push(node);

    graphLookup.getOutgoingEdges(node.id)?.forEach(edge => {
      if (visitedNodes.has(edge.target)) return;

      if (!visitedEdges.has(edge.id)) {
        visitedEdges.add(edge.id);
        componentEdges.push(edge);
      }

      const targetNode = graphLookup.getNode(edge.target);
      if (targetNode) {
        componentEdges.push(edge);
        findConnectedComponent(targetNode, componentNodes, componentEdges);
      }
    });

    graphLookup.getIncomingEdges(node.id)?.forEach(edge => {
      if (visitedNodes.has(edge.source)) return;

      if (!visitedEdges.has(edge.id)) {
        visitedEdges.add(edge.id);
        componentEdges.push(edge);
      }

      const sourceNode = graphLookup.getNode(edge.source);
      if (sourceNode) {
        componentEdges.push(edge);
        findConnectedComponent(sourceNode, componentNodes, componentEdges);
      }
    });
  };

  // Iterate over each node and find connected components
  nodes.forEach(node => {
    if (!visitedNodes.has(node.id)) {
      const componentNodes: KubeObjectNode[] = [];
      const componentEdges: GraphEdge[] = [];
      findConnectedComponent(node, componentNodes, componentEdges);
      const mainNode = getMainNode(componentNodes);

      const id = 'group-' + mainNode.id;
      components.push({
        id: id,
        type: 'kubeGroup',
        data: {
          label: mainNode.data.resource.metadata.name,
          nodes: componentNodes,
          edges: componentEdges,
        },
      });
    }
  });

  return components.map(it => (it.data.nodes.length === 1 ? it.data.nodes[0] : it));
};

/**
 * Try to find a "main" node in the workload group
 * If can't find anything return the first node
 */
export const getMainNode = (nodes: KubeObjectNode[]) => {
  const deployment = nodes.find(it => it.data.resource.kind === 'Deployment');
  const replicaSet = nodes.find(it => it.data.resource.kind === 'ReplicaSet');
  const daemonSet = nodes.find(it => it.data.resource.kind === 'DaemonSet');
  const statefulSet = nodes.find(it => it.data.resource.kind === 'StatefulSet');
  const job = nodes.find(it => it.data.resource.kind === 'Job');

  return deployment ?? replicaSet ?? daemonSet ?? statefulSet ?? job ?? nodes[0];
};

/**
 * Groups a list of nodes into 'group' type nodes
 * Groping property is determined by the accessor
 *
 * @param nodes - list of nodes
 * @param accessor - function returning which property to group by
 * @param param.label - label prefix for the group
 * @param param.allowSingleMemberGroup - won't create groups with single members if set to false
 * @returns List of created groups
 */
const groupByProperty = (
  nodes: GraphNode[],
  accessor: (n: GraphNode) => string | null | undefined,
  {
    label,
    allowSingleMemberGroup = false,
  }: {
    label: string;
    allowSingleMemberGroup?: boolean;
  }
) => {
  const groups = Object.entries(
    groupBy(nodes, node => {
      return accessor(node);
    })
  ).map(
    ([property, components]): GroupNode => ({
      id: label + '-' + property,
      type: 'group',
      data: {
        nodes: components,
        edges: [],
        label: label + ': ' + property,
      },
    })
  );

  const result = groups.flatMap(it => {
    const nonGroup = it.id.includes('undefined');
    const hasOneMember = it.data.nodes.length === 1;

    return nonGroup || (hasOneMember && !allowSingleMemberGroup) ? it.data.nodes : [it];
  });

  return result;
};

/**
 * Groups the graph into separate 'group' Nodes
 * Nodes within groups are sorted by size
 *
 * @param nodes - List of nodes
 * @param edges - List of edge
 * @param params.groupBy - group by which property
 * @returns Graph, a single root node with groups as its' children
 */
export function groupGraph(
  nodes: KubeObjectNode[],
  edges: GraphEdge[],
  { groupBy }: { groupBy?: GroupBy }
): GroupNode {
  const root: GroupNode = {
    id: 'root',
    type: 'group',
    data: {
      label: 'root',
      nodes: [],
      edges: [],
    },
  };

  let components: GraphNode[] = getConnectedComponents(nodes, edges);

  if (groupBy === 'namespace') {
    // Create groups based on the Kube resource namespace
    components = groupByProperty(
      components,
      component => {
        if (component.type === 'kubeGroup') {
          return component.data.nodes[0].data.resource.metadata.namespace;
        }
        if (component.type === 'group') {
          return null;
        }
        if (component.type === 'kubeObject') {
          return component.data.resource.metadata.namespace;
        }
      },
      { label: 'Namespace', allowSingleMemberGroup: true }
    );
  }

  if (groupBy === 'node') {
    // Create groups based on the Kube resource node
    components = groupByProperty(
      components,
      component => {
        if (component.type === 'kubeGroup') {
          const maybePod = component.data.nodes.find(it => it.data.resource?.kind === 'Pod')?.data
            ?.resource as Pod | undefined;
          return maybePod?.spec?.nodeName;
        }
        if (component.type === 'group') {
          return null;
        }
        if (component.type === 'kubeObject') {
          return (component.data.resource as Pod)?.spec?.nodeName;
        }
      },
      { label: 'Node', allowSingleMemberGroup: true }
    );
  }

  if (groupBy === 'instance') {
    // Create groups based on the instance label from metadata (if it exists)
    components = groupByProperty(
      components,
      node => {
        if (node.type === 'kubeGroup') {
          const mainNode = getMainNode(node.data.nodes);
          return mainNode.data.resource?.metadata?.labels?.['app.kubernetes.io/instance'];
        }
        if (node.type === 'kubeObject') {
          return node.data.resource.metadata?.labels?.['app.kubernetes.io/instance'];
        }
        return undefined;
      },
      { label: 'Instance' }
    );
  }

  root.data.nodes.push(...components);

  // Sort nodes within each group node
  forEachNode(root, node => {
    /**
     * Sort elements, giving priority to bigger groups
     */
    const getNodeWeight = (n: GraphNode) => {
      if (n.type === 'group') {
        return 100 + n.data.nodes.length;
      }
      if (n.type === 'kubeGroup') {
        return n.data.nodes.length;
      }
      return 1;
    };
    'nodes' in node.data && node.data?.nodes?.sort((a, b) => getNodeWeight(b) - getNodeWeight(a));
  });

  return root;
}

/**
 * Walks the graph do find the parent of the given node
 */
export function getParentNode(graph: GraphNode, elementId: string): GraphNode | undefined {
  let result: GraphNode | undefined;

  forEachNode(graph, node => {
    if (isGroup(node)) {
      if (node.data.nodes.find(it => it.id === elementId)) {
        result = node;
      }
    }
  });

  return result;
}

/**
 * Finds a Node with a group type that contains a given node
 * @param graph - graph which contains the Node
 * @param elementId - ID of a given Node
 * @returns
 */
export function findGroupContaining(graph: GraphNode, elementId: string): GraphNode | undefined {
  // Not a group
  if (!isGroup(graph)) return undefined;

  // Group is actually selcted, not a node inside a group
  if (graph.id === elementId) return graph;

  // Node is inside this group
  if (graph.data.nodes.find(it => it.id === elementId && !isGroup(it))) {
    return graph;
  }

  if ('nodes' in graph.data) {
    let res: GraphNode | undefined;
    graph.data.nodes?.some(it => {
      const group = findGroupContaining(it, elementId);
      if (group) {
        res = group;
        return true;
      }
      return false;
    });
    if (res) {
      return res;
    }
  }

  return undefined;
}

/**
 * Given a graph with groups, this function will 'collapse' all groups without
 * the selected node. 'Collapsing' means that group won't show all children but
 * only a preview
 *
 * If selectedNodeId is passed, only shows group containing that node
 *
 * @param graph Single graph node
 * @param params.selectedNodeId Graph node that is selected
 * @param params.expandAll Display all the children within all groups
 * @returns Collapsed graph
 */
export function collapseGraph(
  graph: GroupNode | KubeGroupNode,
  { selectedNodeId, expandAll }: { selectedNodeId?: string; expandAll: boolean }
) {
  let root = { ...graph };
  let selectedGroup: GraphNode | undefined;

  if (selectedNodeId) {
    selectedGroup = findGroupContaining(graph, selectedNodeId);
  }

  /**
   * Recursively collapse graph starting from a given Node
   * Hides children if necessary
   * @param group - given Node
   * @returns Collapsed node
   */
  const collapseGroup = (group: GraphNode): GraphNode => {
    if (group.type !== 'kubeGroup' && group.type !== 'group') return group;

    const collapsed = expandAll
      ? false
      : group.type === 'kubeGroup' && selectedGroup?.id !== group.id;

    return {
      ...group,
      data: {
        ...group.data,
        nodes: group.data.nodes?.map(collapseGroup),
        edges: !collapsed ? group.data.edges : [],
        collapsed,
      },
    } as GraphNode;
  };

  if (selectedGroup && selectedGroup.id !== 'root') {
    root.data = {
      ...root.data,
      nodes: [selectedGroup],
    };
  }

  root = collapseGroup(root) as GroupNode;

  return root;
}
