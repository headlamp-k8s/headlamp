import React from 'react';
import { useParams } from 'react-router-dom';
import StorageClass from '../../lib/k8s/storageClass';
import { MainInfoSection } from '../common/Resource';

export default function StorageClassDetails() {
  const { name } = useParams();
  const [item, setItem] = React.useState<StorageClass | null>(null);

  StorageClass.useApiGet(setItem, name);

  return (
    <MainInfoSection
      resource={item}
      extraInfo={item && [
        {
          name: 'Reclaim Policy',
          value: item.reclaimPolicy,
        },
        {
          name: 'Binding Mode',
          value: item.volumeBindingMode,
        },
        {
          name: 'Provisioner',
          value: item.provisioner,
        },
      ]}
    />
  );
}
