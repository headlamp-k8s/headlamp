import React from 'react';
import { useParams } from "react-router-dom";
import api, { useConnectApi } from '../../lib/api';
import { MainInfoSection } from '../common/Resource';

export default function StorageClassDetails(props) {
  let { name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.storageClass.get.bind(null, name, setItem),
  );

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