import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography/Typography';
import * as React from 'react';

export interface CreateClusterDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { clusterName: string }) => void;
  saveLabel?: string;
  errorMessage?: string;
  onEditorChanged: () => void;
  title?: string;
  /** When in the saving state. */
  saving: boolean;
  /** Lines to display when saving. */
  savingLines?: string[];
  /** when creating is done */
  creatingDone: boolean;
}

const CreateClusterDialog: React.FC<CreateClusterDialogProps> = ({
  open,
  onClose,
  onSave,
  saveLabel,
  errorMessage,
  onEditorChanged,
  title,
  saving,
  savingLines,
  creatingDone,
}) => {
  const [clusterName, setClusterName] = React.useState('');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClusterName(event.target.value);
    onEditorChanged();
  };

  if (open && saving && savingLines?.length === 0) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {!saving && (
            <FormControl fullWidth>
              <Box pt={2}>
                <TextField
                  id="cluster-name-input"
                  label="Cluster Name"
                  value={clusterName}
                  onChange={handleNameChange}
                  variant="outlined"
                />
              </Box>
            </FormControl>
          )}
          {errorMessage && <div>{errorMessage}</div>}
          {saving &&
            savingLines &&
            Array.isArray(savingLines) &&
            savingLines.map((line, index) => (
              <Typography key={index} variant="body1">
                {line}
              </Typography>
            ))}
        </DialogContent>
        {!saving && (
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => onSave({ clusterName })}>{saveLabel}</Button>
          </DialogActions>
        )}
        {creatingDone && (
          <DialogActions>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default CreateClusterDialog;
