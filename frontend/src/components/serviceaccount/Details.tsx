import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeSecretAccount } from '../../lib/k8s/cluster';
import { getRoute } from '../../lib/router';
import DeleteButton from '../common/DeleteButton';
import EditButton from '../common/EditButton';
import { MainInfoSection } from '../common/Resource';

export default function ServiceAccountDetails() {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState<KubeSecretAccount | null>(null);

  console.log(item);

  useConnectApi(
    api.serviceAccount.get.bind(null, namespace, name, setItem),
  );

  function handleApply(newItem: KubeSecretAccount) {
    api.serviceAccount.put(newItem);
  }

  return (
    <MainInfoSection
      resource={item}
      extraInfo={item && [
        {
          name: 'Secrets',
          value: item.secrets.map(({name}) => name).join(', ')
        }
      ]}
      actions={item && [
        <EditButton
          item={item}
          applyCallback={handleApply}
          options={{
            successOptions: {variant: 'success'}
          }}
        />,
        <DeleteButton
          item={item}
          deletionCallback={() => api.serviceAccount.delete(namespace, name)}
          options={{
            startUrl: getRoute('serviceAccounts').path,
            successOptions: {variant: 'success'}
          }}
        />
      ]}
    />
  );
}
