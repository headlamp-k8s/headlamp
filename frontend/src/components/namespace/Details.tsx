import React from 'react';
import { useParams } from 'react-router-dom';
import Namespace from '../../lib/k8s/namespace';
import { StatusLabel } from '../common/Label';
import { MainInfoSection } from '../common/Resource';

export default function NamespaceDetails() {
  const { name } = useParams();
  const [item, setItem] = React.useState<Namespace | null>(null);

  Namespace.useApiGet(setItem, name);

  function makeStatusLabel(namespace: Namespace | null) {
    const status = namespace?.status.phase;
    return (
      <StatusLabel status={status === 'Active' ? 'success' : 'error'}>
        {status}
      </StatusLabel>
    );
  }

  return (
    <MainInfoSection
      resource={item}
      extraInfo={item && [{
        name: 'Status',
        value: makeStatusLabel(item),
      }]}
    />
  );
}
