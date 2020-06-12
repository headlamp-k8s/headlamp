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
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { KubePod } from '../../lib/cluster';
import { LogViewer, LogViewerProps } from '../common/LogViewer';
import { ContainersSection, MainInfoSection, PageGrid } from '../common/Resource';
import Terminal from '../common/Terminal';

const useStyle = makeStyles({
  containerFormControl: {
    minWidth: '11rem',
  }
});

interface PodLogViewerProps extends Omit<LogViewerProps, 'logs'> {
  item: KubePod;
}

function PodLogViewer(props: PodLogViewerProps) {
  const classes = useStyle();
  const { item, onClose, open, ...other } = props;
  const [container, setContainer] = React.useState(getDefaultContainer());
  const [lines, setLines] = React.useState<number>(100);
  const [logs, setLogs] = React.useState<string[]>([]);

  function getDefaultContainer() {
    return (item.spec.containers.length > 0) ? item.spec.containers[0].name : '';
  }

  const options = {leading: true, trailing: true, maxWait: 1000};
  function setLogsDebounced(args: string[]) {
    setLogs([]);
    setLogs(args);
  }
  const debouncedSetState = _.debounce(setLogsDebounced, 500, options);

  React.useEffect(() => {
    let callback: any = null;
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

  function handleContainerChange(event: any) {
    setContainer(event.target.value);
  }

  function handleLinesChange(event: any) {
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

export default function PodDetails() {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState<KubePod | null>(null);
  const [showLogs, setShowLogs] = React.useState(false);
  const [showTerminal, setShowTerminal] = React.useState(false);

  useConnectApi(
    api.pod.get.bind(null, namespace, name, setItem),
  );

  return (
    <React.Fragment>
      <PageGrid>
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
        {item && <ContainersSection resource={item} />}
      </PageGrid>
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
