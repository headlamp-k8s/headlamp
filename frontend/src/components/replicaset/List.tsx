import { useTranslation } from 'react-i18next';
import ReplicaSet from '../../lib/k8s/replicaSet';
import ResourceListView from '../common/Resource/ResourceListView';

export default function ReplicaSetList() {
  const { t } = useTranslation('glossary');

  function getReplicas(replicaSet: ReplicaSet) {
    return `${replicaSet.spec.replicas} / ${replicaSet.status.replicas}`;
  }

  function sortByReplicas(r1: ReplicaSet, r2: ReplicaSet) {
    const totalReplicasDiff = r1.status.replicas - r2.status.replicas;
    if (totalReplicasDiff === 0) {
      return r1.spec.replicas - r2.spec.replicas;
    }

    return totalReplicasDiff;
  }

  return (
    <ResourceListView
      title={t('Replica Sets')}
      resourceClass={ReplicaSet}
      columns={[
        'name',
        'namespace',
        {
          id: 'generation',
          label: t('Generation'),
          getter: replicaSet => replicaSet.status.observedGeneration,
          sort: true,
        },
        {
          id: 'replicas',
          label: t('Replicas'),
          getter: replicaSet => getReplicas(replicaSet),
          sort: sortByReplicas,
        },
        'age',
      ]}
    />
  );
}
