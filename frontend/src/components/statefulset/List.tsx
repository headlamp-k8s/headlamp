import { useTranslation } from 'react-i18next';
import { KubeContainer } from '../../lib/k8s/cluster';
import StatefulSet from '../../lib/k8s/statefulSet';
import { LightTooltip } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';

export default function StatefulSetList() {
  const { t } = useTranslation('glossary');

  function renderPods(statefulSet: StatefulSet) {
    const { readyReplicas, replicas } = statefulSet.status;

    return `${readyReplicas || 0}/${replicas || 0}`;
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
          getValue: statefulSet => renderPods(statefulSet),
          gridTemplate: 0.6,
        },
        {
          id: 'replicas',
          label: t('Replicas'),
          getValue: statefulSet => statefulSet.spec.replicas,
          gridTemplate: 0.6,
        },
        {
          id: 'containers',
          label: t('Containers'),
          getValue: statefulSet =>
            statefulSet
              .getContainers()
              .map(c => c.name)
              .join(', '),
          render: statefulSet => {
            const containerNames = statefulSet.getContainers().map((c: KubeContainer) => c.name);
            const containerTooltip = containerNames.join('\n');
            const containerText = containerNames.join(', ');

            return (
              <LightTooltip title={containerTooltip} interactive>
                {containerText}
              </LightTooltip>
            );
          },
        },
        {
          id: 'images',
          label: t('Images'),
          getValue: statefulSet =>
            statefulSet
              .getContainers()
              .map(it => it.image)
              .join(', '),
          render: statefulSet => {
            const containerImages = statefulSet.getContainers().map((c: KubeContainer) => c.image);
            const containerTooltip = containerImages.join('\n');
            const containerText = containerImages.join(', ');
            return (
              <LightTooltip title={containerTooltip} interactive>
                {containerText}
              </LightTooltip>
            );
          },
        },
        'cluster',
        'age',
      ]}
    />
  );
}
