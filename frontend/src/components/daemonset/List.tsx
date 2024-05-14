import { useTranslation } from 'react-i18next';
import { KubeContainer } from '../../lib/k8s/cluster';
import DaemonSet from '../../lib/k8s/daemonSet';
import { LightTooltip } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';

export default function DaemonSetList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Daemon Sets')}
      resourceClass={DaemonSet}
      columns={[
        'name',
        'namespace',
        {
          id: 'pods',
          label: t('Pods'),
          getValue: daemonSet => daemonSet.status?.currentNumberScheduled || 0,
          gridTemplate: 0.6,
        },
        {
          id: 'currentPods',
          label: t('translation|Current'),
          getValue: daemonSet => daemonSet.status?.currentNumberScheduled || 0,
          gridTemplate: 0.6,
        },
        {
          id: 'desiredPods',
          label: t('translation|Desired', { context: 'pods' }),
          getValue: daemonSet => daemonSet.status?.desiredNumberScheduled || 0,
          gridTemplate: 0.6,
        },
        {
          id: 'readyPods',
          label: t('translation|Ready'),
          getValue: daemonSet => daemonSet.status?.numberReady || 0,
          gridTemplate: 0.6,
        },
        {
          id: 'nodeSelector',
          label: t('Node Selector'),
          getValue: daemonSet => daemonSet.getNodeSelectors().join(', '),
          render: daemonSet => {
            const selectors = daemonSet.getNodeSelectors();
            const nodeSelectorTooltip = selectors.join('\n');
            const nodeSelectorText = selectors.join(', ');
            return (
              <LightTooltip title={nodeSelectorTooltip} interactive>
                {nodeSelectorText}
              </LightTooltip>
            );
          },
        },
        {
          id: 'containers',
          label: t('Containers'),
          getValue: daemonSet =>
            daemonSet
              .getContainers()
              .map((c: KubeContainer) => c.name)
              .join(', '),
          render: daemonSet => {
            const containerNames = daemonSet.getContainers().map((c: KubeContainer) => c.name);
            const containerText = containerNames.join(', ');
            const containerTooltip = containerNames.join('\n');
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
          getValue: daemonSet =>
            daemonSet
              .getContainers()
              .map((c: KubeContainer) => c.image)
              .join(', '),
          render: daemonSet => {
            const images = daemonSet.getContainers().map((c: KubeContainer) => c.image);
            const imageTooltip = images.join('\n');
            const imageText = images.join(', ');
            return (
              <LightTooltip title={imageTooltip} interactive>
                {imageText}
              </LightTooltip>
            );
          },
        },
        'age',
      ]}
    />
  );
}
