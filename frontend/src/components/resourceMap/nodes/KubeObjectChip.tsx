import { Box, styled } from '@mui/material';
import { KubeObject } from '../../../lib/k8s/cluster';
import { KubeIcon } from '../kubeIcon/KubeIcon';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',

  background: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  border: '1px solid #e3e3e3',

  borderColor: theme.palette.divider,

  padding: theme.spacing(1),
}));

export function KubeObjectChip({ resource }: { resource: KubeObject }) {
  return (
    <Container>
      <Box display="flex" gap={1}>
        <KubeIcon width="42px" height="42px" kind={resource.kind} />
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
    </Container>
  );
}
