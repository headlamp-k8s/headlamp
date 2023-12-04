import { ApiProxy, Headlamp, registerAppBarAction } from '@kinvolk/headlamp-plugin/lib';
import { Button, Modal, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const request = ApiProxy.request;
const modalStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
};

function ClusterCreationButton() {
  const [open, setOpen] = useState(false);
  const [kubeconfig, setKubeconfig] = useState('');
  const [name, setName] = useState('');
  const [server, setServer] = useState('');
  const [isDynamicClusterEnabled, setIsDynamicClusterEnabled] = useState(false);

  useEffect(() => {
    // Fetch configuration from the backend when the component mounts
    request('/config', {}, false, false)
      .then((response: any) => {
        setIsDynamicClusterEnabled(response.isDynamicClusterEnabled);
      })
      .catch((error: any) => {
        console.error('Error fetching config:', error);
      });
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    if (isDynamicClusterEnabled) {
      // Handle kubeconfig submission
      Headlamp.setCluster({ kubeconfig })
        .then(() => {
          window.location.reload();
        })
        .catch((e: any) => {
          console.error('Error setting cluster', e);
        });
    } else {
      // Handle name and server submission
      Headlamp.setCluster({ name, server })
        .then(() => {
          window.location.reload();
        })
        .catch((e: any) => {
          console.error('Error setting cluster', e);
        });
    }

    handleClose();
  };

  return (
    <>
      <Button onClick={handleOpen}>New cluster</Button>
      <Modal open={open} onClose={handleClose} style={modalStyle}>
        <Paper style={{ padding: '16px', width: '400px' }}>
          <Stack spacing={2}>
            {/* Display the state of isDynamicClusterEnabled */}
            <Typography variant="body2" color="textSecondary">
              Stateless clusters enabled: {isDynamicClusterEnabled.toString()}
            </Typography>
            {isDynamicClusterEnabled ? (
              // Render kubeconfig input when dynamic clusters are enabled
              <TextField
                label="Please paste base64 encoded Kubeconfig"
                multiline
                rows={4}
                fullWidth
                value={kubeconfig}
                onChange={e => setKubeconfig(e.target.value)}
              />
            ) : (
              // Render name and server inputs when dynamic clusters are not enabled
              <>
                <TextField
                  label="Name"
                  fullWidth
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <TextField
                  label="Server"
                  fullWidth
                  value={server}
                  onChange={e => setServer(e.target.value)}
                />
              </>
            )}
            <Button onClick={handleSubmit}>Submit</Button>
          </Stack>
        </Paper>
      </Modal>
    </>
  );
}

registerAppBarAction(ClusterCreationButton);
