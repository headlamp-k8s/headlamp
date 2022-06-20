import Button from '@material-ui/core/Button';
import MuiDialog, { DialogProps as MuiDialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
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
  const { t } = useTranslation('frequent');

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
