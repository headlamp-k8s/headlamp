import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DetailsViewPluginRenderer from '../../helpers/renderHelpers';
import StorageClass from '../../lib/k8s/storageClass';
import { MainInfoSection, PageGrid } from '../common/Resource';

export default function StorageClassDetails() {
  const { name } = useParams<{ name: string }>();
  const [item, setItem] = React.useState<StorageClass | null>(null);
  const { t } = useTranslation('glossary');

  StorageClass.useApiGet(setItem, name);

  return (
    <PageGrid>
      <MainInfoSection
        resource={item}
        extraInfo={
          item && [
            {
              name: t('Reclaim Policy'),
              value: item.reclaimPolicy,
            },
            {
              name: t('Binding Mode'),
              value: item.volumeBindingMode,
            },
            {
              name: t('Provisioner'),
              value: item.provisioner,
            },
          ]
        }
      />
      <DetailsViewPluginRenderer resource={item} />
    </PageGrid>
  );
}
