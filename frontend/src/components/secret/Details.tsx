import _ from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/k8s/api';
import Secret from '../../lib/k8s/secret';
import { getRoute } from '../../lib/router';
import DeleteButton from '../common/DeleteButton';
import { MainInfoSection, SecretField } from '../common/Resource';

export default function SecretDetails() {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState<Secret | null>(null);

  Secret.useApiGet(setItem, name, namespace);

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
