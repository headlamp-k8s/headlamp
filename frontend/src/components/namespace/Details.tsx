import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeNamespace } from '../../lib/k8s/cluster';
import { StatusLabel } from '../common/Label';
import { MainInfoSection } from '../common/Resource';

export default function NamespaceDetails() {
  const { name } = useParams();
  const [item, setItem] = React.useState<KubeNamespace | null>(null);

  useConnectApi(
    api.namespace.get.bind(null, name, setItem),
  );

  function makeStatusLabel(namespace: KubeNamespace | null) {
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
