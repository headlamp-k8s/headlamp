import '@xyflow/react/dist/base.css';
import './GraphView.css';
import { Icon } from '@iconify/react';
import { Box, Chip, Theme, ThemeProvider } from '@mui/material';
import { Edge, Node, Panel, ReactFlowProvider } from '@xyflow/react';
import {
  createContext,
  ReactNode,
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
import { GraphNode, GraphSource, GroupNode, isGroup, KubeObjectNode } from './graph/graphModel';
import { GraphControlButton } from './GraphControls';
import { GraphRenderer } from './GraphRenderer';
import { NodeHighlight, useNodeHighlight } from './NodeHighlight';
import { ResourceSearch } from './search/ResourceSearch';
import { SelectionBreadcrumbs } from './SelectionBreadcrumbs';
import { allSources, GraphSourceManager, useSources } from './sources/GraphSources';
import { GraphSourcesView } from './sources/GraphSourcesView';
import { useGraphViewport } from './useGraphViewport';
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
  /**
   * List of Graph Source to display
   *
   * See {@link GraphSource} for more information
   */
  defaultSources?: GraphSource[];

  /** Default filters to apply */
  defaultFilters?: GraphFilter[];
}

const defaultFiltersValue: GraphFilter[] = [];

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
  const { nodes, edges, selectedSources, sourceData, isLoading, toggleSelection } = useSources();

  // Graph with applied layout, has sizes and positions for all elements
  const [layoutedGraph, setLayoutedGraph] = useState<{ nodes: Node[]; edges: Edge[] }>({
    nodes: [],
    edges: [],
  });

  // Apply filters
  const filteredGraph = useMemo(() => {
    const filters = [...defaultFilters];
    if (hasErrorsFilter) {
      filters.push({ type: 'hasErrors' });
    }
    if (namespaces?.size > 0) {
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

  const viewport = useGraphViewport();

  useEffect(() => {
    applyGraphLayout(visibleGraph, viewport.aspectRatio).then(layout => {
      setLayoutedGraph(layout);

      // Only fit bounds when user hasn't moved viewport manually
      if (!viewportMovedRef.current) {
        viewport.updateViewport({ nodes: layout.nodes });
      }
    });
  }, [visibleGraph, viewport]);

  // Reset after view change
  useLayoutEffect(() => {
    viewportMovedRef.current = false;
  }, [selectedNodeId, groupBy, expandAll]);

  const selectedNode = useMemo(
    () => nodes.find((it: GraphNode) => it.id === selectedNodeId),
    [selectedNodeId, nodes]
  );

  const selectedGroup = useMemo(() => {
    if (selectedNodeId) {
      return findGroupContaining(visibleGraph, selectedNodeId);
    }
  }, [selectedNodeId, visibleGraph, findGroupContaining]);
  const highlights = useNodeHighlight(selectedNodeId);

  const graphSize = getGraphSize(visibleGraph);
  useEffect(() => {
    if (expandAll && graphSize > 50) {
      setExpandAll(false);
    }
  }, [graphSize]);

  const contextValue = useMemo(
    () => ({ nodeSelection: selectedNodeId, highlights, setNodeSelection: setSelectedNodeId }),
    [selectedNodeId, setSelectedNodeId, highlights]
  );
  return (
    <GraphViewContext.Provider value={contextValue}>
      <Box
        sx={{
          position: 'relative',
          height: height ?? '800px',
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
        }}
      >
        <CustomThemeProvider>
          <Box
            sx={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              flexGrow: 1,
              background: '#00000002',
            }}
          >
            <Box
              padding={2}
              pb={0}
              display="flex"
              gap={1}
              alignItems="center"
              mb={1}
              flexWrap="wrap"
            >
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
                <ChipToggleButton
                  label={t('Group By: {{ name }}', { name: t('Namespace') })}
                  isActive={groupBy === 'namespace'}
                  onClick={() => setGroupBy(groupBy === 'namespace' ? undefined : 'namespace')}
                />
              )}

              <ChipToggleButton
                label={t('Group By: {{ name }}', { name: t('Instance') })}
                isActive={groupBy === 'instance'}
                onClick={() => setGroupBy(groupBy === 'instance' ? undefined : 'instance')}
              />

              <ChipToggleButton
                label={t('Group By: {{ name }}', { name: t('Node') })}
                isActive={groupBy === 'node'}
                onClick={() => setGroupBy(groupBy === 'node' ? undefined : 'node')}
              />

              <ChipToggleButton
                label={t('Status: Error or Warning')}
                isActive={hasErrorsFilter}
                onClick={() => setHasErrorsFilter(!hasErrorsFilter)}
              />

              {graphSize < 50 && (
                <ChipToggleButton
                  label={t('Expand All')}
                  isActive={expandAll}
                  onClick={() => setExpandAll(it => !it)}
                />
              )}
            </Box>

            <div style={{ flexGrow: 1 }}>
              <GraphRenderer
                nodes={layoutedGraph.nodes}
                edges={layoutedGraph.edges}
                isLoading={isLoading}
                onMoveStart={e => {
                  if (e === null) return;
                  viewportMovedRef.current = true;
                }}
                onBackgroundClick={() => {
                  // When node is selected (side panel is open) and user clicks on the background
                  // We should select parent node, closing the side panel
                  if (selectedNode && !isGroup(selectedNode)) {
                    setSelectedNodeId(getParentNode(fullGraph, selectedNode.id)?.id);
                  }
                }}
                controlActions={
                  <>
                    <GraphControlButton
                      title={t('Fit to screen')}
                      onClick={() => viewport.updateViewport({ mode: 'fit' })}
                    >
                      <Icon icon="mdi:fit-to-screen" />
                    </GraphControlButton>
                    <GraphControlButton
                      title={t('Zoom to 100%')}
                      onClick={() => viewport.updateViewport({ mode: '100%' })}
                    >
                      100%
                    </GraphControlButton>
                  </>
                }
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
        </CustomThemeProvider>
        {selectedNode && (
          <GraphNodeDetails
            node={selectedNode}
            close={() => {
              setSelectedNodeId(selectedGroup?.id ?? defaultNodeSelection);
            }}
          />
        )}
      </Box>
    </GraphViewContext.Provider>
  );
}

function ChipToggleButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive?: boolean;
  icon?: ReactNode;
  onClick: () => void;
}): ReactNode {
  return (
    <Chip
      label={label}
      color={isActive ? 'primary' : undefined}
      variant={isActive ? 'filled' : 'outlined'}
      icon={isActive ? <Icon icon="mdi:check" /> : undefined}
      onClick={onClick}
      sx={{
        lineHeight: '1',
      }}
    />
  );
}

function CustomThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      theme={(outer: Theme) => ({
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
      })}
    >
      {children}
    </ThemeProvider>
  );
}

/**
 * Renders Map of Kubernetes resources
 *
 * @param params - Map parameters
 * @returns
 */
export function GraphView(props: GraphViewContentProps) {
  const propsSources = props.defaultSources ?? allSources;

  // Load plugin defined sources
  const pluginGraphSources = useTypedSelector(state => state.graphView.graphSources);

  const sources = useMemo(
    () => [...propsSources, ...pluginGraphSources],
    [propsSources, pluginGraphSources]
  );

  return (
    <StrictMode>
      <ReactFlowProvider>
        <GraphSourceManager sources={sources}>
          <GraphViewContent {...props} defaultSources={sources} />
        </GraphSourceManager>
      </ReactFlowProvider>
    </StrictMode>
  );
}
