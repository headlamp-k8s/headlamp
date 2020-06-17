import _ from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeSecret } from '../../lib/k8s/cluster';
import { getRoute } from '../../lib/router';
import DeleteButton from '../common/DeleteButton';
import { MainInfoSection, SecretField } from '../common/Resource';

export default function SecretDetails() {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState<KubeSecret | null>(null);

  useConnectApi(
    api.secret.get.bind(null, namespace, name, setItem),
  );

  function handleDelete() {
    api.secret.delete(namespace, name);
  }

  return (
    <MainInfoSection
      resource={item}
      extraInfo={item && _.map(item.data, (value, key) => (
        {
          name: key,
          value: <SecretField value={value} />
        }
      ))}
      actions={item && [
        <DeleteButton
          item={item}
          deletionCallback={handleDelete}
          options={{startUrl: getRoute('secrets').path}}
        />
      ]}
    />
  );
}
