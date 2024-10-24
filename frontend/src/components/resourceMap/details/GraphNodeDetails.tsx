import { Icon } from '@iconify/react';
import { Button, Card } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GraphNode, KubeObjectNode } from '../graph/graphModel';
import { KubeObjectDetails } from './KubeNodeDetails';

interface GraphNodeDetailsSection {
  id: string;
  nodeType?: string;
  render: (node: GraphNode) => any;
}

const kubeNodeDetailsSection: GraphNodeDetailsSection = {
  id: 'kubeObjectDetails',
  nodeType: 'kubeObject',
  render: node => <KubeObjectDetails resource={(node as KubeObjectNode).data.resource} />,
};

const defaultSections = [kubeNodeDetailsSection];

/**
 * Side panel display information about a selected Node
 */
export function GraphNodeDetails({
  sections = defaultSections,
  node,
  close,
}: {
  sections?: GraphNodeDetailsSection[];
  node: GraphNode;
  close: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Card
      sx={theme => ({
        margin: '0',
        padding: '1rem',
        width: '900px',
        overflowY: 'auto',
        flexShrink: 0,
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
      <Button
        onClick={() => {
          close();
        }}
        startIcon={<Icon icon="mdi:close" />}
      >
        {t('Close')}
      </Button>
      {sections.filter(it => it.nodeType === node.type).map(it => it.render(node))}
    </Card>
  );
}
