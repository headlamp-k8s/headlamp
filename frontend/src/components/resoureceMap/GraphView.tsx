import '@xyflow/react/dist/base.css';
import './GraphView.css';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import {
  Background,
  Edge,
  getNodesBounds,
  Node,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useStore,
  useStoreApi,
} from '@xyflow/react';
import { debounce } from 'lodash';
import {
  createContext,
  StrictMode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useClusterResources } from './ClusterResources';
import { CustomEdge } from './edges/CustomEdge';
import { GraphNodeDetails } from './GraphDetails';
import { filterGraph, GraphFilter } from './GraphFilter';
import { applyELKLayout } from './GraphLayout';
import { GraphGroup, GraphNode, GraphSource } from './GraphModel';
import { allSources } from './GraphSources';
import { GraphSourcesView } from './GraphSourcesView';
import { getConnectedComponents, groupByNamespace, groupByNode } from './GraphUtils';
import { ContainerNode } from './nodes/ContainerNode';
import { GroupNodeComponent, KubeObjectNodeComponent } from './nodes/KubeObjectNode';
import { getStatus } from './nodes/KubeObjectStatus';
import { NodeGroupNode } from './nodes/NodeGroupNode';
import { useGraphSources } from './useGraphSources';

const edgeTypes = {
  customEdge: CustomEdge,
};

const nodeTypes = {
  kubeObject: KubeObjectNodeComponent,
  customGroup: GroupNodeComponent,
  container: ContainerNode,
  nodeGroup: NodeGroupNode,
};

const namespace = '';

interface GraphViewContentProps {
  height?: string;
  defaultNodeSelection?: string;
  defaultSources?: GraphSource[];
  defaultFilters?: GraphFilter[];

  groupingOptions?: {
    disable?: boolean;
  };

  hideHeader?: boolean;
}

export const GraphViewContext = createContext({});
export const useGraphView = () => useContext<any>(GraphViewContext);

