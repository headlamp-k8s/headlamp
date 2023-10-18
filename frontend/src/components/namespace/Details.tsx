import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Namespace from '../../lib/k8s/namespace';
import { StatusLabel } from '../common/Label';
import { ConditionsSection, DetailsGrid, OwnedPodsSection } from '../common/Resource';
import DetailsViewSection from '../DetailsViewSection';

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
            id: 'headlamp.namespace-owned-pods',
            section: <OwnedPodsSection hideColumns={['namespace']} resource={item?.jsonData} />,
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
