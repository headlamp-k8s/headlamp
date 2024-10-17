import '@xyflow/react/dist/base.css';
import './GraphView.css';
import { Icon } from '@iconify/react';
import { Box, Chip, Theme, ThemeProvider } from '@mui/material';
import {
  Edge,
  getNodesBounds,
  Node,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  useStore,
} from '@xyflow/react';
import {
  createContext,
  StrictMode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { NamespacesAutocomplete } from '../common';
import { GraphNodeDetails } from './details/GraphNodeDetails';
import { filterGraph, GraphFilter } from './graph/graphFiltering';
import {
  collapseGraph,
  findGroupContaining,
  getGraphSize,
  getParentNode,
  GroupBy,
  groupGraph,
} from './graph/graphGrouping';
import { applyGraphLayout } from './graph/graphLayout';
import {
  GraphNode,
  GraphSource,
  GroupNode,
  isGroup,
  KubeGroupNode,
  KubeObjectNode,
} from './graph/graphModel';
import { GraphRenderer } from './GraphRenderer';
import { NodeHighlight, useNodeHighlight } from './NodeHighlight';
import { ResourceSearch } from './search/ResourceSearch';
import { SelectionBreadcrumbs } from './SelectionBreadcrumbs';
import { allSources, GraphSourceManager, useSources } from './sources/GraphSources';
import { GraphSourcesView } from './sources/GraphSourcesView';
import { useQueryParamsState } from './useQueryParamsState';

interface GraphViewContent {
  setNodeSelection: (nodeId: string) => void;
  nodeSelection?: string;
  highlights: NodeHighlight;
}
export const GraphViewContext = createContext({} as any);
export const useGraphView = () => useContext<GraphViewContent>(GraphViewContext);

interface GraphViewContentProps {
  /** Height of the Map */
  height?: string;
  /** ID of a node to select by default */
  defaultNodeSelection?: string;
  /** List of sources to displays */
  defaultSources?: GraphSource[];
  /** Default filters to apply */
  defaultFilters?: GraphFilter[];
}

const defaultFiltersValue: any[] = [];

function GraphViewContent({
  height,
  defaultNodeSelection,
  defaultSources = allSources,
  defaultFilters = defaultFiltersValue,
}: GraphViewContentProps) {
  const { t } = useTranslation();

  // List of selected namespaces
  const namespaces = useTypedSelector(state => state.filter).namespaces;

  // Filters
  const [hasErrorsFilter, setHasErrorsFilter] = useState(false);

  // Grouping state
  const [groupBy, setGroupBy] = useQueryParamsState<GroupBy | undefined>('group', 'namespace');

  // Keep track if user moved the viewport
  const viewportMovedRef = useRef(false);

  // ID of the selected Node, undefined means nothing is selected
  const [selectedNodeId, _setSelectedNodeId] = useQueryParamsState<string | undefined>(
    'node',
    defaultNodeSelection
  );
  const setSelectedNodeId = useCallback(
    (id: string | undefined) => {
      if (id === 'root') {
        _setSelectedNodeId(undefined);
        return;
      }
      _setSelectedNodeId(id);
    },
    [_setSelectedNodeId]
  );

  // Expand all groups state
  const [expandAll, setExpandAll] = useState(false);

  // Load source data
  const { nodes, edges, selectedSources, sourceData, toggleSelection } = useSources();

  // Graph with applied layout, has sizes and positions for all elements
  const [layoutedGraph, setLayoutedGraph] = useState<{ nodes: Node[]; edges: Edge[] }>({
    nodes: [],
    edges: [],
  });

  const flow = useReactFlow();

  // Apply filters
  const filteredGraph = useMemo(() => {
    const filters = [...defaultFilters];
    if (hasErrorsFilter) {
      filters.push({ type: 'hasErrors' });
    }
    if (namespaces) {
      filters.push({ type: 'namespace', namespaces });
    }
    return filterGraph(nodes, edges, filters);
  }, [nodes, edges, hasErrorsFilter, namespaces, defaultFilters]);

  // Group the graph
  const { visibleGraph, fullGraph } = useMemo(() => {
    const graph = groupGraph(filteredGraph.nodes as KubeObjectNode[], filteredGraph.edges, {
      groupBy,
    });

    const visibleGraph = collapseGraph(graph, { selectedNodeId, expandAll }) as GroupNode;

    return { visibleGraph, fullGraph: graph };
  }, [filteredGraph, groupBy, selectedNodeId, expandAll]);

  // Apply layout to visible graph
  const aspectRatio = useStore(it => it.width / it.height);
  useEffect(() => {
    applyGraphLayout(visibleGraph, aspectRatio).then(layout => {
      setLayoutedGraph(layout);
      const bounds = getNodesBounds(layout.nodes);

      // Only fit bounds when user hasn't moved viewport manually
      if (!viewportMovedRef.current) {
        flow.fitBounds(bounds, { padding: 0.2 });
      }
    });
  }, [visibleGraph, aspectRatio]);

  // Reset after view change
  useLayoutEffect(() => {
    viewportMovedRef.current = false;
  }, [selectedNodeId, groupBy, expandAll]);

  const selectedNode = nodes.find((it: GraphNode) => it.id === selectedNodeId);

  let selectedGroup: KubeGroupNode | undefined;
  if (selectedNodeId) {
    selectedGroup = findGroupContaining(visibleGraph, selectedNodeId) as any;
  }
  const highlights = useNodeHighlight(selectedNodeId);

  const graphSize = getGraphSize(visibleGraph);
  useEffect(() => {
    if (expandAll && graphSize > 50) {
      setExpandAll(false);
    }
  }, [graphSize]);

  return (
    <GraphViewContext.Provider
      value={useMemo(
        () => ({ nodeSelection: selectedNodeId, highlights, setNodeSelection: setSelectedNodeId }),
        [selectedNodeId, setSelectedNodeId, highlights]
      )}
    >
      <Box
        sx={{
          position: 'relative',
          height: height ?? '800px',
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
        }}
      >
        <Box
          sx={() => ({
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            flexGrow: 1,
            background: '#00000002',
          })}
        >
          <Box padding={2} pb={0}>
            <Box display="flex" gap={1} alignItems="center" mb={1} flexWrap="wrap">
              <ResourceSearch
                resources={nodes.flatMap(it =>
                  it.type === 'kubeObject' ? [it.data.resource] : []
                )}
                onSearch={resource => {
                  setSelectedNodeId(resource.metadata.uid);
                }}
              />

              <NamespacesAutocomplete />

              <GraphSourcesView
                sources={defaultSources}
                selectedSources={selectedSources}
                toggleSource={toggleSelection}
                sourceData={sourceData ?? new Map()}
              />

              {namespaces.size !== 1 && (
                <Chip
                  label={t('Group By: {{ name }}', { name: t('Namespace') })}
                  color={groupBy === 'namespace' ? 'primary' : undefined}
                  variant={groupBy === 'namespace' ? 'filled' : 'outlined'}
                  icon={groupBy === 'namespace' ? <Icon icon="mdi:check" /> : undefined}
                  onClick={() => setGroupBy(it => (it === 'namespace' ? undefined : 'namespace'))}
                  sx={{
                    lineHeight: '1',
                  }}
                />
              )}

              <Chip
                label={t('Group By: {{ name }}', { name: t('Instance') })}
                color={groupBy === 'instance' ? 'primary' : undefined}
                variant={groupBy === 'instance' ? 'filled' : 'outlined'}
                icon={groupBy === 'instance' ? <Icon icon="mdi:check" /> : undefined}
                onClick={() => setGroupBy(it => (it === 'instance' ? undefined : 'instance'))}
                sx={{
                  lineHeight: '1',
                }}
              />

              <Chip
                label={t('Group By: {{ name }}', { name: t('Node') })}
                color={groupBy === 'node' ? 'primary' : undefined}
                variant={groupBy === 'node' ? 'filled' : 'outlined'}
                icon={groupBy === 'node' ? <Icon icon="mdi:check" /> : undefined}
                onClick={() => setGroupBy(it => (it === 'node' ? undefined : 'node'))}
                sx={{
                  lineHeight: '1',
                }}
              />

              <Chip
                label={t('Status: Error or Warning')}
                color={hasErrorsFilter ? 'primary' : undefined}
                variant={hasErrorsFilter ? 'filled' : 'outlined'}
                icon={hasErrorsFilter ? <Icon icon="mdi:check" /> : undefined}
                onClick={() => setHasErrorsFilter(!hasErrorsFilter)}
                sx={{
                  lineHeight: '1',
                }}
              />

              {graphSize < 50 && (
                <Chip
                  label={t('Expand All')}
                  color={expandAll ? 'primary' : undefined}
                  variant={expandAll ? 'filled' : 'outlined'}
                  icon={expandAll ? <Icon icon="mdi:check" /> : undefined}
                  onClick={() => setExpandAll(it => !it)}
                  sx={{
                    lineHeight: '1',
                  }}
                />
              )}
            </Box>
          </Box>
          <div style={{ flexGrow: 1 }}>
            <GraphRenderer
              nodes={layoutedGraph.nodes}
              edges={layoutedGraph.edges}
              onMoveStart={e => {
                if (e === null) return;
                viewportMovedRef.current = true;
              }}
              onBackgroundClick={() => {
                if (selectedGroup && selectedNodeId === selectedGroup.id) {
                  const parent = getParentNode(fullGraph, selectedGroup.id);
                  if (parent) {
                    setSelectedNodeId(parent.id);
                  }
                } else if (selectedGroup) {
                  setSelectedNodeId(selectedGroup.id);
                }
              }}
              onNodeClick={useCallback((event: any, node: any) => {
                if (isGroup(node)) {
                  setSelectedNodeId(node.id);
                }
              }, [])}
            >
              <Panel position="top-left">
                {selectedGroup && (
                  <SelectionBreadcrumbs
                    graph={fullGraph}
                    selectedNodeId={selectedNodeId}
                    onNodeClick={id => setSelectedNodeId(id)}
                  />
                )}
              </Panel>
            </GraphRenderer>
          </div>
        </Box>
        {selectedNode && (
          <GraphNodeDetails
            node={selectedNode}
            close={() => {
              if (selectedGroup) {
                setSelectedNodeId(selectedGroup.id);
              } else {
                setSelectedNodeId(defaultNodeSelection);
              }
            }}
          />
        )}
      </Box>
    </GraphViewContext.Provider>
  );
}

/**
 * Renders Map of Kubernetes resources
 *
 * @param params - Map parameters
 * @returns
 */
export function GraphView(props: GraphViewContentProps) {
  return (
    <ThemeProvider
      theme={(outer: Theme) =>
        ({
          ...outer,
          palette:
            outer.palette.mode === 'light'
              ? {
                  ...outer.palette,
                  primary: {
                    main: '#555',
                    contrastText: '#fff',
                    light: '#666',
                    dark: '#444',
                  },
                }
              : {
                  ...outer.palette,
                  primary: {
                    main: '#fafafa',
                    contrastText: '#444',
                    light: '#fff',
                    dark: '#f0f0f0',
                  },
                },
          components: {},
        } as any)
      }
    >
      <StrictMode>
        <ReactFlowProvider>
          <GraphSourceManager sources={props.defaultSources ?? allSources}>
            <GraphViewContent {...props} />
          </GraphSourceManager>
        </ReactFlowProvider>
      </StrictMode>
    </ThemeProvider>
  );
}
