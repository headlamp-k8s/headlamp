import { useTranslation } from 'react-i18next';
import { KubeContainer } from '../../lib/k8s/cluster';
import ReplicaSet from '../../lib/k8s/replicaSet';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { LightTooltip, Link } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';

export default function ReplicaSetList() {
  const { t } = useTranslation(['glossary', 'translation']);

  // NOTEZ: Will need to use slices of state for both drwaerEnabled and drawerOpen for every list view
  const drawerEnabled = useTypedSelector(state => state.drawerMode.isDetailDrawerEnabled);

  return (
    <>
      <ResourceListView
        title={t('Replica Sets')}
        resourceClass={ReplicaSet}
        columns={[
          // 'name',
          {
            id: 'name',
            label: t('translation|Name'),
            getter: (replicaSet: ReplicaSet) => {
              if (drawerEnabled) {
                return (
                  <>
                    <Link kubeObject={replicaSet} drawerEnabled={drawerEnabled} />
                  </>
                );
              }

              return <Link kubeObject={replicaSet} />;
            },
            sort: true,
          },
          'namespace',
          {
            id: 'generation',
            label: t('Generation'),
            getter: replicaSet => replicaSet?.status?.observedGeneration,
            sort: true,
            show: false,
          },
          {
            id: 'currentReplicas',
            label: t('translation|Current', { context: 'replicas' }),
            getter: replicaSet => replicaSet?.status?.replicas || 0,
            gridTemplate: 0.6,
            sort: true,
          },
          {
            id: 'desiredReplicas',
            label: t('translation|Desired', { context: 'replicas' }),
            getter: replicaSet => replicaSet?.spec?.replicas || 0,
            gridTemplate: 0.6,
            sort: true,
          },
          {
            id: 'readyReplicas',
            label: t('translation|Ready'),
            getter: replicaSet => replicaSet?.status?.readyReplicas || 0,
            gridTemplate: 0.6,
            sort: true,
          },
          {
            id: 'containers',
            label: t('Containers'),
            getter: replicaSet => {
              const containerText = replicaSet
                .getContainers()
                .map((c: KubeContainer) => c.name)
                .join('\n');
              return (
                <LightTooltip title={containerText} interactive>
                  {containerText}
                </LightTooltip>
              );
            },
            sort: (rs1, rs2) => {
              const containers1 = rs1
                .getContainers()
                .map((c: KubeContainer) => c.name)
                .join('');
              const containers2 = rs2
                .getContainers()
                .map((c: KubeContainer) => c.name)
                .join('');
              return containers1.localeCompare(containers2);
            },
          },
          {
            id: 'images',
            label: t('Images'),
            getter: replicaSet => {
              const imageText = replicaSet
                .getContainers()
                .map((c: KubeContainer) => c.image)
                .join('\n');
              return (
                <LightTooltip title={imageText} interactive>
                  {imageText}
                </LightTooltip>
              );
            },
            sort: (rs1, rs2) => {
              const images1 = rs1
                .getContainers()
                .map((c: KubeContainer) => c.image)
                .join('');
              const images2 = rs2
                .getContainers()
                .map((c: KubeContainer) => c.image)
                .join('');
              return images1.localeCompare(images2);
            },
          },
          {
            id: 'selector',
            label: t('Selector'),
            getter: replicaSet => {
              const selectorText = replicaSet.getMatchLabelsList().join('\n');
              return (
                selectorText && (
                  <LightTooltip title={selectorText} interactive>
                    {selectorText}
                  </LightTooltip>
                )
              );
            },
            sort: true,
          },
          'age',
        ]}
      />
    </>
  );
}
