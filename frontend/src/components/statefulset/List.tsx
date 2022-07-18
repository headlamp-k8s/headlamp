import { useTranslation } from 'react-i18next';
import StatefulSet from '../../lib/k8s/statefulSet';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function StatefulSetList() {
  const { t } = useTranslation('glossary');

  function renderPods(statefulSet: StatefulSet) {
    const { readyReplicas, currentReplicas } = statefulSet.status;

    return `${readyReplicas || 0}/${currentReplicas || 0}`;
  }

  return (
    <SectionBox title={<SectionFilterHeader title={t('Stateful Sets')} />}>
      <ResourceTable
        resourceClass={StatefulSet}
        columns={[
          'name',
          'namespace',
          {
            label: t('Pods'),
            getter: statefulSet => renderPods(statefulSet),
            sort: true,
          },
          {
            label: t('Replicas'),
            getter: statefulSet => statefulSet.spec.replicas,
            sort: true,
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
