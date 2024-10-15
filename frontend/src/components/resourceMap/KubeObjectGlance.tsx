import { Icon } from '@iconify/react';
import { Box } from '@mui/system';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KubeObject } from '../../lib/k8s/cluster';
import Event from '../../lib/k8s/event';
import { DateLabel, StatusLabel } from '../common/Label';
import { makePodStatusLabel } from '../pod/List';

/**
 * Little Popup preview of a Kube object
 */
export const KubeObjectGlance = memo(({ resource }: { resource: KubeObject }) => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    Event.objectEvents(resource).then(it => setEvents(it));
  }, []);

  const kind = resource.kind;

  const sections = [];

  if (kind === 'Pod') {
    sections.push(
      <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap" key="pod">
        <Box>{makePodStatusLabel(resource)}</Box>
        {resource.spec.containers.map((it: any) => (
          <StatusLabel status="" key={it.name}>
            {t('glossary|Container')}: {it.name}
          </StatusLabel>
        ))}
        {resource.status?.podIP && (
          <StatusLabel status="">IP: {resource.status?.podIP}</StatusLabel>
        )}
      </Box>
    );
  }

  if (kind === 'Deployment') {
    const { replicas, availableReplicas } = resource.status;
    const pods = `${availableReplicas || 0}/${replicas || 0}`;

    sections.push(
      <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap" key="deployment">
        <StatusLabel status="">
          {t('glossary|Pods')}: {pods}
        </StatusLabel>
        {resource.status.conditions.map((it: any) => (
          <StatusLabel status="" key={it.type}>
            {it.type}
          </StatusLabel>
        ))}
      </Box>
    );
  }

  if (kind === 'Service') {
    const externalIP = resource.getExternalAddresses();
    sections.push(
      <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap" key="service">
        <StatusLabel status="">
          {t('Type')}: {resource.spec.type}
        </StatusLabel>
        <StatusLabel status="">
          {t('glossary|Cluster IP')}: {resource.spec.clusterIP}
        </StatusLabel>
        {externalIP && (
          <StatusLabel status="">
            {t('glossary|External IP')}:: {externalIP}
          </StatusLabel>
        )}
        {resource.spec?.ports?.map((it: any) => (
          <StatusLabel status="" key={it.protocol + it.port}>
            {it.protocol}:{it.port}
          </StatusLabel>
        ))}
      </Box>
    );
  }

  if (kind === 'Endpoints') {
    const addresses =
      resource.subsets?.flatMap((it: any) => it.addresses.map((it: any) => it.ip)) ?? [];
    const ports = resource.subsets?.flatMap((it: any) => it.ports) ?? [];
    sections.push(
      <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap" key="endpoints">
        <StatusLabel status="">
          {t('Addresses')}: {addresses.join(', ')}
        </StatusLabel>
        {ports.map((it: any) => (
          <StatusLabel status="" key={it.protocol + it.port}>
            {it.protocol}:{it.port}
          </StatusLabel>
        ))}
      </Box>
    );
  }

  if (kind === 'ReplicaSet' || kind === 'StatefulSet') {
    const ready = resource.status?.readyReplicas || 0;
    const desired = resource.spec?.replicas || 0;

    sections.push(
      <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap" key="sets">
        <StatusLabel status="">
          {t('glossary|Replicas')}: {ready}/{desired}
        </StatusLabel>
      </Box>
    );
  }

  if (events.length > 0) {
    sections.push(
      <Box key="events" mt={2}>
        <Box display="flex" alignItems="center" gap={1} mb={1} fontSize={14}>
          <Icon icon="mdi:message-notification" />
          {t('glossary|Events')}
        </Box>
        {events.slice(0, 5).map(it => (
          <Box
            display="flex"
            gap={1}
            alignItems="center"
            mb={0.5}
            width="100%"
            key={it.message + it.lastTimestamp}
          >
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
