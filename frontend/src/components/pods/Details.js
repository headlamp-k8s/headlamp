import consoleIcon from '@iconify/icons-mdi/console';
import fileDocumentBoxOutline from '@iconify/icons-mdi/file-document-box-outline';
import { Icon } from '@iconify/react';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash';
import React from 'react';
import { useParams } from "react-router-dom";
import api, { useConnectApi } from '../../lib/api';
import { LogViewer } from '../common/LogViewer';
import { MainInfoSection } from '../common/Resource';
import Terminal from '../common/Terminal';

const useStyle = makeStyles({
  containerFormControl: {
    minWidth: '11rem',
  }
});

function PodLogViewer(props) {
  const classes = useStyle();
  const { item, onClose, open, ...other } = props;
  const [container, setContainer] = React.useState(getDefaultContainer());
  const [lines, setLines] = React.useState(100);
  const [logs, setLogs] = React.useState([]);

  function getDefaultContainer() {
    return (item.spec.containers.length > 0) ? item.spec.containers[0].name : '';
  }

  const options = {leading: true, trailing: true, maxWait: 1000};
  function setLogsDebounced(args) {
    setLogs([]);
    setLogs(args);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [container, lines, open]);

  function handleContainerChange(event) {
    setContainer(event.target.value);
  }

  function handleLinesChange(event) {
    setLines(event.target.value);
  }

  return (
    <LogViewer
      title={`Logs: ${item.metadata.name}`}
      downloadName={`${item.metadata.name}_${container}`}
      open={open}
      onClose={onClose}
      logs={logs}
      topActions={[
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
        </FormControl>,
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
      ]}
      {...other}
    />
  );
}

export default function PodDetails(props) {
  let { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);
  const [showLogs, setShowLogs] = React.useState(false);
  const [showTerminal, setShowTerminal] = React.useState(false);

  useConnectApi(
    api.pod.get.bind(null, namespace, name, setItem),
  );

  return (
    <React.Fragment>
      <MainInfoSection
        resource={item}
        actions={item && [
          <Tooltip title="Show Logs">
            <IconButton
              aria-label="delete"
              onClick={() => setShowLogs(true)}
            >
              <Icon icon={fileDocumentBoxOutline} />
            </IconButton>
          </Tooltip>,
          <Tooltip title="Terminal / Exec">
            <IconButton
              aria-label="delete"
              onClick={() => setShowTerminal(true)}
            >
              <Icon icon={consoleIcon} />
            </IconButton>
          </Tooltip>
        ]}
        extraInfo={item && [
          {
            name: 'State',
            value: item.status.phase
          },
          {
            name: 'Host IP',
            value: item.status.hostIP,
          },
          {
            name: 'Pod IP',
            value: item.status.podIP,
          }
        ]}
      />
      {item &&
        [
          <PodLogViewer
            key="logs"
            open={showLogs}
            item={item}
            onClose={ () => setShowLogs(false) }
          />,
          <Terminal
            key="terminal"
            open={showTerminal}
            item={item}
            onClose={ () => setShowTerminal(false) }
          />
        ]
      }
    </React.Fragment>
  );
}
