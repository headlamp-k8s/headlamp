import { Checkbox } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiDialog, { DialogProps as MuiDialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogTitle } from './Dialog';

export interface ConfirmDialogProps extends MuiDialogProps {
  title: string;
  description: string | JSX.Element;
  checkboxDescription?: string;
  onConfirm: () => void;
  handleClose: () => void;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const { onConfirm, open, handleClose, title, description } = props;
  const { t } = useTranslation();

  const [checkboxClicked, setCheckboxClicked] = React.useState(false);

  function onConfirmationClicked() {
    handleClose();
    onConfirm();
  }

  const focusedRef = React.useCallback((node: HTMLElement) => {
    if (node !== null) {
      node.setAttribute('tabindex', '-1');
      node.focus();
    }
  }, []);

  if (props.checkboxDescription) {
    return (
      <div>
        <MuiDialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent ref={focusedRef}>
            <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
              }}
            >
              <DialogContentText id="alert-dialog-description">
                {props.checkboxDescription}
              </DialogContentText>
              <Checkbox onChange={() => setCheckboxClicked(!checkboxClicked)} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {t('Cancel')}
            </Button>
            <Button disabled={!checkboxClicked} onClick={onConfirmationClicked} color="primary">
              {t('I Agree')}
            </Button>
          </DialogActions>
        </MuiDialog>
      </div>
    );
  }

  return (
    <div>
      <MuiDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent ref={focusedRef}>
          <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('No')}
          </Button>
          <Button onClick={onConfirmationClicked} color="primary">
            {t('Yes')}
          </Button>
        </DialogActions>
      </MuiDialog>
    </div>
  );
}

export default ConfirmDialog;
