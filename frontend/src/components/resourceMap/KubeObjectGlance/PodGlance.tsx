import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import Pod from '../../../lib/k8s/pod';
import { StatusLabel } from '../../common';
import { makePodStatusLabel } from '../../pod/List';

export function PodGlance({ pod }: { pod: Pod }) {
  const { t } = useTranslation();
  return (
    <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap" key="pod">
      <Box>{makePodStatusLabel(pod)}</Box>
      {pod.spec.containers.map(it => (
        <StatusLabel status="" key={it.name}>
          {t('glossary|Container')}: {it.name}
        </StatusLabel>
      ))}
      {pod.status?.podIP && <StatusLabel status="">IP: {pod.status?.podIP}</StatusLabel>}
    </Box>
  );
}
