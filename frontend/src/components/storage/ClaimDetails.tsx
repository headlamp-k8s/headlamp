import React from 'react';
import { useParams } from 'react-router-dom';
import PersistentVolumeClaim from '../../lib/k8s/persistentVolumeClaim';
import { StatusLabel } from '../common/Label';
import { MainInfoSection } from '../common/Resource';

export default function VolumeClaimDetails() {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState<PersistentVolumeClaim | null>(null);

  PersistentVolumeClaim.useApiGet(setItem, name, namespace);

  function makeStatusLabel(item: PersistentVolumeClaim) {
    const status = item.status!.phase;
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
          value: item.spec!.resources.requests.storage
        },
        {
          name: 'Access Modes',
          value: item.spec!.accessModes.join(', '),
        },
        {
          name: 'Volume Mode',
          value: item.spec!.volumeMode,
        },
        {
          name: 'Storage Class',
          value: item.spec!.storageClassName,
        },
      ]}
    />
  );
}
