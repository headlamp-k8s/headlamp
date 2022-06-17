import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import MuiDialog, { DialogProps as MuiDialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogTitle, { DialogTitleProps } from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface OurDialogTitleProps extends DialogTitleProps {
  /** true if you want the title focused in the dialog */
  focusTitle?: boolean;
  buttons?: React.ReactNode[];
}

/**
 * This is like Material-ui DialogTitle but fixes some a11y issues.
 *
 * First, it needs a h1 because other page content is aria-diable=true'd
 *
 * Additionally, it also focuses the title text as that is where
 * reading can begin.
 */
export function DialogTitle(props: OurDialogTitleProps) {
  const { children, focusTitle, buttons, ...other } = props;

  const focusedRef = React.useCallback(node => {
    if (node !== null) {
      if (focusTitle) {
        node.setAttribute('tabindex', '-1');
        node.focus();
      }
    }
  }, []);

  return (
    <MuiDialogTitle style={{ display: 'flex' }} disableTypography {...other}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography
            ref={focusedRef}
            variant="h1"
            style={{
              fontSize: '1.25rem',
              fontWeight: 500,
              lineHeight: 1.6,
            }}
          >
            {children}
          </Typography>
        </Grid>
        <Grid item>{buttons && buttons.length > 0 && <Box>{buttons}</Box>}</Grid>
      </Grid>
    </MuiDialogTitle>
  );
}

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
