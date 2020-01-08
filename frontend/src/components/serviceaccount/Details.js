import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { getRoute } from '../../lib/router';
import DeleteButton from '../common/DeleteButton';
import EditButton from '../common/EditButton';
import { MainInfoSection } from '../common/Resource';

export default function ServiceAccountDetails(props) {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  console.log(item);

  useConnectApi(
    api.serviceAccount.get.bind(null, namespace, name, setItem),
  );

  function handleApply(newItem) {
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
