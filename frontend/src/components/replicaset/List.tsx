import { useTranslation } from 'react-i18next';
import ReplicaSet from '../../lib/k8s/replicaSet';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

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
    <SectionBox title={<SectionFilterHeader title={t('Replica Sets')} />}>
      <ResourceTable
        resourceClass={ReplicaSet}
        columns={[
          'name',
          'namespace',
          {
            label: t('Generation'),
            getter: replicaSet => replicaSet.status.observedGeneration,
            sort: true,
          },
          {
            label: t('Replicas'),
            getter: replicaSet => getReplicas(replicaSet),
            sort: sortByReplicas,
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
