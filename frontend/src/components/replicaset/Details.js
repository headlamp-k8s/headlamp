import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { MainInfoSection } from '../common/Resource';

export default function ReplicaSetDetails(props) {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.replicaSet.get.bind(null, namespace, name, setItem),
  );

  return (
    <MainInfoSection
      resource={item}
    />
  );
}
