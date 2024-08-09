import { useCallback, useMemo, useState } from 'react';
import { ClusterResources, GraphEdge, GraphNode, GraphSource } from './GraphModel';

export function useGraphSources(resources: ClusterResources | undefined, sources: GraphSource[]) {
  const [selectedSources, setSelectedSources] = useState(() => {
    const _selectedSources = new Set<string>();

    const step = (source: GraphSource) => {
      if (source.isEnabledByDefault ?? true) {
        _selectedSources.add(source.id);
        if ('sources' in source) {
          source.sources.forEach(step);
        }
      }
    };
    sources.map(step);
    return _selectedSources;
  });

  const toggleSelection = useCallback(
    (source: GraphSource) => {
      setSelectedSources(selection => {
        const isSelected = (source: GraphSource): boolean =>
          'sources' in source ? source.sources.every(s => isSelected(s)) : selection.has(source.id);

        const deselectAll = (source: GraphSource) => {
          if ('sources' in source) {
            source.sources.forEach(deselectAll);
          } else {
            selection.delete(source.id);
          }
        };

        const selectAll = (source: GraphSource) => {
          if ('sources' in source) {
            source.sources.forEach(s => selectAll(s));
          } else {
            selection.add(source.id);
          }
        };

        if (!('sources' in source)) {
          // not a group, just toggle the selection
          if (selection.has(source.id)) {
            selection.delete(source.id);
          } else {
            selection.add(source.id);
          }
        } else {
          // if all children are selected, deselect them
          if (source.sources.every(isSelected)) {
            source.sources.forEach(deselectAll);
          } else {
            source.sources.forEach(selectAll);
          }
        }
        return new Set(selection);
      });
    },
    [setSelectedSources]
  );

  const nodesAndEdges = useMemo(() => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    if (!resources) return { nodes, edges };

    const addSource = (source: GraphSource) => {
      if (selectedSources.has(source.id)) {
        if ('nodes' in source && source.nodes) {
          nodes.push(...source.nodes({ resources }));
        }
        if ('edges' in source && source.edges) {
          edges.push(...source.edges({ resources }));
        }
      }

      if ('sources' in source) {
        source.sources.forEach(addSource);
      }
    };

    sources.forEach(addSource);

    const existingEdges = new Set();
    const filteredEdges = edges.filter(edge => {
      if (existingEdges.has(edge.id)) return false;

      existingEdges.add(edge.id);
      return true;
    });

    return { nodes, edges: filteredEdges };
  }, [resources, sources, selectedSources]);

  return [nodesAndEdges, selectedSources, toggleSelection] as const;
}
