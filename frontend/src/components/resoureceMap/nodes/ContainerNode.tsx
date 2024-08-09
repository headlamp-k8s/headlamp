import { Box } from '@mui/material';
import { useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { KubeContainer, KubeContainerStatus } from '../../../lib/k8s/cluster';

export function ContainerNode(props: any) {
  const container: KubeContainer = props.data.container;
  const containerStatus: KubeContainerStatus = props.data.containerStatus;
  const state = containerStatus?.state;

  const [stateDetails, label, statusType] = useMemo(() => {
    let stateDetails: KubeContainerStatus['state']['waiting' | 'terminated'] | null = null;
    let label = 'Ready';
    let statusType: string = '';

    if (!state) {
      return [stateDetails, label, statusType];
    }

    if (!!state.waiting) {
      stateDetails = state.waiting;
      statusType = 'warning';
      label = 'Waiting';
    } else if (!!state.running) {
      statusType = 'success';
      label = 'Running';
    } else if (!!state.terminated) {
      stateDetails = state.terminated;
      if (state.terminated.exitCode === 0) {
        statusType = '';
        label = state.terminated.reason;
      } else {
        statusType = 'error';
        label = 'Error';
      }
    }

    return [stateDetails, label, statusType];
  }, [state]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%!important',
        height: '100%',
        padding: '5px',
        borderRadius: '5px',

        border: '1px solid',
        borderColor: statusType === 'warning' || statusType === 'error' ? 'red' : '#555',

        overflow: 'hidden',
        cursor: 'pointer',

        ':hover': {
          borderColor: '#999',
          background: '#2323238c',
        },
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#555', opacity: 0 }} />

      {container.name}
      {label}
      {/* {containerStatus.state.running} */}
    </Box>
  );
}
