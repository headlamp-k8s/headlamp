import { alpha, Box } from '@mui/material';
import { NodeProps } from '@xyflow/react';
import { memo } from 'react';
import { KubeIcon } from '../kubeIcon/KubeIcon';

export const NodeGroupNode = memo(({ data }: NodeProps) => {
  return (
    <Box
      sx={theme => ({
        // background: '#FFF',
        // background: 'rgba(255,255,255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100% !important',
        height: '100%',
        // background: data.errors ? alpha(theme.palette.error.main, 0.3) : alpha('#333', 0.02),
        background: data.collapsed ? alpha('#f8f8f8', 0.5) : 'transparent',
        border: '1px solid transparent',
        borderColor: data.collapsed ? 'transparent' : theme.palette.tables.head.borderColor,
        borderRadius: '10px',
        padding: '0px',
        cursor: data.collapsed ? 'pointer' : undefined,

        ':hover': {
          // background: data.collapsed ? '#f8f8f899' : 'transparent',
          borderColor: data.collapsed ? '#ccc' : undefined,
        },
      })}
    >
      <Box sx={{ position: 'relative', padding: '10px', opacity: data.collapsed ? 1 : 0 }}>
        <KubeIcon
          kind="Pod"
          width="32px"
          height="32px"
          variant={data.errors > 0 ? 'red' : 'green'}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            fontSize: '12px',
            background: '#eee',
            padding: '0 4px',
            borderRadius: '4px',
          }}
        >
          {data.errors > 0 && (
            <Box
              sx={theme => ({
                display: 'inline',
                color: theme.palette.error.main,
              })}
            >
              {data.errors}/
            </Box>
          )}

          {data.elements}
        </Box>
      </Box>
      {!data.collapsed && (
        <Box
          sx={theme => ({
            position: 'absolute',
            top: '-8px',
            whiteSpace: 'nowrap',
            borderRadius: '8px',
            padding: '0 8px',
            fontSize: '14px',
            color: '#8f8f8f',
            background: theme.palette.tables.body.background,
            maxWidth: '100%',
            border: '1px solid ' + theme.palette.tables.head.borderColor,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          })}
        >
          {data?.label ?? 'no name'}
        </Box>
      )}
      <Box
        sx={{
          position: 'absolute',
          opacity: data.collapsed ? 1 : 0,
          // top: '-4px',
          top: '0',
          whiteSpace: 'nowrap',
          borderRadius: '8px',
          padding: '3px 6px',
          fontSize: '14px',
          color: '#8f8f8f',
          // background: theme.palette.tables.body.background,
          maxWidth: '100%',
          // border: '1px solid ' + theme.palette.tables.head.borderColor,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {data?.label ?? 'no name'}
      </Box>
    </Box>
  );
});
