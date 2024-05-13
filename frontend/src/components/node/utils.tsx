import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/system';
import Node from '../../lib/k8s/node';

const WrappingBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'left',
  flexWrap: 'wrap',
  '& > *': {
    margin: theme.spacing(0.5),
  },
}));

const PaddedChip = styled(Chip)({
  paddingTop: '2px',
  paddingBottom: '2px',
});

export function NodeTaintsLabel(props: { node: Node }) {
  const { node } = props;
  if (node.spec?.taints === undefined) {
    return <WrappingBox></WrappingBox>;
  }
  const limits: JSX.Element[] = [];
  node.spec.taints.forEach(taint => {
    limits.push(
      <Tooltip title={`${taint.key}:${taint.effect}`}>
        <PaddedChip label={`${taint.key}:${taint.effect}`} variant="outlined" size="small" />
      </Tooltip>
    );
  });
  return <WrappingBox>{limits}</WrappingBox>;
}
