import { Icon } from '@iconify/react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { memo, useEffect, useState } from 'react';
import { KubeObject } from '../../lib/k8s/cluster';
import Event from '../../lib/k8s/event';
import { DateLabel, StatusLabel } from '../common/Label';
import { makePodStatusLabel } from '../pod/List';

/**
 * Little Popup preview of a Kube object
 */
export const KubeObjectGlance = memo(({ resource }: { resource: KubeObject }) => {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    Event.objectEvents(resource).then(it => setEvents(it));
  }, []);

  const kind = resource.kind;

  const sections = [];

  if (kind === 'Pod') {
    sections.push(
      <>
        <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap">
          <Box>{makePodStatusLabel(resource)}</Box>
          {resource.spec.containers.map((it: any) => (
            <StatusLabel status="">container: {it.name}</StatusLabel>
          ))}
          {resource.status?.podIP && (
            <StatusLabel status="">IP: {resource.status?.podIP}</StatusLabel>
          )}
        </Box>
      </>
    );
  }

  if (kind === 'Deployment') {
    const { replicas, availableReplicas } = resource.status;
    const pods = `${availableReplicas || 0}/${replicas || 0}`;

    sections.push(
      <>
        <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap">
          <StatusLabel status="">Pods: {pods}</StatusLabel>
          {resource.status.conditions.map((it: any) => (
            <StatusLabel status="">{it.type}</StatusLabel>
          ))}
        </Box>
      </>
    );
  }

  if (kind === 'Service') {
    const externalIP = resource.getExternalAddresses();
    sections.push(
      <>
        <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap">
          <StatusLabel status="">Type: {resource.spec.type}</StatusLabel>
          <StatusLabel status="">Cluster IP: {resource.spec.clusterIP}</StatusLabel>
          {externalIP && <StatusLabel status="">External IP: {externalIP}</StatusLabel>}
          {resource.spec?.ports?.map((it: any) => (
            <StatusLabel status="">
              {it.protocol}:{it.port}
            </StatusLabel>
          ))}
        </Box>
      </>
    );
  }

  if (kind === 'Endpoints') {
    const addresses =
      resource.subsets?.flatMap((it: any) => it.addresses.map((it: any) => it.ip)) ?? [];
    const ports = resource.subsets?.flatMap((it: any) => it.ports) ?? [];
    sections.push(
      <>
        <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap">
          <StatusLabel status="">Address: {addresses.join(', ')}</StatusLabel>
          {ports.map((it: any) => (
            <StatusLabel status="">
              {it.protocol}:{it.port}
            </StatusLabel>
          ))}
        </Box>
      </>
    );
  }

  if (kind === 'ReplicaSet' || kind === 'StatefulSet') {
    const ready = resource.status?.readyReplicas || 0;
    const desired = resource.spec?.replicas || 0;

    sections.push(
      <>
        <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap">
          <StatusLabel status="">
            Replicas: {ready}/{desired}
          </StatusLabel>
        </Box>
      </>
    );
  }

  if (events.length > 0) {
    sections.push(
      <Box
        sx={theme => ({
          background: theme.palette.background.paper,
          borderColor: theme.palette.divider,
        })}
        border="1px solid"
        borderRadius="8px"
        p={1}
        mt={2}
      >
        <Typography fontSize={14}>
          <Box display="flex" alignItems="center" gap={1} mb={1} fontSize={14}>
            <Icon icon="mdi:message-notification" />
            Events
          </Box>
        </Typography>
        {events.slice(0, 5).map(it => (
          <Box display="flex" gap={1} alignItems="center" mb={0.5} width="100%">
            <Box
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              mr="auto"
              maxWidth="300px"
              title={it.message}
            >
              {it.message}
            </Box>
            <DateLabel date={it.lastTimestamp} format="mini" />
          </Box>
        ))}
      </Box>
    );
  }

  return sections;
});
