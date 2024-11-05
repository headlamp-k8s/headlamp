import { Icon } from '@iconify/react';
import { alpha, Box, styled, useTheme } from '@mui/material';
import { NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';
import { getMainNode } from '../graph/graphGrouping';
import { KubeGroupNode } from '../graph/graphModel';
import { useGraphView } from '../GraphView';
import { KubeIcon } from '../kubeIcon/KubeIcon';
import { getStatus } from './KubeObjectStatus';

const Container = styled('div')<{ isFaded: boolean; isCollapsed: boolean }>(
  ({ theme, isFaded, isCollapsed }) => ({
    display: 'flex',
    opacity: isFaded ? 0.6 : undefined,
    filter: isFaded ? 'grayscale(1.0)' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100% !important',
    height: '100%',
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.divider,
    borderRadius: '10px',
    transition: 'all 0.05s',
    transitionTimingFunction: 'linear',

    boxShadow: isCollapsed ? undefined : '6px 6px 12px rgba(0,0,0,0.03)',

    ':hover': {
      boxShadow: isCollapsed ? '2px 2px 6px rgba(0,0,0,0.05)' : undefined,
      marginTop: isCollapsed ? '-4px' : undefined,
      borderColor: isCollapsed ? alpha(theme.palette.action.active, 0.25) : undefined,
    },
  })
);

const CircleBadge = styled('div')<{ isHovered: boolean }>(({ theme, isHovered }) => ({
  position: 'absolute',
  right: 0,
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
  top: isHovered ? '-4px' : 0,
}));

const FakeContainer = styled('div')<{ isHovered: boolean }>(({ theme, isHovered }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',

  top: 0,
  left: 0,
  background: theme.palette.background.paper,
  border: '1px solid',
  borderRadius: '10px',
  transition: 'all 0.025s',
  transitionTimingFunction: 'linear',
  boxShadow: isHovered ? '2px 2px 6px rgba(0,0,0,0.05)' : undefined,
  borderColor: isHovered ? alpha(theme.palette.action.active, 0.25) : theme.palette.divider,
}));

export const KubeGroupNodeComponent = memo(
  ({ data, id }: NodeProps & { data: KubeGroupNode['data'] }) => {
    const theme = useTheme();
    const graph = useGraphView();

    const someHighlighted = data.nodes.length
      ? data?.nodes?.some(it => graph.highlights.isNodeHighlighted(it.id))
      : true;

    const errors =
      data?.nodes?.filter(it => getStatus(it?.data?.resource) === 'error')?.length ?? 0;
    const warnings =
      data?.nodes?.filter(it => getStatus(it?.data?.resource) === 'warning')?.length ?? 0;

    const status = errors > 0 ? 'error' : warnings > 0 ? 'warning' : 'success';

    const firstResource = getMainNode(data?.nodes ?? [])?.data?.resource;

    const isCollapsed = !!data.collapsed;

    const [isHovered, setIsHovered] = useState(false);
    const isHighlighted = someHighlighted || graph.highlights.isNodeHighlighted(id);

    const icon = <KubeIcon kind={firstResource.kind} width="42px" height="42px" />;

    const handleSelect = () => {
      graph.setNodeSelection(id);
      graph.highlights.setHighlight(undefined);
    };

    return (
      <Container
        tabIndex={0}
        role="button"
        isFaded={!(isHovered || isHighlighted)}
        isCollapsed={isCollapsed}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleSelect}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Space') {
            handleSelect();
          }
        }}
      >
        {isCollapsed && <CircleBadge isHovered={isHovered}>{data?.nodes?.length ?? 0}</CircleBadge>}
        {isCollapsed && status !== 'success' && (
          <CircleBadge sx={{ right: '36px' }} isHovered={isHovered}>
            <Icon
              color={theme.palette[status].main}
              icon={status === 'error' ? 'mdi:exclamation' : 'mdi:information'}
              width="22px"
              height="22px"
            />
          </CircleBadge>
        )}
        {firstResource && (
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            width="100%"
            height="100%"
            sx={{ position: 'relative', opacity: isCollapsed ? 1 : 0, padding: '0 10px' }}
          >
            {(data?.nodes?.length ?? 0) > 1 && (
              <FakeContainer
                isHovered={isHovered}
                sx={{
                  zIndex: '-1',
                  transform: isHovered ? 'translate(5px, 7px)' : 'translate(5px, 5px)',
                }}
              />
            )}
            {(data?.nodes?.length ?? 0) > 2 && (
              <FakeContainer
                isHovered={isHovered}
                sx={{
                  zIndex: '-2',
                  transform: isHovered ? 'translate(9px, 13px)' : 'translate(9px, 9px)',
                }}
              />
            )}

            {icon}

            <Box display="flex" flexDirection="column" overflow="hidden">
              <Box sx={{ opacity: 0.7 }} fontSize={14}>
                {firstResource.kind}
              </Box>
              <Box
                textOverflow="ellipsis"
                overflow="hidden"
                whiteSpace="nowrap"
                title={firstResource.metadata.name}
              >
                {firstResource.metadata.name}
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    );
  }
);
