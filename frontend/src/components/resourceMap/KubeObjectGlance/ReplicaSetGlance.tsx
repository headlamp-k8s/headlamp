import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import ReplicaSet from '../../../lib/k8s/replicaSet';
import { StatusLabel } from '../../common';

export function ReplicaSetGlance({ set }: { set: ReplicaSet }) {
  const { t } = useTranslation();
  const ready = set.status?.readyReplicas || 0;
  const desired = set.spec?.replicas || 0;

  return (
    <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap" key="sets">
      <StatusLabel status="">
        {t('glossary|Replicas')}: {ready}/{desired}
      </StatusLabel>
    </Box>
  );
}
