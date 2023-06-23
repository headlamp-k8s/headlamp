import { useTranslation } from 'react-i18next';
import StatefulSet from '../../lib/k8s/statefulSet';
import ResourceListView from '../common/Resource/ResourceListView';

export default function StatefulSetList() {
  const { t } = useTranslation('glossary');

  function renderPods(statefulSet: StatefulSet) {
    const { readyReplicas, currentReplicas } = statefulSet.status;

    return `${readyReplicas || 0}/${currentReplicas || 0}`;
  }

  return (
    <ResourceListView
      title={t('Stateful Sets')}
      resourceClass={StatefulSet}
      columns={[
        'name',
        'namespace',
        {
          id: 'pods',
          label: t('Pods'),
          getter: statefulSet => renderPods(statefulSet),
          sort: true,
        },
        {
          id: 'replicas',
          label: t('Replicas'),
          getter: statefulSet => statefulSet.spec.replicas,
          sort: true,
        },
        'age',
      ]}
    />
  );
}
