import Box from '@material-ui/core/Box';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ITerminalOptions, Terminal as XTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import ActionButton from './ActionButton';
import { Dialog, DialogProps } from './Dialog';

interface styleProps {
  isFullScreen: boolean;
}

const useStyle = makeStyles(theme => ({
  dialogContent: {
    height: '80%',
    minHeight: '80%',
    display: 'flex',
    flexDirection: 'column',
    '& .xterm ': {
      height: '100vh', // So the terminal doesn't stay shrunk when shrinking vertically and maximizing again.
      '& .xterm-viewport': {
        width: 'initial !important', // BugFix: https://github.com/xtermjs/xterm.js/issues/3564#issuecomment-1004417440
      },
    },
    '& #xterm-container': {
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      '& .terminal.xterm': {
        padding: 10,
      },
    },
  },
  logBox: {
    paddingTop: theme.spacing(1),
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  terminalCode: {
    color: theme.palette.common.white,
  },
  terminal: {
    backgroundColor: theme.palette.common.black,
    height: ({ isFullScreen }: styleProps) => (isFullScreen ? '100vh' : '500px'),
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
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const classes = useStyle({ isFullScreen });
  const { t } = useTranslation('frequent');
  const xtermRef = React.useRef<XTerminal | null>(null);
  const fitAddonRef = React.useRef<any>(null);
  const [terminalContainerRef, setTerminalContainerRef] = React.useState<HTMLElement | null>(null);

  const XterminalReadonlyConfig: ITerminalOptions = {
    cursorStyle: 'bar',
    scrollback: 10000,
    rows: 30, // initial rows before fit
    lineHeight: 1.21,
  };

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
    if (!terminalContainerRef || !!xtermRef.current) {
      return;
    }

    fitAddonRef.current = new FitAddon();
    xtermRef.current = new XTerminal(XterminalReadonlyConfig);
    xtermRef.current.loadAddon(fitAddonRef.current);

    xtermRef.current.open(terminalContainerRef!);

    fitAddonRef.current!.fit();

    xtermRef.current?.write(getJointLogs());

    const pageResizeHandler = () => {
      fitAddonRef.current!.fit();
      console.debug('resize');
    };
    window.addEventListener('resize', pageResizeHandler);

    return function cleanup() {
      window.removeEventListener('resize', pageResizeHandler);
      xtermRef.current?.dispose();
      xtermRef.current = null;
    };
  }, [terminalContainerRef, xtermRef.current]);

  React.useEffect(() => {
    if (!xtermRef.current) {
      return;
    }

    xtermRef.current?.write(getJointLogs());

    return function cleanup() {};
  }, [logs, xtermRef]);

  function getJointLogs() {
    return logs?.join('').replaceAll('\n', '\r\n');
  }

  return (
    <Dialog
      title={title}
      withFullScreen
      onFullScreenToggled={setIsFullScreen}
      onClose={onClose}
      {...other}
    >
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
            <ActionButton
              description={t('Download')}
              onClick={downloadLog}
              icon="mdi:file-download-outline"
            />
          </Grid>
        </Grid>
        <Box className={classes.logBox}>
          <div
            id="xterm-container"
            ref={ref => setTerminalContainerRef(ref)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse' }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
