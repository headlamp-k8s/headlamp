import { Card } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../../common/Loader';

export interface CommandDialogProps {
  /** Is the dialog open? */
  open: boolean;
  /** Function to call when the dialog is closed */
  onClose: () => void;
  /** Function to call when the user confirms the action */
  onConfirm: (data: { clusterName: string }) => void;
  /** Command to run, like stop, start, delete... */
  command: string;
  /** The title of the form */
  title?: string;
  /** Is the command about to run? */
  acting: boolean;
  /** Command is actually running. There is some time before running where it can still be cancelled. */
  running: boolean;
  /** Output lines coming from the command. */
  actingLines?: string[];
  /** Is the command done? */
  commandDone: boolean;
  /** should it use a dialog or use a grid? */
  useGrid?: boolean;
  /** The cluster context to act on */
  initialClusterName?: string;
  /** Ask for the cluster name. Otherwise the initialClusterName is used. */
  askClusterName?: boolean;
}

/**
 * A form to confirm a command on a cluster.
 */
export default function CommandDialog({
  open,
  onClose,
  onConfirm,
  command,
  title,
  acting,
  running,
  actingLines,
  commandDone,
  useGrid,
  initialClusterName,
  askClusterName,
}: CommandDialogProps) {
  const { t } = useTranslation();
  const [clusterName, setClusterName] = React.useState(initialClusterName);

  if (acting && open && !running) {
    if (askClusterName) {
      return <Loader title={`Loading data for ${title}`} />;
    } else {
      return null;
    }
  }

  const content = (
    <>
      {!askClusterName && !acting && (
        <Typography>
          {t(
            'translation|Are you sure you want to "{{ command }}" the cluster "{{ clusterName }}"?',
            {
              clusterName,
              command,
            }
          )}
        </Typography>
      )}

      {askClusterName && (
        <FormControl fullWidth>
          <Box pt={2}>
            <TextField
              id="cluster-name-input"
              label="Cluster Name"
              value={clusterName}
              onChange={function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
                setClusterName(event.target.value);
              }}
              variant="outlined"
            />
          </Box>
        </FormControl>
      )}
      {running && !commandDone && <Loader title={`Loading data for ${title}`} />}

      {acting && actingLines && Array.isArray(actingLines) && actingLines.length > 0 && (
        <Card variant="outlined" sx={{ mt: 2, p: 2 }}>
          {actingLines.map((line, index) => (
            <Typography key={index} variant="body1">
              {line}
            </Typography>
          ))}
        </Card>
      )}
    </>
  );

  const actions = (
    <>
      {!acting && (
        <DialogActions>
          {!useGrid && <Button onClick={onClose}>Cancel</Button>}
          <Button
            onClick={() => {
              if (clusterName) {
                onConfirm({ clusterName });
              }
            }}
          >
            {t('translation|{{ command }}', { command })}
          </Button>
        </DialogActions>
      )}
      {!useGrid && commandDone && (
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      )}
    </>
  );

  return useGrid ? (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">{title}</Typography>
      </Grid>
      <Grid item xs={12}>
        {content}
      </Grid>
      <Grid item xs={6}>
        {actions}
      </Grid>
    </Grid>
  ) : (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      {actions}
    </Dialog>
  );
}
