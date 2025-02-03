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
  /**
   * Title of the dialog box
   */
  title: string;
  /**
   * Description of the dialog box
   */
  description: string | React.ReactNode;
  /*
   * Description of the checkbox
   * Note: If this is provided, an additional description will be rendered under the original and will require the checkbox to continue action.
   */
  checkboxDescription?: string;
  onConfirm: () => void;
  handleClose: () => void;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const { onConfirm, open, handleClose, title, description } = props;
  const { t } = useTranslation();
  const [checkedChoice, setcheckedChoice] = React.useState(false);

  function onConfirmationClicked() {
    handleClose();
    onConfirm();
  }

  function closeDialog() {
    setcheckedChoice(false);
    handleClose();
  }

  function handleChoiceToggle() {
    setcheckedChoice(!checkedChoice);
  }

  const focusedRef = React.useCallback((node: HTMLElement) => {
    if (node !== null) {
      node.setAttribute('tabindex', '-1');
      node.focus();
    }
  }, []);

  return (
    <div>
      <MuiDialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent ref={focusedRef}>
          <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
          {props.checkboxDescription && (
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
              <Checkbox checked={checkedChoice} onChange={handleChoiceToggle} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              closeDialog();
            }}
            color="primary"
          >
            {t('No')}
          </Button>
          {props.checkboxDescription ? (
            <Button disabled={!checkedChoice} onClick={onConfirmationClicked} color="primary">
              {t('I Agree')}
            </Button>
          ) : (
            <Button onClick={onConfirmationClicked} color="primary">
              {t('Yes')}
            </Button>
          )}
        </DialogActions>
      </MuiDialog>
    </div>
  );
}

export default ConfirmDialog;
