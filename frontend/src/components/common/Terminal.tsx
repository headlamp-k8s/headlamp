import 'xterm/css/xterm.css';
import { Box } from '@material-ui/core';
import { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Terminal as XTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import Pod from '../../lib/k8s/pod';
import { Dialog } from './Dialog';

const decoder = new TextDecoder('utf-8');
const encoder = new TextEncoder();

enum Channel {
  StdIn = 0,
  StdOut,
  StdErr,
  ServerError,
  Resize,
}

const useStyle = makeStyles(theme => ({
  dialogContent: {
    height: '100%',
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

interface XTerminalConnected {
  xterm: XTerminal;
  connected: boolean;
  reconnectOnEnter: boolean;
}

type execReturn = ReturnType<Pod['exec']>;

export default function Terminal(props: TerminalProps) {
  const { item, onClose, ...other } = props;
  const classes = useStyle();
  const [terminalContainerRef, setTerminalContainerRef] = React.useState<HTMLElement | null>(null);
  const [container, setContainer] = React.useState<string | null>(null);
  const execRef = React.useRef<execReturn | null>(null);
  const fitAddonRef = React.useRef<FitAddon | null>(null);
  const xtermRef = React.useRef<XTerminalConnected | null>(null);
  const [shells, setShells] = React.useState({
    available: getAvailableShells(),
    currentIdx: 0,
  });
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

      if (arg.type === 'keydown' && arg.code === 'Enter') {
        if (xtermRef.current?.reconnectOnEnter) {
          setShells(shells => ({
            ...shells,
            currentIdx: 0,
          }));
          xtermRef.current!.reconnectOnEnter = false;
          return false;
        }
      }

      return true;
    });

    fitAddon.fit();
  }

  function send(channel: number, data: string) {
    const socket = execRef.current!.getSocket();

    // We should only send data if the socket is ready.
    if (!socket || socket.readyState !== 1) {
      console.debug('Could not send data to exec: Socket not ready...', socket);
      return;
    }

    const encoded = encoder.encode(data);
    const buffer = new Uint8Array([channel, ...encoded]);

    socket.send(buffer);
  }

  function onData(xtermc: XTerminalConnected, bytes: ArrayBuffer) {
    const xterm = xtermc.xterm;
    // Only show data from stdout, stderr and server error channel.
    const channel: Channel = new Int8Array(bytes.slice(0, 1))[0];
    if (channel < Channel.StdOut || channel > Channel.ServerError) {
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
    if (!xtermc.connected && !!text) {
      xterm.clear();
      (async function () {
        send(4, `{"Width":${xterm.cols},"Height":${xterm.rows}}`);
      })();
      // On server error, don't set it as connected
      if (channel !== Channel.ServerError) {
        xtermc.connected = true;
        console.debug('Terminal is now connected');
      }
    }

    if (isSuccessfulExitError(channel, text)) {
      if (!!onClose) {
        onClose();
      }

      if (execRef.current) {
        execRef.current?.cancel();
      }

      return;
    }

    if (isShellNotFoundError(channel, text)) {
      shellConnectFailed(xtermc);
      return;
    }

    xterm.write(text);
  }

  function tryNextShell() {
    if (shells.available.length > 0) {
      setShells(currentShell => ({
        ...currentShell,
        currentIdx: (currentShell.currentIdx + 1) % currentShell.available.length,
      }));
    }
  }

  function isLastShell() {
    return shells.currentIdx === shells.available.length - 1;
  }

  function getCurrentShellCommand() {
    return shells.available[shells.currentIdx];
  }

  function shellConnectFailed(xtermc: XTerminalConnected) {
    const xterm = xtermc.xterm;
    const command = getCurrentShellCommand();
    if (isLastShell()) {
      if (xtermc.connected) {
        xterm.write(t('Failed to run "{{command}}"…', { command }) + '\r\n');
      } else {
        xterm.clear();
        xterm.write(t('Failed to connect…') + '\r\n');
      }

      xterm.write('\r\n' + t('Press the enter key to reconnect.') + '\r\n');
      if (xtermRef.current) {
        xtermRef.current.reconnectOnEnter = true;
      }
    } else {
      xterm.write(t('Failed to run "{{ command }}"', { command }) + '\r\n');
      tryNextShell();
    }
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

      // Don't do anything if the dialog is not open.
      if (!props.open) {
        return;
      }

      if (xtermRef.current) {
        xtermRef.current.xterm.dispose();
        execRef.current?.cancel();
      }

      const isWindows = ['Windows', 'Win16', 'Win32', 'WinCE'].indexOf(navigator?.platform) >= 0;
      xtermRef.current = {
        xterm: new XTerminal({
          cursorBlink: true,
          cursorStyle: 'underline',
          scrollback: 10000,
          rows: 30, // initial rows before fit
          windowsMode: isWindows,
        }),
        connected: false,
        reconnectOnEnter: false,
      };

      fitAddonRef.current = new FitAddon();
      xtermRef.current.xterm.loadAddon(fitAddonRef.current);

      const command = getCurrentShellCommand();

      xtermRef.current.xterm.writeln(t('Trying to run "{{command}}"…', { command }) + '\n');

      (async function () {
        execRef.current = await item.exec(
          container,
          (items: ArrayBuffer) => onData(xtermRef.current!, items),
          { command: [command], failCb: () => shellConnectFailed(xtermRef.current!) }
        );

        setupTerminal(terminalContainerRef, xtermRef.current!.xterm, fitAddonRef.current!);
      })();

      const handler = () => {
        fitAddonRef.current!.fit();
      };

      window.addEventListener('resize', handler);

      return function cleanup() {
        xtermRef.current?.xterm.dispose();
        execRef.current?.cancel();
        window.removeEventListener('resize', handler);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [container, terminalContainerRef, shells, props.open]
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

  React.useEffect(() => {
    if (shells.available.length === 0) {
      setShells({
        available: getAvailableShells(),
        currentIdx: 0,
      });
    }
  }, [item]);

  function getAvailableShells() {
    const selector = item.spec?.nodeSelector || {};
    const os = selector['kubernetes.io/os'] || selector['beta.kubernetes.io/os'];
    if (os === 'linux') {
      return ['bash', '/bin/bash', 'sh', '/bin/sh'];
    } else if (os === 'windows') {
      return ['powershell.exe', 'cmd.exe'];
    }
    return ['bash', '/bin/bash', 'sh', '/bin/sh', 'powershell.exe', 'cmd.exe'];
  }

  function handleContainerChange(event: any) {
    setContainer(event.target.value);
  }

  function isSuccessfulExitError(channel: number, text: string): boolean {
    // Linux container Error
    if (channel === 3) {
      try {
        const error = JSON.parse(text);
        if (_.isEmpty(error.metadata) && error.status === 'Success') {
          return true;
        }
      } catch {}
    }
    return false;
  }

  function isShellNotFoundError(channel: number, text: string): boolean {
    // Linux container Error
    if (channel === 3) {
      try {
        const error = JSON.parse(text);
        if (error.code === 500 && error.status === 'Failure' && error.reason === 'InternalError') {
          return true;
        }
      } catch {}
    }
    // Windows container Error
    if (channel === 1) {
      if (text.includes('The system cannot find the file specified')) {
        return true;
      }
    }
    return false;
  }

  return (
    <Dialog
      onClose={onClose}
      onFullScreenToggled={() => {
        setTimeout(() => {
          fitAddonRef.current!.fit();
        }, 1);
      }}
      keepMounted
      withFullScreen
      title={t('Terminal: {{ itemName }}', { itemName: item.metadata.name })}
      {...other}
    >
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
    </Dialog>
  );
}
