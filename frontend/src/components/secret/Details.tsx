import _ from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import Secret from '../../lib/k8s/secret';
import { MainInfoSection, SecretField } from '../common/Resource';

export default function SecretDetails() {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState<Secret | null>(null);

  Secret.useApiGet(setItem, name, namespace);

  return (
    <MainInfoSection
      resource={item}
      extraInfo={item && _.map(item.data, (value, key) => (
        {
          name: key,
          value: <SecretField value={value} />
        }
      ))}
    />
  );
}
