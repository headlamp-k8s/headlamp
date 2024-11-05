import { Icon } from '@iconify/react';
import { alpha, Box, styled, useTheme } from '@mui/material';
import { Handle, NodeProps, Position, useEdges, useNodes } from '@xyflow/react';
import { memo, startTransition, useEffect, useRef, useState } from 'react';
import { KubeObjectNode } from '../graph/graphModel';
import { useGraphView } from '../GraphView';
import { KubeIcon } from '../kubeIcon/KubeIcon';
import { KubeObjectGlance } from '../KubeObjectGlance/KubeObjectGlance';
import { getStatus } from './KubeObjectStatus';

const Container = styled('div')<{
  isHovered: boolean;
  isExpanded: boolean;
  isFaded: boolean;
  isSelected: boolean;
}>(({ theme, isHovered, isFaded, isSelected, isExpanded }) => ({
  display: 'flex',
  flexDirection: 'column',
  zIndex: isHovered ? 1 : undefined,
  opacity: isFaded && !isHovered ? 0.5 : undefined,
  filter: isFaded && !isHovered ? 'grayscale(0.0)' : undefined,

  width: isExpanded ? 'auto' : '100%!important',
  minWidth: '100%',

  position: isHovered ? 'absolute' : undefined,
  background: theme.palette.background.paper,
  borderRadius: '10px',
  border: '1px solid #e3e3e3',

  borderColor: isSelected ? theme.palette.action.active : theme.palette.divider,

  boxShadow: isHovered ? '4px 4px 6px rgba(0,0,0,0.06)' : undefined,
  transform: isHovered ? 'translateY(-2px)' : undefined,
  padding: isExpanded ? '16px' : '10px',
  marginLeft: isExpanded ? '-6px' : 0,
  marginTop: isExpanded ? '-6px' : 0,

  transition: 'all 0.05s',

  ':hover': {
    borderColor: isSelected ? undefined : alpha(theme.palette.action.active, 0.2),
  },
}));

const CircleBadge = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(-1),
  justifyContent: 'center',
  background: theme.palette.background.paper,
  boxShadow: '1px 1px 5px rgba(0,0,0,0.08)',
  transition: 'top 0.05s',
  transitionTimingFunction: 'linear',
  border: '1px solid #e1e1e1',
  borderColor: theme.palette.divider,
  color: theme.typography.caption.color,
  top: 0,
  right: '12px',
}));

const EXPAND_DELAY = 450;

export const KubeObjectNodeComponent = memo(
  ({ data, id }: NodeProps & { data: KubeObjectNode['data'] }) => {
    const [isHovered, setHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const theme = useTheme();

    const graph = useGraphView();
    const nodes = useNodes();
    const edges = useEdges();

    const resource = data.resource;

    const isSelected = id === graph.nodeSelection;
    const isHighlighted = graph.highlights.isNodeHighlighted(id);

    const status = getStatus(data.resource) ?? 'success';

    const nodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (nodeRef.current && nodeRef.current.parentElement) {
        let index = '0';
        if (isSelected) index = '1003';
        if (isHovered) index = '1004';
        nodeRef.current.parentElement.style.zIndex = index;
      }
    }, [isSelected, isHovered]);

    useEffect(() => {
      if (!isHovered) {
        setIsExpanded(false);
        return;
      }

      const id = setTimeout(() => setIsExpanded(true), EXPAND_DELAY);
      return () => clearInterval(id);
    }, [isHovered]);

    const icon = <KubeIcon width="42px" height="42px" kind={resource.kind} />;

    function handleMouseEnter() {
      const relatedEdges = edges.filter(it => it.source === id || it.target === id);
      const relatedNodes = nodes.filter(node =>
        relatedEdges.find(edge => edge.source === node.id || edge.target === node.id)
      );

      if (relatedNodes.length > 1) {
        startTransition(() => {
          graph.highlights.setHighlight({
            label: undefined,
            nodeIds: new Set(relatedNodes?.map(it => it.id) ?? []),
            edgeIds: new Set(relatedEdges?.map(it => it.id) ?? []),
          });
        });
      }
    }

    const openDetails = () => {
      graph.setNodeSelection(id);
      setHovered(false);
      graph.highlights.setHighlight(undefined);
    };

    return (
      <Container
        tabIndex={0}
        role="button"
        isHovered={isHovered}
        isFaded={!isHighlighted}
        isSelected={isSelected}
        isExpanded={isExpanded}
        onClick={openDetails}
        ref={nodeRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => startTransition(() => graph.highlights.setHighlight(undefined))}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => {
          setHovered(false);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Space') {
            openDetails();
          }
        }}
      >
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

        {status !== 'success' && (
          <CircleBadge>
            <Icon
              color={theme.palette[status].main}
              icon={status === 'error' ? 'mdi:exclamation' : 'mdi:information'}
              width="22px"
              height="22px"
            />
          </CircleBadge>
        )}

        <Box display="flex" gap={1}>
          {icon}
          <Box display="flex" flexDirection="column" overflow="hidden">
            <Box sx={{ opacity: 0.7 }} fontSize={14}>
              {resource.kind}
            </Box>
            <Box
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: 'all 0.1s',
              }}
            >
              {resource.metadata.name}
            </Box>
          </Box>
        </Box>
        {isExpanded && <KubeObjectGlance resource={resource} />}
      </Container>
    );
  }
);
