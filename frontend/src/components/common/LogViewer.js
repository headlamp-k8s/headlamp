import fileDownloadOutline from '@iconify/icons-mdi/file-download-outline';
import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Ansi from 'ansi-to-react';
import _ from 'lodash';
import React from 'react';
import api from '../../lib/api';

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
  }
}));

export function LogViewer(props) {
  const { item, onClose, ...other } = props;
  const classes = useStyle();
  const [logs, setLogs] = React.useState([]);
  // This is a workaround because just setting the logs doesn't seem to update
  // the view...
  const [count, setCount] = React.useState(0);
  const logsBottomRef = React.useRef(null);
  const [container, setContainer] = React.useState(getDefaultContainer());
  const [lines, setLines] = React.useState(100);

  function getDefaultContainer() {
    return (item.spec.containers.length > 0) ? item.spec.containers[0].name : '';
  }

  function downloadLog() {
    const element = document.createElement('a');
    const file = new Blob(logs, {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${item.metadata.name}_${container}.txt`;
    // Required for FireFox
    document.body.appendChild(element);
    element.click();
  }

  const options = {leading: true, trailing: true, maxWait: 1000};
  function setLogsDebounced(args) {
    setLogs(args);
    setCount(args.length);

    // @todo: Only scroll down automatically if the view hasn't been scrolled up by the user yet.
    if (logsBottomRef && logsBottomRef.current) {
      logsBottomRef.current.scrollIntoView();
    }
  }
  const debouncedSetState = _.debounce(setLogsDebounced, 500, options);

  React.useEffect(() => {
    let callback = null;
    if (props.open) {
      callback = api.logs(item.metadata.namespace,
                          item.metadata.name,
                          container,
                          lines,
                          false,
                          debouncedSetState);
    }

    return function cleanup() {
      if (callback) {
        callback();
      }
    };
  },
  [container, lines, props.open]);

  function handleContainerChange(event) {
    setContainer(event.target.value);
  }

  function handleLinesChange(event) {
    setLines(event.target.value);
  }

  return (
    <Dialog
      maxWidth="lg"
      scroll="paper"
      fullWidth
      onBackdropClick={onClose}
      {...other}
    >
      <DialogTitle>Logs: {item.metadata.name}</DialogTitle>
      <DialogContent
        className={classes.dialogContent}
      >
        <Grid
          container
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
        >
          <Grid
            item
            container
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
                  value={container}
                  onChange={handleContainerChange}
                >
                  {item && item.spec.containers.map(({name}) =>
                    <MenuItem value={name} key={name}>{name}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl className={classes.containerFormControl}>
                <InputLabel shrink id="container-lines-chooser-label">
                  Lines
                </InputLabel>
                <Select
                  labelId="container-lines-chooser-label"
                  id="container-lines-chooser"
                  value={lines}
                  onChange={handleLinesChange}
                >
                  {[100, 1000, 2500].map((i) =>
                    <MenuItem value={i} key={i}>{i}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs>
            <Tooltip title="Download">
              <IconButton
                aria-label="download"
                onClick={downloadLog}
              >
                <Icon icon={fileDownloadOutline} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Box className={classes.terminal}>
          <pre>
            {logs.map((item, i) =>
              <Ansi className={classes.terminalCode} key={i}>{item}</Ansi>
            )}
          </pre>
          <div ref={logsBottomRef} />
        </Box>
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
