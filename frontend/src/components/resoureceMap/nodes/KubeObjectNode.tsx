import { Box, useTheme } from '@mui/material';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { memo } from 'react';
import { useGraphView } from '../GraphView';
import { KubeIcon } from '../kubeIcon/KubeIcon';
import { getStatus } from './KubeObjectStatus';

export interface KubeObjectNode {
  type: 'kubeObject';
  resource: any;
  id: string;
}

export const KubeObjectNodeComponent = memo(({ data, id }: NodeProps) => {
  const graph = useGraphView();
  const tiny = data.tiny;

  const resource = data.resource;

  const status = getStatus(data.resource) ?? 'success';

  const theme = useTheme();
  const statusColor = theme.palette[status]?.light ?? theme.palette.normalEventBg;

  const isSelected = id === graph.nodeSelection;

  return (
    <Box
      sx={theme => ({
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        width: '100%!important',
        height: '100%',
        cursor: 'pointer',
        borderRadius: '50%',

        ':hover': {
          borderColor: '#333',
          background: theme.palette.action.hover,
        },
      })}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#555', opacity: 0 }} />

      <KubeIcon
        kind={resource.kind}
        variant={
          (
            {
              error: 'red',
              success: 'green',
              warning: 'yellow',
            } as const
          )[status]
        }
      />

      {/* <IconComponent
        width="100%"
        height="100%"
        style={{ flexShrink: 0, background: statusColor, borderRadius: '5px' }}
      /> */}

      {!tiny && (
        <Box
          sx={{
            position: 'absolute',
            top: '-20px',
            fontSize: '12px',
            maxWidth: isSelected ? '300px' : '100px',
            lineHeight: '1.2',
            color: isSelected ? '#FFF' : '#8f8f8f',
            padding: '4px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            background: isSelected ? '#484740' : 'transparent',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '20px',
          }}
        >
          {resource.metadata.name}
        </Box>
      )}

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </Box>
  );
});

export const GroupNodeComponent = memo(({ data }: NodeProps) => {
  return (
    <Box
      sx={{
        // background: '#FFF',
        // background: 'rgba(255,255,255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        width: '100% !important',
        height: '100%',
        background: '#2323238c',
        border: '1px solid #555',
        borderRadius: '10px',
        padding: '0px',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-8px',
          background: '#2323238c',
          whiteSpace: 'nowrap',
          width: 'calc(100% - 20px)',
          overflow: 'hidden',
          fontSize: '12px',
          color: '#8f8f8f',
        }}
      >
        {data?.label ?? 'no name'}
      </Box>
    </Box>
  );
});
