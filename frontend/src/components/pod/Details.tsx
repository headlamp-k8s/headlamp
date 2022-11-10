import { Icon } from '@iconify/react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { KubeContainerStatus } from '../../lib/k8s/cluster';
import Pod from '../../lib/k8s/pod';
import { LightTooltip, SectionBox, SimpleTable } from '../common';
import Link from '../common/Link';
import { LogViewer, LogViewerProps } from '../common/LogViewer';
import { ConditionsSection, ContainersSection, DetailsGrid } from '../common/Resource';
import Terminal from '../common/Terminal';
import { makePodStatusLabel } from './List';

const useStyle = makeStyles(theme => ({
  containerFormControl: {
    minWidth: '11rem',
  },
  switchControl: {
    minWidth: '11rem',
    paddingTop: theme.spacing(1),
  },
}));

interface PodLogViewerProps extends Omit<LogViewerProps, 'logs'> {
  item: Pod;
}

function PodLogViewer(props: PodLogViewerProps) {
  const classes = useStyle();
  const { item, onClose, open, ...other } = props;
  const [container, setContainer] = React.useState(getDefaultContainer());
  const [showPrevious, setShowPrevious] = React.useState<boolean>(false);
  const [showTimestamps, setShowTimestamps] = React.useState<boolean>(true);
  const [lines, setLines] = React.useState<number>(100);
  const [logs, setLogs] = React.useState<string[]>([]);
  const { t } = useTranslation('frequent');

  function getDefaultContainer() {
    return item.spec.containers.length > 0 ? item.spec.containers[0].name : '';
  }

  const options = { leading: true, trailing: true, maxWait: 1000 };
  function setLogsDebounced(args: string[]) {
    setLogs([]);
    setLogs(args);
  }
  const debouncedSetState = _.debounce(setLogsDebounced, 500, options);

  React.useEffect(
    () => {
      let callback: any = null;

      if (props.open) {
        callback = item.getLogs(container, debouncedSetState, {
          tailLines: lines,
          showPrevious,
          showTimestamps,
        });
      }

      return function cleanup() {
        if (callback) {
          callback();
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [container, lines, open, showPrevious, showTimestamps]
  );

  function handleContainerChange(event: any) {
    setContainer(event.target.value);
  }

  function handleLinesChange(event: any) {
    setLines(event.target.value);
  }

  function handlePreviousChange() {
    setShowPrevious(previous => !previous);
  }

  function hasContainerRestarted() {
    const cont = item?.status?.containerStatuses?.find(
      (c: KubeContainerStatus) => c.name === container
    );
    if (!cont) {
      return false;
    }

    return cont.restartCount > 0;
  }

  function handleTimestampsChange() {
    setShowTimestamps(timestamps => !timestamps);
  }

  return (
    <LogViewer
      title={t('glossary|Logs: {{ itemName }}', { itemName: item.getName() })}
      downloadName={`${item.getName()}_${container}`}
      open={open}
      onClose={onClose}
      logs={logs}
      topActions={[
        <FormControl className={classes.containerFormControl}>
          <InputLabel shrink id="container-name-chooser-label">
            {t('glossary|Container')}
          </InputLabel>
          <Select
            labelId="container-name-chooser-label"
            id="container-name-chooser"
            value={container}
            onChange={handleContainerChange}
          >
            {item &&
              item.spec.containers.map(({ name }) => (
                <MenuItem value={name} key={name}>
                  {name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>,
        <FormControl className={classes.containerFormControl}>
          <InputLabel shrink id="container-lines-chooser-label">
            {t('frequent|Lines')}
          </InputLabel>
          <Select
            labelId="container-lines-chooser-label"
            id="container-lines-chooser"
            value={lines}
            onChange={handleLinesChange}
          >
            {[100, 1000, 2500].map(i => (
              <MenuItem value={i} key={i}>
                {i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>,
        <LightTooltip
          title={
            hasContainerRestarted()
              ? t('logs|Show logs for previous instances of this container.')
              : t('logs|You can only select this option for containers that have been restarted.')
          }
        >
          <FormControlLabel
            className={classes.switchControl}
            label={t('logs|Show previous')}
            disabled={!hasContainerRestarted()}
            control={
              <Switch
                checked={showPrevious}
                onChange={handlePreviousChange}
                name="checkPrevious"
                color="primary"
              />
            }
          />
        </LightTooltip>,
        <FormControlLabel
          className={classes.switchControl}
          label={t('logs|Show Timestamps')}
          control={
            <Switch
              checked={showTimestamps}
              onChange={handleTimestampsChange}
              name="checkTimestamps"
              color="primary"
            />
          }
        />,
      ]}
      {...other}
    />
  );
}

export interface VolumeDetailsProps {
  volumes: any[] | null;
}

export function VolumeDetails(props: VolumeDetailsProps) {
  const { volumes } = props;
  if (!volumes) {
    return null;
  }
  const { t } = useTranslation();
  return (
    <SectionBox title={t('frequent|Volumes')}>
      <SimpleTable
        columns={[
          {
            label: t('frequent|Name'),
            getter: data => data.name,
          },
          {
            label: t('frequent|Type'),
            getter: data => Object.keys(data)[1],
          },
        ]}
        data={volumes}
        reflectInURL="volumes"
      />
    </SectionBox>
  );
}

export default function PodDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const [showLogs, setShowLogs] = React.useState(false);
  const [showTerminal, setShowTerminal] = React.useState(false);
  const { t } = useTranslation('glossary');

  return (
    <DetailsGrid
      resourceType={Pod}
      name={name}
      namespace={namespace}
      actions={item =>
        item && [
          <Tooltip title={t('Show Logs') as string}>
            <IconButton aria-label={t('logs')} onClick={() => setShowLogs(true)}>
              <Icon icon="mdi:file-document-box-outline" />
            </IconButton>
          </Tooltip>,
          <Tooltip title={t('Terminal / Exec') as string}>
            <IconButton aria-label={t('terminal') as string} onClick={() => setShowTerminal(true)}>
              <Icon icon="mdi:console" />
            </IconButton>
          </Tooltip>,
        ]
      }
      extraInfo={item =>
        item && [
          {
            name: t('State'),
            value: makePodStatusLabel(item),
          },
          {
            name: t('Node'),
            value: item.spec.nodeName ? (
              <Link routeName="node" params={{ name: item.spec.nodeName }}>
                {item.spec.nodeName}
              </Link>
            ) : (
              ''
            ),
          },
          {
            name: t('Host IP'),
            value: item.status.hostIP,
          },
          {
            name: t('Pod IP'),
            value: item.status.podIP,
          },
        ]
      }
      sectionsFunc={item =>
        item && (
          <>
            <ConditionsSection resource={item?.jsonData} />
            <ContainersSection resource={item?.jsonData} />
            <VolumeDetails volumes={item?.jsonData?.spec.volumes} />
            <PodLogViewer
              key="logs"
              open={showLogs}
              item={item}
              onClose={() => setShowLogs(false)}
            />
            <Terminal
              key="terminal"
              open={showTerminal}
              item={item}
              onClose={() => setShowTerminal(false)}
            />
          </>
        )
      }
    />
  );
}
