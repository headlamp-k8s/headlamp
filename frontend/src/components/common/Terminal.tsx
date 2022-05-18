import 'xterm/css/xterm.css';
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

const useStyle = makeStyles(() => ({
  dialogTitle: {
    paddingBottom: 0,
  },
  dialogContent: {
    paddingBottom: 20,
    '& .xterm .xterm-viewport': {
      width: 'initial !important', // BugFix: https://github.com/xtermjs/xterm.js/issues/3564#issuecomment-1004417440
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
  xtermGrid: {
    width: '100%',
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
  const { t } = useTranslation('resource');
  const execRef = React.useRef<any>(null);
  const fitAddonRef = React.useRef<any>(null);
  const xtermRef = React.useRef<any>(null);
  const [shells, setShells] = React.useState({
    available: getAvailableShells(),
    currentIdx: 0,
    automaticallySwitch: true,
  });

  function getAvailableShells() {
    const selector = item.spec?.nodeSelector || {};
    const os = selector['kubernetes.io/os'] || selector['beta.kubernetes.io/os'];
    if (os === 'linux') {
      return ['bash', 'sh'];
    } else if (os === 'windows') {
      return ['powershell.exe', 'cmd.exe'];
    }
    return ['powershell.exe', 'bash', 'cmd.exe', 'sh'];
  }

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
      console.log('xterm resized: ' + size);
      send(4, `{"Width":${size.cols},"Height":${size.rows}}`);
    });

    // Allow copy/paste in terminal
    xterm.attachCustomKeyEventHandler(arg => {
      if (arg.ctrlKey && arg.code === 'KeyC' && arg.type === 'keydown') {
        const selection = xterm.getSelection();
        if (selection) {
          return false;
        }
      }
      if (arg.ctrlKey && arg.code === 'KeyV' && arg.type === 'keydown') {
        return false;
      }
      return true;
    });

    fitAddon.fit();
  }

  // @todo: Give the real exec type when we have it.
  function send(channel: number, data: string) {
    const socket = execRef.current.getSocket();

    // We should only send data if the socket is ready.
    if (!socket || socket.readyState !== 1) {
      console.debug('Socket not ready...', socket);
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
    if (channel !== 1 && channel !== 2 && channel !== 3) {
      return;
    }

    // The first byte is discarded because it just identifies whether
    // this data is from stderr, stdout, or stdin.
    const data = bytes.slice(1);
    const text = decoder.decode(data);

    if (automaticallySwitchShell(xterm, channel, text)) {
      return;
    }

    // send resize command to server once connection is establised
    if (!(xterm as any).connected && !!text) {
      xterm.clear();
      (async function () {
        send(4, `{"Width":${xterm.cols},"Height":${xterm.rows}}`);
      })();
      (xterm as any).connected = true;
      console.log('Connected!!!');
    }

    xterm.write(text);
  }

  function isShellNotFoundError(channel: number, text: string): boolean {
    // Linux container Error
    if (channel === 3) {
      try {
        const error = JSON.parse(text);
        if (error.code === 500 && error.status === 'Failure' && error.reason === 'InternalError') {
          if (error.details.causes[0].message.includes('executable file not found')) {
            return true;
          }
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

  function automaticallySwitchShell(xterm: XTerminal, channel: number, text: string): boolean {
    if ((xterm as any).connected) {
      return false;
    }
    if (!shells.automaticallySwitch) {
      return false;
    }

    if (isShellNotFoundError(channel, text)) {
      if (shells.currentIdx + 1 >= shells.available.length) {
        xterm.write('Could not estable connection.');
      } else {
        xterm.write('Retrying connectting with shell: ' + shells.available[shells.currentIdx]);
        setShells({ ...shells, ...{ currentIdx: shells.currentIdx + 1 } });
      }
      return true;
    }

    return false;
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
        execRef.current = await item.exec(
          container,
          shells.available[shells.currentIdx],
          (items: ArrayBuffer) => onData(xtermRef.current, items)
        );

        setupTerminal(terminalContainerRef, xtermRef.current, fitAddonRef.current);
      })();

      const handler = () => {
        fitAddonRef.current.fit();
        console.log('resize');
      };
      window.addEventListener('resize', handler);

      return function cleanup() {
        console.log('[Terminal] run cleanup.');
        xtermRef.current.dispose();
        if (execRef.current) {
          execRef.current.cancel();
        }
        window.removeEventListener('resize', handler);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [container, terminalContainerRef, shells.available[shells.currentIdx]]
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

  function handleShellChange(event: any) {
    setShells({
      ...shells,
      ...{ currentIdx: +event.target.value, automaticallySwitch: false },
    });
  }

  return (
    <Dialog maxWidth="lg" scroll="paper" fullWidth onClose={onClose} keepMounted {...other}>
      <DialogTitle>{t('Terminal: {{ itemName }}', { itemName: item.metadata.name })}</DialogTitle>
      <DialogContent
        className={classes.dialogContent}
        style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0 }}
      >
        <div
          style={{
            marginBottom: 12,
            padding: '0 24px',
          }}
        >
          <FormControl
            size="small"
            className={classes.containerFormControl}
            style={{ marginRight: 8 }}
          >
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
          <FormControl size="small" className={classes.containerFormControl}>
            <InputLabel shrink id="shell-chooser-label">
              {t('glossary|Shell')}
            </InputLabel>
            <Select
              labelId="shell-chooser-label"
              id="shell-chooser"
              value={shells.currentIdx}
              onChange={handleShellChange}
            >
              {shells.available.map((_, idx) => (
                <MenuItem value={idx} key={idx}>
                  {shells.available[idx]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div
          style={{
            padding: 1,
            flex: 1,
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column-reverse',
          }}
        >
          <div
            id="xterm-container"
            ref={x => setTerminalContainerRef(x)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse' }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('frequent|Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
