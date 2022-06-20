import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import MuiDialog, { DialogProps as MuiDialogProps } from '@material-ui/core/Dialog';
import MuiDialogTitle, { DialogTitleProps } from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';

// We export the ConfirmDialog from here because it was declared in this file before being
// moved to its own.
export { ConfirmDialog } from './ConfirmDialog';
export type { ConfirmDialogProps } from './ConfirmDialog';

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

export interface DialogProps extends MuiDialogProps {
  withFullScreen?: boolean;
}

export function Dialog(props: DialogProps) {
  const { title, withFullScreen = false, children, ...other } = props;
  const [fullScreen, setFullScreen] = React.useState(false);
  const { t } = useTranslation('frequent');

  function handleFullScreen() {
    setFullScreen(fs => !fs);
  }

  function FullScreenButton() {
    if (!withFullScreen) {
      return null;
    }

    return (
      <Tooltip title={t('Toggle fullscreen')}>
        <IconButton aria-label={t('Toggle fullscreen')} onClick={handleFullScreen}>
          <Icon icon={`mdi:${fullScreen ? 'fullscreen-exit' : 'fullscreen'}`} />
        </IconButton>
      </Tooltip>
    );
  }

  function CloseButton() {
    return (
      <Tooltip title={t('Close')}>
        <IconButton
          aria-label={t('fullscreen')}
          onClick={() => {
            props.onClose && props.onClose({}, 'escapeKeyDown');
          }}
        >
          <Icon icon="mdi:close" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <MuiDialog
      maxWidth="lg"
      scroll="paper"
      fullWidth
      keepMounted
      fullScreen={fullScreen}
      {...other}
    >
      {(!!title || withFullScreen) && (
        <DialogTitle buttons={[<FullScreenButton />, <CloseButton />]}>{title}</DialogTitle>
      )}
      {children}
    </MuiDialog>
  );
}
