import 'xterm/css/xterm.css';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Terminal as XTerminal } from 'xterm';
import Pod from '../../lib/k8s/pod';

const decoder = new TextDecoder('utf-8');
const encoder = new TextEncoder();

const useStyle = makeStyles(theme => ({
  dialogContent: {
    height: '80%',
    minHeight: '80%',
  },
  containerFormControl: {
    minWidth: '11rem',
  }
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

  function getDefaultContainer() {
    return (item.spec.containers.length > 0) ? item.spec.containers[0].name : '';
  }

  // @todo: Give the real exec type when we have it.
  function setupTerminal(containerRef: HTMLElement, xterm: XTerminal, exec: any) {
    if (!containerRef) {
      return;
    }

    xterm.open(containerRef);

    xterm.onKey(event => {
      // For some reason, pressing a key can give us a "keydown" or "keypress" event...
      if (!['keydown', 'keypress'].includes(event.domEvent.type)) {
        return;
      }

      // Send a newline when pressing enter
      const code = event.domEvent.key === 'Enter' ? '\n' : event.key;

      // We just send the key strokes to the socket; the actual writing into the
      // terminal will be done when the data arrives.
      send(code, exec);
    });
  }

  // @todo: Give the real exec type when we have it.
  function send(data: string, exec: any) {
    const socket = exec.getSocket();

    // We should only send data if the socket is ready.
    if (!socket || socket.readyState !== 1) {
      console.debug('Socket not ready...', socket);
      return;
    }

    const encoded = encoder.encode(data);
    const buffer = new Uint8Array([0, ...encoded]);

    socket.send(buffer);
  }

  function onData(xterm: XTerminal, bytes: ArrayBuffer) {
    // The first byte is discarded because it just identifies whether
    // this data is from stderr, stdout, or stdin.
    const data = bytes.slice(1);
    const text = decoder.decode(data);

    if (bytes.byteLength < 2) {
      return;
    }

    xterm.write(text);
  }

  React.useEffect(() => {
    // We need a valid container ref for the terminal to add itself to it.
    if (terminalContainerRef === null) {
      return;
    }

    // Don't do anything until the pod's container is assigned. We used the pod's late
    // assignment to prevent calling exec before the dialog is opened.
    if (container === null) {
      return;
    }

    const xterm = new XTerminal({rows: 40, cols: 80});
    xterm.writeln('Connecting…\n');

    const exec = item.exec(container, (items: ArrayBuffer) => onData(xterm, items));

    setupTerminal(terminalContainerRef, xterm, exec);

    return function cleanup() {
      xterm.dispose();
      exec.cancel();
    };
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [container, terminalContainerRef]);

  React.useEffect(() => {
    if (props.open && container === null) {
      setContainer(getDefaultContainer());
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [props.open]);

  function handleContainerChange(event: any) {
    setContainer(event.target.value);
  }

  return (
    <Dialog
      maxWidth="lg"
      scroll="paper"
      fullWidth
      onBackdropClick={onClose}
      keepMounted
      {...other}
    >
      <DialogTitle>Terminal: {item.metadata.name}</DialogTitle>
      <DialogContent
        className={classes.dialogContent}
      >
        <Grid
          container
          direction="column"
          spacing={1}
        >
          <Grid item>
            <FormControl className={classes.containerFormControl}>
              <InputLabel shrink id="container-name-chooser-label">
                Container
              </InputLabel>
              <Select
                labelId="container-name-chooser-label"
                id="container-name-chooser"
                value={ container !== null ? container : getDefaultContainer() }
                onChange={handleContainerChange}
              >
                {item && item.spec.containers.map(({name}) =>
                  <MenuItem value={name} key={name}>{name}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <div id='xterm' ref={x => setTerminalContainerRef(x)} className='terminal' />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
