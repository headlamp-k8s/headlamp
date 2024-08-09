import { Edge, Node } from '@xyflow/react';
import { ElkExtendedEdge, ElkNode } from 'elkjs';
import ELK from 'elkjs';
import { GraphGroup, GraphNode } from './GraphModel';

type ElkNodeWithData = ElkNode & {
  type: string;
  data: any;
};

const elk = new ELK({
  defaultLayoutOptions: {},
});

const layoutOptions = {
  nodeSize: {
    width: 36,
    height: 36,
  },
};

const previewSize = 32;

function convertToElkGraph(graph: GraphGroup, aspectRatio: number): ElkNodeWithData {
  const isInCollapsedGroup = graph.data?.collapsed;
  const convertToElkNode = (node: GraphNode): ElkNodeWithData => {
    return {
      id: node.id,
      type: node.type,

      height: isInCollapsedGroup ? previewSize : layoutOptions.nodeSize.height,
      width: isInCollapsedGroup ? previewSize : layoutOptions.nodeSize.width,

      x: isInCollapsedGroup ? 24 : 0,
      y: isInCollapsedGroup ? 24 : 0,

      data: {
        label: node.label,
        resource: node.data.resource,
        ...node.data,
      },
    };
  };
  const convertedNodes = graph.nodes.map(convertToElkNode);
  const convertedEdges = graph.edges
    .map(edge => {
      // Make sure source and target exists
      const source = graph.nodes.find(node => node.id === edge.source);
      const target = graph.nodes.find(node => node.id === edge.target);

      if (!source || !target) {
        console.log('Edge points to nothing');
        return;
      }

      return {
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
        label: edge.label,
        animated: edge.animated,
      };
    })
    .filter(Boolean) as ElkExtendedEdge[];

  const isCollapsed = graph.data?.collapsed;

  const rootLayout = {
    'elk.algorithm': 'rectpacking',
    'elk.rectpacking.packing.compaction.iterations': '2',
    'elk.aspectRatio': String(aspectRatio),
    'elk.spacing.nodeNode': '10',
    'elk.padding': '[left=8, top=24, right=8, bottom=8]',
    'elk.nodeSize.minimum': '(150.0,100.0)',
    'elk.nodeSize.constraints': 'MINIMUM_SIZE',
  };

  return {
    id: graph.id || String(Math.random()),

    type: 'nodeGroup',

    edges: convertedEdges,

    data: {
      ...graph.data,
    },

    width: 250,
    height: 250,

    x: isInCollapsedGroup ? 34 : 0,
    y: isInCollapsedGroup ? 34 : 0,

    layoutOptions:
      convertedNodes.length === 0
        ? rootLayout
        : {
            'elk.force.model': 'EADES',
            'elk.nodeSize.minimum': '(80.0,80.0)',
            'elk.nodeSize.constraints': 'MINIMUM_SIZE',
            'elk.algorithm': isCollapsed ? 'rectpacking' : 'stress',
            'elk.aspectRatio': String(aspectRatio),
            'elk.spacing.nodeNode': isCollapsed ? '1' : '40',
            'org.eclipse.elk.stress.desiredEdgeLength': isCollapsed ? '20' : '100',
            'elk.padding': isCollapsed
              ? '[left=8, top=24, right=8, bottom=8]'
              : '[left=28, top=42, right=28, bottom=28]',
          },

    children: [
      ...convertedNodes,
      ...(graph.children?.map(it => convertToElkGraph(it, aspectRatio)) ?? []),
    ],
  };
}

function convertToReactFlowGraph(elkGraph: ElkNodeWithData) {
  const edges: Edge[] = [];
  const nodes: Node[] = [];

  const pushEdges = (node: ElkNodeWithData, parent?: ElkNodeWithData) => {
    node.edges?.forEach(edge => {
      edges.push({
        id: edge.id,
        source: edge.sources[0],
        target: edge.targets[0],
        type: 'customEdge',
        animated: edge.animated,
        data: {
          sections: edge.sections,
          label: edge?.label,
          parentOffset: {
            x: (node?.x ?? 0) + (parent?.x ?? 0),
            y: (node?.y ?? 0) + (parent?.y ?? 0),
          },
        },
      });
    });
  };

  const pushNode = (node: ElkNodeWithData, parent?: ElkNodeWithData) => {
    nodes.push({
      id: node.id,
      type: node.type,

      style: {
        width: node.width,
        height: node.height,
      },

      hidden: false,

      width: node.width,
      height: node.height,
      position: { x: node.x!, y: node.y! },

      data: {
        ...node.data,
      },

      parentId: parent?.id ?? undefined,
    });
  };

  const convertElkNode = (node: ElkNodeWithData, parent?: ElkNodeWithData) => {
    pushNode(node, parent);
    pushEdges(node, parent);
    node.children?.forEach(it => {
      convertElkNode(it as ElkNodeWithData, node);
    });
  };

  pushEdges(elkGraph);
  elkGraph.children!.forEach(node => {
    convertElkNode(node as ElkNodeWithData);
  });

  return { nodes, edges };
}

export const applyELKLayout = (graph: GraphGroup, aspectRatio: number) => {
  const elkGraph = convertToElkGraph(graph, aspectRatio);

  return (
    elk
      .layout(elkGraph, {
        layoutOptions: {
          'elk.algorithm': 'box',
          'elk.aspectRatio': '1',

          'elk.spacing.nodeNode': '10',
          'elk.padding': '[left=16, top=16, right=16, bottom=16]',
          'elk.animate': 'true',
        },
      })
      .then(node => {
        return node;
      })
      // .then(node =>
      //   // another layout pass to make sure nodes are not overlapping
      //   elk.layout(node, { layoutOptions: { 'elk.algorithm': 'org.eclipse.elk.sporeOverlap' } })
      // )
      .then(elkGraph => convertToReactFlowGraph(elkGraph as ElkNodeWithData))
  );
};
