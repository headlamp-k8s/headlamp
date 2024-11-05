import { Box, Breadcrumbs, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GraphNode, isGroup } from './graph/graphModel';

/**
 * Find a path in graph from root to the selected node
 */
function findSelectionPath(graph: GraphNode, selectedNodeId?: string) {
  function dfs(node: GraphNode, path: GraphNode[]): GraphNode[] | null {
    path.push(node);

    if (node.id === selectedNodeId) {
      return path;
    }

    if (isGroup(node)) {
      for (const child of node.data.nodes) {
        const result = dfs(child, path);
        if (result) {
          return result;
        }
      }
    }

    path.pop();
    return null;
  }

  const result = dfs(graph, []);
  return result || [];
}

export interface SelectionBreadcrumbsProps {
  /** The graph in which to search the selected node */
  graph: GraphNode;
  /** The ID of the selected node */
  selectedNodeId?: string;
  /** Callback when a node is clicked */
  onNodeClick: (id: string) => void;
}

export function SelectionBreadcrumbs({
  graph,
  selectedNodeId,
  onNodeClick,
}: SelectionBreadcrumbsProps) {
  const { t } = useTranslation();
  const path = findSelectionPath(graph, selectedNodeId);

  return (
    <Breadcrumbs maxItems={4}>
      {path.map((it, i) => {
        const getLabel = (node: GraphNode) => {
          if (node.type === 'kubeObject') {
            return node.data.resource.metadata.name;
          }
          if (node.id === 'root') {
            return t('translation|Home');
          }
          return node.data.label;
        };
        return i === path.length - 1 ? (
          <Box key={it.id}>{getLabel(it)}</Box>
        ) : (
          <Link
            key={it.id}
            href="#"
            onClick={() => onNodeClick(it.id)}
            sx={{
              textTransform: 'unset',
              maxWidth: '200px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {getLabel(it)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
