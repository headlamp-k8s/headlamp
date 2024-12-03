import { Box, Card } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../../common';
import { GraphNode, KubeObjectNode } from '../graph/graphModel';
import { KubeObjectDetails } from './KubeNodeDetails';

interface GraphNodeDetailsSection {
  id: string;
  nodeType?: string;
  render: (node: GraphNode) => ReactNode;
}

const kubeNodeDetailsSection: GraphNodeDetailsSection = {
  id: 'kubeObjectDetails',
  nodeType: 'kubeObject',
  render: node => (
    <KubeObjectDetails key={node.id} resource={(node as KubeObjectNode).data.resource} />
  ),
};

const defaultSections = [kubeNodeDetailsSection];

export interface GraphNodeDetailsProps {
  /** Sections to render */
  sections?: GraphNodeDetailsSection[];
  /** Node to display */
  node: GraphNode;
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
          zIndex: 1,
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

      {sections.filter(it => it.nodeType === node.type).map(it => it.render(node))}
    </Card>
  );
}
