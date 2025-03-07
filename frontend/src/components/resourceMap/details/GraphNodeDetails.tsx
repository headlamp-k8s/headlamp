import { Box, Card } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../../common';
import { GraphNode } from '../graph/graphModel';
import { KubeObjectDetails } from './KubeNodeDetails';

export interface GraphNodeDetailsProps {
  /** Node to display */
  node?: GraphNode;
  /** Callback when the panel is closed */
  close: () => void;
}

/**
 * Side panel display information about a selected Node
 */
export function GraphNodeDetails({ node, close }: GraphNodeDetailsProps) {
  const { t } = useTranslation();

  if (!node) return null;

  const hasContent = node.detailsComponent || node.kubeObject;
  if (!hasContent) return null;

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

      {node.detailsComponent && <node.detailsComponent node={node} />}
      {node.kubeObject && <KubeObjectDetails resource={node.kubeObject} />}
    </Card>
  );
}
