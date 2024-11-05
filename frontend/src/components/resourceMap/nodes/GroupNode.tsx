import { alpha, styled } from '@mui/material';
import { NodeProps } from '@xyflow/react';
import { memo } from 'react';
import { GroupNode } from '../graph/graphModel';
import { useGraphView } from '../GraphView';

const Container = styled('div')<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  width: '100%',
  height: '100%',
  transition: 'border-color 0.1s',
  background: alpha(theme.palette.background.paper, 0.6),
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: theme.spacing(1.5),
  ':hover': {
    borderColor: isSelected ? undefined : alpha(theme.palette.action.active, 0.4),
  },
}));

const Label = styled('div')(({ theme }) => ({
  position: 'absolute',
  fontSize: '16px',
  top: '-16px',
  background: theme.palette.background.paper,
  left: '22px',
  padding: '4px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 'calc(100% - 52px)',
  color: alpha(theme.palette.text.primary, 0.6),
  borderRadius: 2,
}));

export const GroupNodeComponent = memo(({ id, data }: NodeProps & { data: GroupNode['data'] }) => {
  const graph = useGraphView();
  const isSelected = id === graph.nodeSelection;

  const handleSelect = () => {
    graph.setNodeSelection(id);
    graph.highlights.setHighlight(undefined);
  };

  return (
    <Container
      tabIndex={0}
      role="button"
      isSelected={isSelected}
      onClick={handleSelect}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === 'Space') {
          handleSelect();
        }
      }}
    >
      <Label title={data.label}>{data.label}</Label>
    </Container>
  );
});
