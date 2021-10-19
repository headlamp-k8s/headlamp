import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Namespace from '../../lib/k8s/namespace';
import { StatusLabel } from '../common/Label';
import { DetailsGrid } from '../common/Resource';

export default function NamespaceDetails() {
  const { name } = useParams<{ name: string }>();
  const { t } = useTranslation('glossary');

  function makeStatusLabel(namespace: Namespace | null) {
    const status = namespace?.status.phase;
    return <StatusLabel status={status === 'Active' ? 'success' : 'error'}>{status}</StatusLabel>;
  }

  return (
    <DetailsGrid
      resourceType={Namespace}
      name={name}
      extraInfo={item =>
        item && [
          {
            name: t('Status'),
            value: makeStatusLabel(item),
          },
        ]
      }
    />
  );
}
