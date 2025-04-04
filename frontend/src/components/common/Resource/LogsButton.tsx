import { Box, FormControl, InputLabel, MenuItem, Select, styled, Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Terminal as XTerminal } from '@xterm/xterm';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { request } from '../../../lib/k8s/apiProxy';
import { KubeContainerStatus } from '../../../lib/k8s/cluster';
import DaemonSet from '../../../lib/k8s/daemonSet';
import Deployment from '../../../lib/k8s/deployment';
import { KubeObject } from '../../../lib/k8s/KubeObject';
import Pod from '../../../lib/k8s/pod';
import ReplicaSet from '../../../lib/k8s/replicaSet';
import ActionButton from '../ActionButton';
import { LogViewer } from '../LogViewer';
import { LightTooltip } from '../Tooltip';

// Component props interface
interface LogsButtonProps {
  item: KubeObject | null;
}

// Styled component for consistent padding in form controls
const PaddedFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  paddingTop: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

export function LogsButton({ item }: LogsButtonProps) {
  const [showLogs, setShowLogs] = useState(false);
  const [pods, setPods] = useState<Pod[]>([]);
  const [selectedPodIndex, setSelectedPodIndex] = useState<number | 'all'>('all');
  const [selectedContainer, setSelectedContainer] = useState('');

  const [logs, setLogs] = useState<{ logs: string[]; lastLineShown: number }>({
    logs: [],
    lastLineShown: -1,
  });
  const [allPodLogs, setAllPodLogs] = useState<{ [podName: string]: string[] }>({});

  const [showTimestamps, setShowTimestamps] = useState<boolean>(true);
  const [follow, setFollow] = useState<boolean>(true);
  const [lines, setLines] = useState<number>(100);
  const [showPrevious, setShowPrevious] = React.useState<boolean>(false);
  const [showReconnectButton, setShowReconnectButton] = useState(false);

  const [isTextWrappedEnabled, setIsTextWrappedEnabled] = React.useState(false);

  const xtermRef = React.useRef<XTerminal | null>(null);
  const { t } = useTranslation(['glossary', 'translation']);
  const { enqueueSnackbar } = useSnackbar();

  const clearLogs = React.useCallback(() => {
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
    setLogs({ logs: [], lastLineShown: -1 });
  }, []);

  // Fetch related pods.
  async function getRelatedPods(): Promise<Pod[]> {
    if (item instanceof Deployment || item instanceof ReplicaSet || item instanceof DaemonSet) {
      try {
        let labelSelector = '';
        const selector = item.spec.selector;

        if (selector.matchLabels) {
          labelSelector = Object.entries(selector.matchLabels)
            .map(([key, value]) => `${key}=${value}`)
            .join(',');
        }

        if (!labelSelector) {
          const resourceType =
            item instanceof Deployment
              ? 'deployment'
              : item instanceof ReplicaSet
              ? 'replicaset'
              : 'daemonset';
          throw new Error(
            t('translation|No label selectors found for this {{type}}', { type: resourceType })
          );
        }

        const response = await request(
          `/api/v1/namespaces/${item.metadata.namespace}/pods?labelSelector=${labelSelector}`,
          { method: 'GET' }
        );

        if (!response?.items) {
          throw new Error(t('translation|Invalid response from server'));
        }

        return response.items.map((podData: any) => new Pod(podData));
      } catch (error) {
        console.error('Error in getRelatedPods:', error);
        throw new Error(
          error instanceof Error ? error.message : t('translation|Failed to fetch related pods')
        );
      }
    }
    return [];
  }

  // Event handlers for log viewing options
  function handleLinesChange(event: any) {
    setLines(event.target.value);
  }

  function handleTimestampsChange() {
    setShowTimestamps(prev => !prev);
  }

  function handleFollowChange() {
    setFollow(prev => !prev);
  }

  function handlePreviousChange() {
    setShowPrevious(previous => !previous);
  }

  // Handler for initial logs button click
  async function handleClick() {
    if (item instanceof Deployment || item instanceof ReplicaSet || item instanceof DaemonSet) {
      try {
        const fetchedPods = await getRelatedPods();
        if (fetchedPods.length > 0) {
          setPods(fetchedPods);
          setSelectedPodIndex('all');
          setSelectedContainer(fetchedPods[0].spec.containers[0].name);
          setShowLogs(true);
        } else {
          enqueueSnackbar(t('translation|No pods found for this workload'), {
            variant: 'warning',
            autoHideDuration: 3000,
          });
        }
      } catch (error) {
        console.error('Error fetching pods:', error);
        enqueueSnackbar(
          t('translation|Failed to fetch pods: {{error}}', {
            error: error instanceof Error ? error.message : t('translation|Unknown error'),
          }),
          {
            variant: 'error',
            autoHideDuration: 5000,
          }
        );
      }
    }
  }

  // Handler for closing the logs viewer
  function handleClose() {
    setShowLogs(false);
    setPods([]);
    setSelectedPodIndex('all');
    setSelectedContainer('');
    setLogs({ logs: [], lastLineShown: -1 });
  }

  // Get containers for the selected pod
  const containers = React.useMemo(() => {
    if (!pods.length) return [];
    if (selectedPodIndex === 'all')
      return pods[0]?.spec?.containers?.map(container => container.name) || [];
    const selectedPod = pods[selectedPodIndex as number];
    return selectedPod?.spec?.containers?.map(container => container.name) || [];
  }, [pods, selectedPodIndex]);

  // Check if a container has been restarted
  function hasContainerRestarted(podName: string | undefined, containerName: string) {
    if (!podName) return false;
    const pod = pods.find(p => p.getName() === podName);
    const cont = pod?.status?.containerStatuses?.find(
      (c: KubeContainerStatus) => c.name === containerName
    );
    if (!cont) {
      return false;
    }

    return cont.restartCount > 0;
  }

  // Handler for reconnecting to logs stream
  function handleReconnect() {
    if (pods.length && selectedContainer) {
      setShowReconnectButton(false);
      setLogs({ logs: [], lastLineShown: -1 });
    }
  }

  // Function to process and display all logs
  const processAllLogs = React.useCallback(() => {
    const allLogs: string[] = [];
    Object.entries(allPodLogs).forEach(([podName, podLogs]) => {
      podLogs.forEach(log => {
        allLogs.push(`[${podName}] ${log}`);
      });
    });

    // Sort logs by timestamp
    allLogs.sort((a, b) => {
      const timestampA = a.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)?.[0] || '';
      const timestampB = b.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)?.[0] || '';
      return timestampA.localeCompare(timestampB);
    });

    if (xtermRef.current) {
      xtermRef.current.clear();
      xtermRef.current.write(allLogs.join('').replaceAll('\n', '\r\n'));
    }

    setLogs({
      logs: allLogs,
      lastLineShown: allLogs.length - 1,
    });
  }, [allPodLogs]);

  // Function to fetch and aggregate logs from all pods
  function fetchAllPodsLogs(pods: Pod[], container: string): () => void {
    clearLogs();
    setAllPodLogs({});

    const cleanups: Array<() => void> = [];

    pods.forEach(pod => {
      const cleanup = pod.getLogs(
        container,
        (newLogs: string[]) => {
          const podName = pod.getName();
          setAllPodLogs(current => {
            const updated = {
              ...current,
              [podName]: newLogs,
            };
            return updated;
          });
        },
        {
          tailLines: lines,
          showPrevious,
          showTimestamps,
          follow,
          onReconnectStop: () => {
            setShowReconnectButton(true);
          },
        }
      );
      cleanups.push(cleanup);
    });

    return () => cleanups.forEach(cleanup => cleanup());
  }

  // Effect for fetching and updating logs
  React.useEffect(() => {
    let cleanup: (() => void) | null = null;
    let isSubscribed = true;

    if (showLogs && selectedContainer) {
      clearLogs();
      setAllPodLogs({}); // Clear aggregated logs when switching pods

      // Handle paused logs state
      if (!follow && logs.logs.length > 0) {
        xtermRef.current?.write(
          '\n\n' +
            t('translation|Logs are paused. Click the follow button to resume following them.') +
            '\r\n'
        );
        return;
      }

      if (selectedPodIndex === 'all') {
        cleanup = fetchAllPodsLogs(pods, selectedContainer);
      } else {
        const pod = pods[selectedPodIndex as number];
        if (pod) {
          let lastLogLength = 0;
          cleanup = pod.getLogs(
            selectedContainer,
            (newLogs: string[]) => {
              if (!isSubscribed) return;

              setLogs(current => {
                const terminalRef = xtermRef.current;
                if (!terminalRef) return current;

                // Only process new logs in chunks for better performance
                if (newLogs.length > lastLogLength) {
                  const CHUNK_SIZE = 1000; // Process 1000 lines at a time
                  const startIdx = lastLogLength;
                  const endIdx = Math.min(startIdx + CHUNK_SIZE, newLogs.length);

                  // Process only the new chunk of logs
                  const newLogContent = newLogs
                    .slice(startIdx, endIdx)
                    .join('')
                    .replaceAll('\n', '\r\n');

                  terminalRef.write(newLogContent);
                  lastLogLength = endIdx;

                  // If there are more logs to process, schedule them for the next frame
                  if (endIdx < newLogs.length) {
                    requestAnimationFrame(() => {
                      setLogs(current => ({
                        ...current,
                        logs: newLogs,
                        lastLineShown: endIdx - 1,
                      }));
                    });
                    return current;
                  }
                }

                return {
                  logs: newLogs,
                  lastLineShown: newLogs.length - 1,
                };
              });
            },
            {
              tailLines: lines,
              showPrevious,
              showTimestamps,
              follow,
              onReconnectStop: () => {
                if (isSubscribed) {
                  setShowReconnectButton(true);
                }
              },
            }
          );
        }
      }
    }

    return () => {
      isSubscribed = false;
      if (cleanup) {
        cleanup();
      }
    };
  }, [
    selectedPodIndex,
    selectedContainer,
    showLogs,
    lines,
    showTimestamps,
    follow,
    clearLogs,
    t,
    pods,
    isTextWrappedEnabled,
  ]);

  // Effect to process logs when allPodLogs changes - only for "All Pods" mode
  React.useEffect(() => {
    if (selectedPodIndex === 'all' && showLogs && Object.keys(allPodLogs).length > 0) {
      processAllLogs();
    }
  }, [allPodLogs, selectedPodIndex, showLogs, processAllLogs]);

  function handleWrapText() {
    setIsTextWrappedEnabled(!isTextWrappedEnabled);
  }

  const topActions = [
    <Box
      key="container-controls"
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', width: '100%' }}
    >
      {/* Upper actions box */}
      <Box>
        {/* Pod selection dropdown */}
        <FormControl sx={{ minWidth: 200, marginLeft: 1 }}>
          <InputLabel>{t('translation|Select Pod')}</InputLabel>
          <Select
            value={selectedPodIndex}
            onChange={event => {
              setSelectedPodIndex(event.target.value as number | 'all');
              clearLogs();
            }}
            label={t('translation|Select Pod')}
          >
            <MenuItem value="all">{t('translation|All Pods')}</MenuItem>
            {pods.map((pod, index) => (
              <MenuItem key={pod.getName()} value={index}>
                {pod.getName()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Container selection dropdown */}
        <FormControl sx={{ minWidth: 200, marginLeft: 1 }}>
          <InputLabel>{t('translation|Container')}</InputLabel>
          <Select
            value={selectedContainer}
            onChange={event => {
              setSelectedContainer(event.target.value);
              clearLogs();
            }}
            label={t('translation|Container')}
          >
            {containers.map(container => (
              <MenuItem key={container} value={container}>
                {container}
                {hasContainerRestarted(
                  pods[selectedPodIndex === 'all' ? 0 : selectedPodIndex]?.getName(),
                  container
                ) && ` (${t('translation|Restarted')})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Lines selector */}
        <FormControl sx={{ minWidth: 200, marginLeft: 1 }}>
          <InputLabel>Lines</InputLabel>
          <Select value={lines} onChange={handleLinesChange}>
            {[100, 1000, 2500].map(i => (
              <MenuItem key={i} value={i}>
                {i}
              </MenuItem>
            ))}
            <MenuItem value={-1}>All</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
        }}
      >
        {/* Show previous logs switch */}
        <LightTooltip
          title={
            hasContainerRestarted(
              selectedPodIndex === 'all'
                ? pods[0]?.getName()
                : pods[selectedPodIndex as number]?.getName(),
              selectedContainer
            )
              ? t('translation|Show logs for previous instances of this container.')
              : t(
                  'translation|You can only select this option for containers that have been restarted.'
                )
          }
        >
          <PaddedFormControlLabel
            label={t('translation|Show previous')}
            disabled={
              !hasContainerRestarted(
                selectedPodIndex === 'all'
                  ? pods[0]?.getName()
                  : pods[selectedPodIndex as number]?.getName(),
                selectedContainer
              )
            }
            control={<Switch checked={showPrevious} onChange={handlePreviousChange} size="small" />}
          />
        </LightTooltip>

        {/* Timestamps switch */}
        <LightTooltip title={t('translation|Show timestamps in the logs.')}>
          <PaddedFormControlLabel
            control={
              <Switch checked={showTimestamps} onChange={handleTimestampsChange} size="small" />
            }
            label={t('translation|Timestamps')}
            disabled={false}
          />
        </LightTooltip>

        {/* Follow logs switch */}
        <LightTooltip
          title={t(
            'translation|Follow logs in real-time. New log lines will be appended as they arrive.'
          )}
        >
          <PaddedFormControlLabel
            control={<Switch checked={follow} onChange={handleFollowChange} size="small" />}
            label={t('translation|Follow')}
            disabled={false}
          />
        </LightTooltip>

        <LightTooltip title={t('translation|Wrap text in the terminal.')}>
          <PaddedFormControlLabel
            control={
              <Switch checked={isTextWrappedEnabled} onChange={handleWrapText} size="small" />
            }
            label={t('translation|Wrap')}
            disabled={false}
          />
        </LightTooltip>
      </Box>
    </Box>,
  ];

  return (
    <>
      {/* Show logs button for supported workload types */}
      {(item instanceof Deployment || item instanceof ReplicaSet || item instanceof DaemonSet) && (
        <ActionButton
          icon="mdi:file-document-box-outline"
          onClick={handleClick}
          description={t('translation|Show logs')}
        />
      )}

      {/* Logs viewer dialog */}
      {showLogs && (
        <LogViewer
          title={item?.getName() || ''}
          downloadName={`${item?.getName()}_${
            selectedPodIndex === 'all' ? 'all_pods' : pods[selectedPodIndex as number]?.getName()
          }`}
          open={showLogs}
          onClose={handleClose}
          logs={logs.logs}
          topActions={topActions}
          xtermRef={xtermRef}
          handleReconnect={handleReconnect}
          showReconnectButton={showReconnectButton}
          isWrappedTextEnabled={isTextWrappedEnabled}
        />
      )}
    </>
  );
}
