/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Icon } from '@iconify/react';
import { Badge, Box, Button, styled } from '@mui/material';
import { Handle, NodeProps, Position, useEdges, useNodes } from '@xyflow/react';
import { memo, startTransition, useEffect, useRef, useState } from 'react';
import { KubeObjectNode } from '../graph/graphModel';
import { useGraphView } from '../GraphView';
import { KubeIcon } from '../kubeIcon/KubeIcon';
import { KubeObjectGlance } from '../KubeObjectGlance';
import { useClickOutside } from '../useClickOutside';
import { getStatus } from './KubeObjectStatus';

export interface KubeNode {
  type: 'kubeObject';
  resource: any;
  id: string;
}

const Container = styled('div')<{
  isHovered: boolean;
  isFaded: boolean;
  isClicked: boolean;
  isSelected: boolean;
}>(({ theme, isHovered, isFaded, isClicked, isSelected }) => ({
  display: 'flex',
  flexDirection: 'column',
  zIndex: isHovered || isClicked ? 1 : undefined,
  opacity: isFaded && !isHovered && !isClicked ? 0.5 : undefined,
  filter: isFaded && !isHovered && !isClicked ? 'grayscale(0.0)' : undefined,

  width: isClicked ? 'auto' : '100%!important',
  minWidth: isClicked ? '300px' : '100%',

  position: isClicked ? 'absolute' : undefined,
  background: theme.palette.background.paper,
  borderRadius: '10px',
  border: '1px solid #e3e3e3',

  borderColor: isSelected ? theme.palette.action.active : theme.palette.divider,

  boxShadow: isHovered || isClicked ? '4px 4px 6px rgba(0,0,0,0.06)' : undefined,
  transform: isHovered || isClicked ? 'translateY(-2px)' : undefined,

  padding: isClicked ? '16px' : '10px',
  marginLeft: isClicked ? '-6px' : 0,
  marginTop: isClicked ? '-6px' : 0,

  transition: 'all 0.05s',
}));

export const KubeObjectNodeComponent = memo(
  ({ data, id }: NodeProps & { data: KubeObjectNode['data'] }) => {
    const [isHovered, setHovered] = useState(false);
    const [isClicked, setClicked] = useState(false);

    const graph = useGraphView();
    const nodes = useNodes();
    const edges = useEdges();

    const resource = data.resource;

    const isSelected = id === graph.nodeSelection;
    const isHighlighted = graph.highlights.isNodeHighlighted(id);

    const status = getStatus(data.resource) ?? 'success';

    const nodeRef = useRef<HTMLElement>(null);

    useClickOutside(nodeRef, e => {
      if (isClicked) {
        if ((e.target as any)?.className?.includes?.('react-flow__pane')) {
          e.stopPropagation();
          e.preventDefault();
        }
        setClicked(false);
      }
    });

    useEffect(() => {
      if (nodeRef.current && nodeRef.current.parentElement) {
        let index = '0';
        if (isSelected) index = '1003';
        if (isClicked) index = '1004';
        if (isHovered) index = '1005';
        nodeRef.current.parentElement.style.zIndex = index;
      }
    }, [isSelected, isHovered, isClicked]);

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

    return (
      <Container
        isHovered={isHovered}
        isClicked={isClicked}
        isFaded={!isHighlighted}
        isSelected={isSelected}
        ref={nodeRef as any}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => startTransition(() => graph.highlights.setHighlight(undefined))}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => {
          setHovered(false);
        }}
        onClick={() => setClicked(true)}
      >
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
        <Box display="flex" gap={1}>
          {status !== 'success' ? (
            <Badge
              badgeContent={
                <Icon icon={status === 'error' ? 'mdi:exclamation' : 'mdi:information'} />
              }
              sx={{
                position: 'relative',
                width: '42px',
                height: '42px',
                transition: 'all',
                transitionDuration: '0.1s',
              }}
              overlap="circular"
              color={'error'}
              variant={isHovered ? undefined : 'dot'}
            >
              {icon}
            </Badge>
          ) : (
            icon
          )}

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
        {isClicked && (
          <>
            <KubeObjectGlance resource={resource} />

            <Button
              sx={{ alignSelf: 'flex-end', marginTop: 2 }}
              startIcon={<Icon icon="mdi:more-horiz" />}
              variant="outlined"
              size="small"
              onClick={() => {
                graph.setNodeSelection(id);
                setHovered(false);
                graph.highlights.setHighlight(undefined);
                setTimeout(() => {
                  setClicked(false);
                });
              }}
            >
              Details
            </Button>
          </>
        )}
      </Container>
    );
  }
);