function GraphViewContent({
  height,
  defaultNodeSelection,
  defaultSources = allSources,
  defaultFilters = [],

  groupingOptions = {},

  hideHeader,
}: GraphViewContentProps) {
  // Search query filter
  const [query, setQuery] = useState('');
  // Group disconnected subgraphs
  const [groupBy, setGroupBy] = useState<string | undefined>(undefined);
  // All Resources in the cluster
  const clusterResources = useClusterResources(namespace);

  const [groupSelection, setGroupSelection] = useState<string | undefined>(undefined);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [nodeSelection, setNodeSelection] = useState<string | undefined>(defaultNodeSelection);

  // Create nodes and edges based on the selected sources
  const [{ nodes, edges }, selectedSources, toggleSource] = useGraphSources(
    clusterResources,
    defaultSources
  );

  const [layoutedGraph, setLayoutedGraph] = useState<{ nodes: Node[]; edges: Edge[] }>({
    nodes: [],
    edges: [],
  });

  const flow = useReactFlow();
  const graphStore = useStoreApi();
  const aspectRatio = useStore(it => it.width / it.height);

  useEffect(() => {
    // FILTERING
    const filteredNodes: GraphNode[] = filterGraph(nodes, edges, [
      ...defaultFilters,
      { type: 'name', query },
    ]);

    let graph: GraphGroup = {
      id: 'root',
      data: {
        label: 'root',
      },
      nodes: filteredNodes,
      edges: edges,
    };

    // GROUPING
    if (!groupingOptions.disable) {
      let components: GraphGroup[] = [];
      const groupComponents = true;
      if (groupComponents) {
        components = getConnectedComponents(filteredNodes, edges);
      }

      if (groupBy === 'namespace') {
        components = groupByNamespace(components);
      }

      if (groupBy === 'node') {
        components = groupByNode(components);
      }

      const collapseGroup = (group: GraphGroup): GraphGroup => ({
        ...group,
        edges: group.id === groupSelection ? group.edges : [],
        nodes: group.id === groupSelection ? group.nodes : [],
        // : group.nodes.map(node => ({ ...node, data: { ...node.data, tiny: true } })).slice(0, 1),
        children: group.children?.map(collapseGroup),
        data: {
          ...group.data,
          collapsed: (group.children?.length ?? 0) === 0 && groupSelection !== group.id,
          elements: group.nodes.length,
          errors: group.nodes.reduce(
            (acc, node) =>
              acc + (node.data.resource && getStatus(node.data.resource) === 'error' ? 1 : 0),
            0
          ),
        },
      });

      if (components.length > 1) {
        components = components.map(collapseGroup);
      }

      if (groupSelection === undefined && components.length > 0) {
      } else {
        const findSelected = (components: GraphGroup[]): GraphGroup | undefined => {
          let found: GraphGroup | undefined;

          const step = (component: GraphGroup) => {
            if (
              component.id === groupSelection ||
              component.nodes.find(it => it.id === groupSelection)
            ) {
              found = component;
              return;
            }
            component.children?.forEach(step);
          };
          components.forEach(step);
          return found;
        };

        // find component with selected node
        const selectedComponent = findSelected(components);

        if (selectedComponent) {
          components = [selectedComponent];
        }
      }
      graph = {
        id: 'root',
        data: {
          label: 'root',
        },
        nodes: [],
        edges: [],
        children: components,
      };
    }

    // LAYOUT
    applyELKLayout(graph, aspectRatio).then(layout => {
      setLayoutedGraph(layout);

      const bounds = getNodesBounds(layout.nodes);
      flow.fitBounds(bounds);
    });
  }, [edges, nodes, groupBy, query, groupSelection, expandedGroups, aspectRatio]);

  const selectedNode = nodes.find(it => it.id === nodeSelection);

  const expandGroup = useCallback(
    (id: string) => {
      setExpandedGroups(expandedGroups => {
        if (expandedGroups.includes(id)) {
          return expandedGroups.filter(it => it !== id);
        } else {
          return [...expandedGroups, id];
        }
      });
    },
    [setExpandedGroups]
  );

  return (
    <GraphViewContext.Provider
      value={useMemo(() => ({ expandGroup, nodeSelection }), [nodeSelection, expandGroup])}
    >
      <Box sx={{ height: height ?? '800px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {!hideHeader && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              // flexDirection: 'column',
              margin: '1rem',
              top: '50px',
            }}
          >
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Group by</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="nothing"
                onChange={e => setGroupBy(e.target.value)}
              >
                <FormControlLabel value="nothing" control={<Radio />} label="Nothing" />
                <FormControlLabel value="namespace" control={<Radio />} label="Namespace" />
                <FormControlLabel value="node" control={<Radio />} label="Node" />
              </RadioGroup>
            </FormControl>
            <GraphSourcesView
              sources={defaultSources}
              selectedSources={selectedSources}
              toggleSource={toggleSource}
            />

            <TextField
              placeholder="Search"
              sx={{ marginLeft: 'auto' }}
              onChange={debounce(e => {
                setQuery(e.target.value);
              }, 200)}
            />
          </Box>
        )}

        <Box
          sx={theme => ({
            border: '1px solid #434343',
            borderColor: theme.palette.tables.head.borderColor,
            borderRadius: '6px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            flexGrow: 1,
          })}
        >
          {selectedNode && <GraphNodeDetails node={selectedNode} />}

          <div style={{ flexGrow: 1 }}>
            <ReactFlow
              nodes={layoutedGraph.nodes}
              edges={layoutedGraph.edges}
              edgeTypes={edgeTypes}
              nodeTypes={nodeTypes}
              onNodeClick={useCallback((event: any, node: any) => {
                if (node.type === 'nodeGroup') {
                  setGroupSelection(node.id);
                }
                if (node.type === 'kubeObject') {
                  setNodeSelection(node.id);
                }
              }, [])}
              fitView
              fitViewOptions={{
                padding: 0.15,
              }}
              onClickCapture={() => {
                setNodeSelection(undefined);
              }}
              minZoom={0.1}
            >
              <Panel position="top-left">
                {groupSelection && groupSelection !== 'root' && (
                  <Button
                    onClick={() => {
                      setGroupSelection('root');
                      setNodeSelection(undefined);
                    }}
                  >
                    {`<-`} Back
                  </Button>
                )}
              </Panel>
              <Background />
            </ReactFlow>
          </div>
        </Box>
      </Box>
    </GraphViewContext.Provider>
  );
}

export function GraphView(props: GraphViewContentProps) {
  return (
    <StrictMode>
      <ReactFlowProvider>
        <GraphViewContent {...props} />
      </ReactFlowProvider>
    </StrictMode>
  );
}
