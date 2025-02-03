import { Box, Card } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../../common';
import { GraphNode } from '../graph/graphModel';
import { KubeObjectDetails } from './KubeNodeDetails';

interface GraphNodeDetailsSection {
  id: string;
  render: (node: GraphNode) => ReactNode;
}

const kubeNodeDetailsSection: GraphNodeDetailsSection = {
  id: 'kubeObjectDetails',
  render: node =>
    node.kubeObject ? (
      <KubeObjectDetails key={node.id} resource={(node as GraphNode).kubeObject!} />
    ) : null,
};

const defaultSections = [kubeNodeDetailsSection];

export interface GraphNodeDetailsProps {
  /** Sections to render */
  sections?: GraphNodeDetailsSection[];
  /** Node to display */
  node?: GraphNode;
  /** Callback when the panel is closed */
  close: () => void;
}

/**
 * Side panel display information about a selected Node
 */
export function GraphNodeDetails({
  sections = defaultSections,
  node,
  close,
}: GraphNodeDetailsProps) {
  const { t } = useTranslation();

  if (!node) return null;

  const renderedSections = sections.map(it => it.render(node)).filter(Boolean);

  if (renderedSections.length === 0) return null;

  return (
    <Card
      elevation={0}
      sx={theme => ({
        margin: '0',
        padding: '1rem',
        width: '900px',
        overflowY: 'auto',
        flexShrink: 0,
        borderLeft: '1px solid',
        borderColor: theme.palette.divider,
        [theme.breakpoints.down('xl')]: {
          width: '720px',
        },
        [theme.breakpoints.down('lg')]: {
          position: 'absolute',
          width: '100%',
          minWidth: '100%',
        },
      })}
    >
      <Box textAlign="right">
        <ActionButton
          onClick={() => {
            close();
          }}
          icon="mdi:close"
          description={t('Close')}
        />
      </Box>

      {renderedSections}
    </Card>
  );
}
