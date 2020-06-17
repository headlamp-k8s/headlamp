import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubePersistentVolume } from '../../lib/k8s/cluster';
import { StatusLabel } from '../common/Label';
import { MainInfoSection } from '../common/Resource';

export default function VolumeDetails() {
  const { name } = useParams();
  const [item, setItem] = React.useState<KubePersistentVolume | null>(null);

  useConnectApi(
    api.persistentVolume.get.bind(null, name, setItem),
  );

  function makeStatusLabel(item: KubePersistentVolume) {
    const status = item.status.phase;
    return (
      <StatusLabel status={status === 'Bound' ? 'success' : 'error'}>
        {status}
      </StatusLabel>
    );
  }

  return (
    <MainInfoSection
      resource={item}
      extraInfo={item && [
        {
          name: 'Status',
          value: makeStatusLabel(item),
        },
        {
          name: 'Capacity',
          value: item.spec.capacity.storage,
        },
        {
          name: 'Access Modes',
          value: item.spec.accessModes.join(', '),
        },
        {
          name: 'Reclaim Policy',
          value: item.spec.persistentVolumeReclaimPolicy,
        },
        {
          name: 'Storage Class',
          value: item.spec.storageClassName,
        },
      ]}
    />
  );
}
