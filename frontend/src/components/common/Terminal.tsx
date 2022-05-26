import 'xterm/css/xterm.css';
import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Terminal as XTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import Pod from '../../lib/k8s/pod';

const decoder = new TextDecoder('utf-8');
const encoder = new TextEncoder();

const useStyle = makeStyles(theme => ({
  dialogContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& .xterm ': {
      height: '500px', // So the terminal doesn't stay shrunk when shrinking vertically and maximizing again.
      '& .xterm-viewport': {
        width: 'initial !important', // BugFix: https://github.com/xtermjs/xterm.js/issues/3564#issuecomment-1004417440
      },
    },
    '& #xterm-container': {
      overflow: 'hidden',
      width: '100%',
      '& .terminal.xterm': {
        padding: 10,
      },
    },
  },
  containerFormControl: {
    minWidth: '11rem',
  },
  terminalBox: {
    paddingTop: theme.spacing(1),
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
}));

interface TerminalProps extends DialogProps {
  item: Pod;
  onClose?: () => void;
}

export default function Terminal(props: TerminalProps) {
  const { item, onClose, ...other } = props;
  const classes = useStyle();
  const [terminalContainerRef, setTerminalContainerRef] = React.useState<HTMLElement | null>(null);
  const [container, setContainer] = React.useState<string | null>(null);
  const execRef = React.useRef<any>(null);
  const fitAddonRef = React.useRef<any>(null);
  const xtermRef = React.useRef<any>(null);
  const { t } = useTranslation('resource');

  function getDefaultContainer() {
    return item.spec.containers.length > 0 ? item.spec.containers[0].name : '';
  }

  // @todo: Give the real exec type when we have it.
  function setupTerminal(containerRef: HTMLElement, xterm: XTerminal, fitAddon: FitAddon) {
    if (!containerRef) {
      return;
    }

    xterm.open(containerRef);

    xterm.onData(data => {
      send(0, data);
    });

    xterm.onResize(size => {
      send(4, `{"Width":${size.cols},"Height":${size.rows}}`);
    });

    // Allow copy/paste in terminal
    xterm.attachCustomKeyEventHandler(arg => {
      if (arg.ctrlKey && arg.type === 'keydown') {
        if (arg.code === 'KeyC') {
          const selection = xterm.getSelection();
          if (selection) {
            return false;
          }
        }
        if (arg.code === 'KeyV') {
          return false;
        }
      }
      return true;
    });

    fitAddon.fit();
  }

  function send(channel: number, data: string) {
    const socket = execRef.current.getSocket();

    // We should only send data if the socket is ready.
    if (!socket || socket.readyState !== 1) {
      console.debug('Could not send data to exec: Socket not ready...', socket);
      return;
    }

    const encoded = encoder.encode(data);
    const buffer = new Uint8Array([channel, ...encoded]);

    socket.send(buffer);
  }

  // Channels:
  // 0: stdin
  // 1: stdout
  // 2: stderr
  // 3: server error
  // 4: resize channel
  function onData(xterm: XTerminal, bytes: ArrayBuffer) {
    // Only show data from stdout, stderr and server error channel.
    const channel = new Int8Array(bytes.slice(0, 1))[0];
    if (channel < 1 || channel > 3) {
      return;
    }

    // The first byte is discarded because it just identifies whether
    // this data is from stderr, stdout, or stdin.
    const data = bytes.slice(1);
    const text = decoder.decode(data);

    if (bytes.byteLength < 2) {
      return;
    }

    // Send resize command to server once connection is establised.
    if (!(xterm as any).connected && !!text) {
      xterm.clear();
      (async function () {
        send(4, `{"Width":${xterm.cols},"Height":${xterm.rows}}`);
      })();
      (xterm as any).connected = true;
      console.debug('Terminal is now connected');
    }

    xterm.write(text);
  }

  React.useEffect(
    () => {
      // We need a valid container ref for the terminal to add itself to it.
      if (terminalContainerRef === null) {
        return;
      }

      // Don't do anything until the pod's container is assigned. We used the pod's late
      // assignment to prevent calling exec before the dialog is opened.
      if (container === null) {
        return;
      }

      if (xtermRef.current) {
        xtermRef.current.dispose();
        execRef.current?.cancel();
      }
      xtermRef.current = new XTerminal({
        cursorBlink: true,
        cursorStyle: 'underline',
        scrollback: 10000,
        rows: 30, // initial rows before fit
      });

      fitAddonRef.current = new FitAddon();
      xtermRef.current.loadAddon(fitAddonRef.current);
      (xtermRef.current as any).connected = false;

      xtermRef.current.writeln(t('Connecting…') + '\n');

      (async function () {
        execRef.current = await item.exec(container, (items: ArrayBuffer) =>
          onData(xtermRef.current, items)
        );

        setupTerminal(terminalContainerRef, xtermRef.current, fitAddonRef.current);
      })();

      const handler = () => {
        fitAddonRef.current.fit();
      };

      window.addEventListener('resize', handler);

      return function cleanup() {
        xtermRef.current.dispose();
        if (execRef.current) {
          execRef.current.cancel();
        }
        window.removeEventListener('resize', handler);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [container, terminalContainerRef]
  );

  React.useEffect(
    () => {
      if (props.open && container === null) {
        setContainer(getDefaultContainer());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.open]
  );

  function handleContainerChange(event: any) {
    setContainer(event.target.value);
  }

  return (
    <Dialog maxWidth="lg" scroll="paper" fullWidth onClose={onClose} keepMounted {...other}>
      <DialogTitle>{t('Terminal: {{ itemName }}', { itemName: item.metadata.name })}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Box>
          <FormControl className={classes.containerFormControl}>
            <InputLabel shrink id="container-name-chooser-label">
              {t('glossary|Container')}
            </InputLabel>
            <Select
              labelId="container-name-chooser-label"
              id="container-name-chooser"
              value={container !== null ? container : getDefaultContainer()}
              onChange={handleContainerChange}
            >
              {item &&
                item.spec.containers.map(({ name }) => (
                  <MenuItem value={name} key={name}>
                    {name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
        <Box className={classes.terminalBox}>
          <div
            id="xterm-container"
            ref={x => setTerminalContainerRef(x)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse' }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('frequent|Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
