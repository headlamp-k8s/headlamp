import Box from '@material-ui/core/Box';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Ansi from 'ansi-to-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const logsBottomRef = React.useRef<HTMLDivElement>(null);
  const { t } = useTranslation('frequent');
  const [isScrolledUp, setIsScrolledUp] = React.useState(false);
  const scrollMargin = 15;

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
    if (logsBottomRef?.current && !isScrolledUp) {
      logsBottomRef.current.scrollIntoView();
    }
  }, [logs]);

  function handleScroll(event: any) {
    if (logsBottomRef?.current) {
      /* 
        - By default the log viewer shows the logs as they happen, scrolling to the bottom automatically like a terminal view
        - If the user scrolls the view up, even the tiniest bit, it should remain showing that portion of the log even if more logs arrive
        - If the user scrolls down to the bottom again, then new updates will keep the view at the bottom (i.e. it will show the latest contents)
      */
      const wrapperPosition = logsBottomRef.current.getBoundingClientRect().bottom;
      const scrollPosition = event.target.getBoundingClientRect().bottom + scrollMargin;
      /*  compare if the terminal wrapper bottom is in the scroll limit then the user is at 
          the bottom of the screen
      */
      const scrollAtBottom = Math.trunc(wrapperPosition) < Math.trunc(scrollPosition);
      if (scrollAtBottom) {
        setIsScrolledUp(false);
        return;
      }
    }

    setIsScrolledUp(true);
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
        <Box className={classes.terminal} onScroll={handleScroll}>
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
