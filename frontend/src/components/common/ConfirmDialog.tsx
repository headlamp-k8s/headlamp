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
  description: string;
  onConfirm: () => void;
  handleClose: () => void;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const { onConfirm, open, handleClose, title, description } = props;
  const { t } = useTranslation();

  function onConfirmationClicked() {
    handleClose();
    onConfirm();
  }

  const focusedRef = React.useCallback(node => {
    if (node !== null) {
      node.setAttribute('tabindex', '-1');
      node.focus();
    }
  }, []);

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
