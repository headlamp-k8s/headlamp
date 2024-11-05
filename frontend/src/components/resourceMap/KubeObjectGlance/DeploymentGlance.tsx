import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { KubeCondition } from '../../../lib/k8s/cluster';
import Deployment from '../../../lib/k8s/deployment';
import { StatusLabel } from '../../common';

export function DeploymentGlance({ deployment }: { deployment: Deployment }) {
  const { t } = useTranslation();
  const { replicas, availableReplicas } = deployment.status;
  const pods = `${availableReplicas || 0}/${replicas || 0}`;

  return (
    <Box display="flex" gap={1} alignItems="center" mt={2} flexWrap="wrap" key="deployment">
      <StatusLabel status="">
        {t('glossary|Pods')}: {pods}
      </StatusLabel>
      {deployment.status.conditions.map((it: KubeCondition) => (
        <StatusLabel status="" key={it.type}>
          {it.type}
        </StatusLabel>
      ))}
    </Box>
  );
}
