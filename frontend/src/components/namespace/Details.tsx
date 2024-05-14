import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { LimitRange } from '../../lib/k8s/limitRange';
import Namespace, { KubeNamespace } from '../../lib/k8s/namespace';
import ResourceQuota from '../../lib/k8s/resourceQuota';
import { StatusLabel } from '../common/Label';
import { ConditionsSection, DetailsGrid, OwnedPodsSection } from '../common/Resource';
import DetailsViewSection from '../DetailsViewSection';
import { LimitRangeRenderer } from '../limitRange/List';
import { ResourceQuotaRenderer } from '../resourceQuota/List';

export default function NamespaceDetails() {
  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation(['glossary', 'translation']);

  function makeStatusLabel(namespace: Namespace | null) {
    const status = namespace?.status.phase;
    return <StatusLabel status={status === 'Active' ? 'success' : 'error'}>{status}</StatusLabel>;
  }

  return (
    <DetailsGrid
      resourceType={Namespace}
      name={name}
      withEvents
      extraInfo={item =>
        item && [
          {
            name: t('translation|Status'),
            value: makeStatusLabel(item),
          },
        ]
      }
      extraSections={item =>
        item && [
          {
            id: 'headlamp.namespace-conditions',
            section: item?.status?.conditions && <ConditionsSection resource={item} />,
          },
          {
            id: 'headlamp.namespace-owned-resourcequotas',
            section: <NamespacedResourceQuotasSection resource={item?.jsonData} />,
          },
          {
            id: 'headlamp.namespace-owned-limitranges',
            section: <NamespacedLimitRangesSection resource={item?.jsonData} />,
          },
          {
            id: 'headlamp.namespace-owned-pods',
            section: (
              <OwnedPodsSection hideColumns={['namespace']} resource={item?.jsonData} noSearch />
            ),
          },
          {
            id: 'headlamp.namespace-details-view',
            section: <DetailsViewSection resource={item} />,
          },
        ]
      }
    />
  );
}

export interface NamespacedLimitRangesSectionProps {
  resource: KubeNamespace;
}

export function NamespacedLimitRangesSection(props: NamespacedLimitRangesSectionProps) {
  const { resource } = props;

  const [limitRanges, error] = LimitRange.useList({
    namespace: resource.metadata.name,
  });

  return (
    <LimitRangeRenderer
      hideColumns={['namespace']}
      limitRanges={limitRanges}
      error={error}
      noNamespaceFilter
    />
  );
}

export interface NamespacedResourceQuotasSectionProps {
  resource: KubeNamespace;
}

export function NamespacedResourceQuotasSection(props: NamespacedResourceQuotasSectionProps) {
  const { resource } = props;

  const [resourceQuotas, error] = ResourceQuota.useList({
    namespace: resource.metadata.name,
  });

  return (
    <ResourceQuotaRenderer
      hideColumns={['namespace']}
      resourceQuotas={resourceQuotas}
      error={error}
      noNamespaceFilter
    />
  );
}
