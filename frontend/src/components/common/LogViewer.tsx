import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Ansi from 'ansi-to-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogProps } from './Dialog';

const useStyle = makeStyles(theme => ({
  dialogContent: {
    height: '80%',
    minHeight: '80%',
  },
  terminalCode: {
    color: theme.palette.common.white,
  },
  terminal: {
    backgroundColor: theme.palette.common.black,
    height: '500px',
    width: '100%',
    overflow: 'scroll',
    marginTop: theme.spacing(3),
  },
  containerFormControl: {
    minWidth: '11rem',
  },
}));

export interface LogViewerProps extends DialogProps {
  logs: string[];
  title?: string;
  downloadName?: string;
  onClose: () => void;
  topActions?: JSX.Element[];
  open: boolean;
}

export function LogViewer(props: LogViewerProps) {
  const { logs, title = '', downloadName = 'log', onClose, topActions = [], ...other } = props;
  const classes = useStyle();
  const logsBottomRef = React.useRef<HTMLDivElement>(null);
  const { t } = useTranslation('frequent');

  function downloadLog() {
    const element = document.createElement('a');
    const file = new Blob(logs, { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${downloadName}.txt`;
    // Required for FireFox
    document.body.appendChild(element);
    element.click();
  }

  React.useEffect(() => {
    // @todo: Only scroll down automatically if the view hasn't been scrolled up by the user yet.
    if (logsBottomRef && logsBottomRef.current) {
      logsBottomRef.current.scrollIntoView();
    }
  }, [logs]);

  return (
    <Dialog title={title} withFullScreen onClose={onClose} {...other}>
      <DialogContent className={classes.dialogContent}>
        <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap">
          <Grid item container spacing={1}>
            {topActions.map((component, i) => (
              <Grid item key={i}>
                {component}
              </Grid>
            ))}
          </Grid>
          <Grid item xs>
            <Tooltip title={t('Download') as string}>
              <IconButton aria-label={t('download')} onClick={downloadLog}>
                <Icon icon="mdi:file-download-outline" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Box className={classes.terminal}>
          <pre>
            {logs.map((item, i) => (
              <Ansi className={classes.terminalCode} key={i} linkify={false}>
                {item}
              </Ansi>
            ))}
          </pre>
          <div ref={logsBottomRef} />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
