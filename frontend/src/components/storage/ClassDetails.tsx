import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import StorageClass from '../../lib/k8s/storageClass';
import { MainInfoSection } from '../common/Resource';

export default function StorageClassDetails() {
  const { name } = useParams<{ name: string }>();
  const [item, setItem] = React.useState<StorageClass | null>(null);
  const { t } = useTranslation('glossary');

  StorageClass.useApiGet(setItem, name);

  return (
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
  );
}
