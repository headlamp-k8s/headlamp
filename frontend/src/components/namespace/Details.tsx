import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DetailsViewPluginRenderer from '../../helpers/renderHelpers';
import Namespace from '../../lib/k8s/namespace';
import { StatusLabel } from '../common/Label';
import { MainInfoSection, PageGrid } from '../common/Resource';

export default function NamespaceDetails() {
  const { name } = useParams<{ name: string }>();
  const [item, setItem] = React.useState<Namespace | null>(null);
  const { t } = useTranslation('glossary');

  Namespace.useApiGet(setItem, name);

  function makeStatusLabel(namespace: Namespace | null) {
    const status = namespace?.status.phase;
    return <StatusLabel status={status === 'Active' ? 'success' : 'error'}>{status}</StatusLabel>;
  }

  return (
    <PageGrid>
      <MainInfoSection
        resource={item}
        extraInfo={
          item && [
            {
              name: t('Status'),
              value: makeStatusLabel(item),
            },
          ]
        }
      />
      <DetailsViewPluginRenderer resource={item} />
    </PageGrid>
  );
}
