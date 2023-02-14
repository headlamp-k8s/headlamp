import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import StorageClass from '../../lib/k8s/storageClass';
import { DetailsGrid } from '../common/Resource';

export default function StorageClassDetails() {
  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation('glossary');

  return (
    <DetailsGrid
      resourceType={StorageClass}
      name={name}
      withEvents
      extraInfo={item =>
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
