import { useCallback, useState } from 'react';
import { GraphEdge } from './graph/graphModel';

export type NodeHighlight = ReturnType<typeof useNodeHighlight>;

export interface Highlight {
  /** Label to display */
  label?: string;
  /** Set of node IDs to highlight */
  nodeIds?: Set<string>;
  /** Set of edge IDs to highlight */
  edgeIds?: Set<string>;
}

/**
 * Manage the state for node highlighting
 */
export const useNodeHighlight = (nodeSelection?: string, selectedEdge?: GraphEdge) => {
  const [highlight, setHighlight] = useState<Highlight | undefined>(undefined);

  const isNodeHighlighted = useCallback(
    (nodeId: string) => {
      if (selectedEdge) {
        return nodeId === selectedEdge.source || nodeId === selectedEdge.target;
      }
      if (!highlight) return true;

      return highlight.nodeIds?.has(nodeId);
    },
    [highlight, selectedEdge, nodeSelection]
  );

  const isEdgeHighlighted = useCallback(
    (edgeId: string) => {
      if (selectedEdge) {
        return edgeId === selectedEdge.id;
      }
      if (!highlight) return true;

      return highlight.edgeIds?.has(edgeId);
    },
    [highlight, selectedEdge, nodeSelection]
  );

  return {
    highlight: highlight,
    someHighlighted: highlight !== undefined || selectedEdge !== undefined,
    setHighlight,
    isNodeHighlighted,
    isEdgeHighlighted,
  };
};
