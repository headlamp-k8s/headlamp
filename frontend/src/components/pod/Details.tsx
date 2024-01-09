import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Terminal as XTerminal } from 'xterm';
import { KubeContainerStatus } from '../../lib/k8s/cluster';
import Pod from '../../lib/k8s/pod';
import { DefaultHeaderAction } from '../../redux/actionButtonsSlice';
import { ActionButton, LightTooltip, SectionBox, SimpleTable } from '../common';
import Link from '../common/Link';
import { LogViewer, LogViewerProps } from '../common/LogViewer';
import {
  ConditionsSection,
  ContainersSection,
  DetailsGrid,
  VolumeSection,
} from '../common/Resource';
import AuthVisible from '../common/Resource/AuthVisible';
import Terminal from '../common/Terminal';
import { makePodStatusLabel } from './List';

const PREFIX = 'Details';

const classes = {
  containerFormControl: `${PREFIX}-containerFormControl`,
  linesFormControl: `${PREFIX}-linesFormControl`,
  switchControl: `${PREFIX}-switchControl`,
};

const StyledLogViewer = styled(LogViewer)(({ theme }) => ({
  [`& .${classes.containerFormControl}`]: {
    minWidth: '11rem',
  },

  [`& .${classes.linesFormControl}`]: {
    minWidth: '6rem',
  },

  [`& .${classes.switchControl}`]: {
    margin: 0,
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

interface PodLogViewerProps extends Omit<LogViewerProps, 'logs'> {
  item: Pod;
}

function PodLogViewer(props: PodLogViewerProps) {
  const { item, onClose, open, ...other } = props;
  const [container, setContainer] = React.useState(getDefaultContainer());
  const [showPrevious, setShowPrevious] = React.useState<boolean>(false);
  const [showTimestamps, setShowTimestamps] = React.useState<boolean>(true);
  const [follow, setFollow] = React.useState<boolean>(true);
  const [lines, setLines] = React.useState<number>(100);
  const [logs, setLogs] = React.useState<{ logs: string[]; lastLineShown: number }>({
    logs: [],
    lastLineShown: -1,
  });
  const xtermRef = React.useRef<XTerminal | null>(null);
  const { t } = useTranslation();

  function getDefaultContainer() {
    return item.spec.containers.length > 0 ? item.spec.containers[0].name : '';
  }

  const options = { leading: true, trailing: true, maxWait: 1000 };
  function setLogsDebounced(logLines: string[]) {
    setLogs(current => {
      if (current.lastLineShown >= logLines.length) {
        xtermRef.current?.clear();
        xtermRef.current?.write(logLines.join('').replaceAll('\n', '\r\n'));
      } else {
        xtermRef.current?.write(
          logLines
            .slice(current.lastLineShown + 1)
            .join('')
            .replaceAll('\n', '\r\n')
        );
      }

      return {
        logs: logLines,
        lastLineShown: logLines.length - 1,
      };
    });
    // If we stopped following the logs and we have logs already,
    // then we don't need to fetch them again.
    if (!follow && logs.logs.length > 0) {
      xtermRef.current?.write(
        '\n\n' +
          t('translation|Logs are paused. Click the follow button to resume following them.') +
          '\r\n'
      );
      return;
    }
  }
  const debouncedSetState = _.debounce(setLogsDebounced, 500, options);

  React.useEffect(
    () => {
      let callback: any = null;

      if (props.open) {
        xtermRef.current?.clear();
        setLogs({ logs: [], lastLineShown: -1 });

        callback = item.getLogs(container, debouncedSetState, {
          tailLines: lines,
          showPrevious,
          showTimestamps,
          follow,
        });
      }

      return function cleanup() {
        if (callback) {
          callback();
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [container, lines, open, showPrevious, showTimestamps, follow]
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

  function handleFollowChange() {
    setFollow(follow => !follow);
  }

  return (
    <StyledLogViewer
      title={t('glossary|Logs: {{ itemName }}', { itemName: item.getName() })}
      downloadName={`${item.getName()}_${container}`}
      open={open}
      onClose={onClose}
      logs={logs.logs}
      xtermRef={xtermRef}
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
            {item?.spec?.containers && (
              <MenuItem disabled value="">
                {t('glossary|Containers')}
              </MenuItem>
            )}
            {item?.spec?.containers.map(({ name }) => (
              <MenuItem value={name} key={name}>
                {name}
              </MenuItem>
            ))}
            {item?.spec?.initContainers && (
              <MenuItem disabled value="">
                {t('translation|Init Containers')}
              </MenuItem>
            )}
            {item.spec.initContainers?.map(({ name }) => (
              <MenuItem value={name} key={`init_container_${name}`}>
                {name}
              </MenuItem>
            ))}
            {item?.spec?.ephemeralContainers && (
              <MenuItem disabled value="">
                {t('glossary|Ephemeral Containers')}
              </MenuItem>
            )}
            {item.spec.ephemeralContainers?.map(({ name }) => (
              <MenuItem value={name} key={`eph_container_${name}`}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>,
        <FormControl className={classes.linesFormControl}>
          <InputLabel shrink id="container-lines-chooser-label">
            {t('translation|Lines')}
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
              ? t('translation|Show logs for previous instances of this container.')
              : t(
                  'translation|You can only select this option for containers that have been restarted.'
                )
          }
        >
          <FormControlLabel
            className={classes.switchControl}
            label={t('translation|Show previous')}
            disabled={!hasContainerRestarted()}
            control={
              <Switch
                checked={showPrevious}
                onChange={handlePreviousChange}
                name="checkPrevious"
                color="primary"
                size="small"
              />
            }
          />
        </LightTooltip>,
        <FormControlLabel
          className={classes.switchControl}
          label={t('translation|Timestamps')}
          control={
            <Switch
              checked={showTimestamps}
              onChange={handleTimestampsChange}
              name="checkTimestamps"
              color="primary"
              size="small"
            />
          }
        />,
        <FormControlLabel
          className={classes.switchControl}
          label={t('translation|Follow')}
          control={
            <Switch
              checked={follow}
              onChange={handleFollowChange}
              name="follow"
              color="primary"
              size="small"
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
    <SectionBox title={t('translation|Volumes')}>
      <SimpleTable
        columns={[
          {
            label: t('translation|Name'),
            getter: data => data.name,
          },
          {
            label: t('translation|Type'),
            getter: data => Object.keys(data)[1],
          },
        ]}
        data={volumes}
        reflectInURL="volumes"
      />
    </SectionBox>
  );
}

function TolerationsSection(props: { tolerations: any[] }) {
  const { tolerations } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <SectionBox title={t('Tolerations')}>
      <SimpleTable
        data={tolerations}
        columns={[
          {
            label: t('translation|Key'),
            getter: data => data.key,
          },
          {
            label: t('translation|Value'),
            getter: data => data.value,
          },
          {
            label: t('translation|Operator'),
            getter: data => data.operator,
            gridTemplate: '0.5fr',
          },
          {
            label: t('translation|Effect'),
            getter: data => data.effect,
          },
          {
            label: t('Seconds'),
            getter: data => data.tolerationSeconds,
            gridTemplate: '0.5fr',
          },
        ]}
      />
    </SectionBox>
  );
}

export interface PodDetailsProps {
  showLogsDefault?: boolean;
}

export default function PodDetails(props: PodDetailsProps) {
  const { showLogsDefault } = props;
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const [showLogs, setShowLogs] = React.useState(!!showLogsDefault);
  const [showTerminal, setShowTerminal] = React.useState(false);
  const { t } = useTranslation('glossary');
  const [isAttached, setIsAttached] = React.useState(false);

  return (
    <DetailsGrid
      resourceType={Pod}
      name={name}
      namespace={namespace}
      withEvents
      actions={item =>
        item && [
          {
            id: DefaultHeaderAction.POD_LOGS,
            action: (
              <AuthVisible item={item} authVerb="get" subresource="log">
                <ActionButton
                  description={t('Show Logs')}
                  aria-label={t('logs')}
                  icon="mdi:file-document-box-outline"
                  onClick={() => setShowLogs(true)}
                />
              </AuthVisible>
            ),
          },
          {
            id: DefaultHeaderAction.POD_TERMINAL,
            action: (
              <AuthVisible item={item} authVerb="get" subresource="exec">
                <ActionButton
                  description={t('Terminal / Exec')}
                  aria-label={t('terminal')}
                  icon="mdi:console"
                  onClick={() => setShowTerminal(true)}
                />
              </AuthVisible>
            ),
          },
          {
            id: DefaultHeaderAction.POD_ATTACH,
            action: (
              <AuthVisible item={item} authVerb="get" subresource="attach">
                <ActionButton
                  description={t('Attach')}
                  aria-label={t('attach')}
                  icon="mdi:connection"
                  onClick={() => setIsAttached(true)}
                />
              </AuthVisible>
            ),
          },
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
            name: t('Service Account'),
            value:
              !!item.spec.serviceAccountName || !!item.spec.serviceAccount ? (
                <Link
                  routeName="serviceAccount"
                  params={{
                    namespace: item.metadata.namespace,
                    name: item.spec.serviceAccountName || item.spec.serviceAccount,
                  }}
                >
                  {item.spec.serviceAccountName || item.spec.serviceAccount}
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
          {
            name: t('QoS Class'),
            value: item.status.qosClass,
          },
          {
            name: t('Priority'),
            value: item.spec.priority,
          },
        ]
      }
      extraSections={item =>
        item && [
          {
            id: 'headlamp.pod-tolerations',
            section: <TolerationsSection tolerations={item?.spec?.tolerations || []} />,
          },
          {
            id: 'headlamp.pod-conditions',
            section: <ConditionsSection resource={item?.jsonData} />,
          },
          {
            id: 'headlamp.pod-containers',
            section: <ContainersSection resource={item?.jsonData} />,
          },
          {
            id: 'headlamp.pod-volumes',
            section: <VolumeSection resource={item?.jsonData} />,
          },
          {
            id: 'headlamp.pod-logs',
            section: (
              <PodLogViewer
                key="logs"
                open={showLogs}
                item={item}
                onClose={() => setShowLogs(false)}
              />
            ),
          },
          {
            id: 'headlamp.pod-terminal',
            section: (
              <Terminal
                key="terminal"
                open={showTerminal || isAttached}
                item={item}
                onClose={() => {
                  setShowTerminal(false);
                  setIsAttached(false);
                }}
                isAttach={isAttached}
              />
            ),
          },
        ]
      }
    />
  );
}
