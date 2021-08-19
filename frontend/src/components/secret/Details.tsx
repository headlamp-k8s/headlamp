import _ from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import Secret from '../../lib/k8s/secret';
import { MainInfoSection, PageGrid, SecretField } from '../common/Resource';

export default function SecretDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();
  const [item, setItem] = React.useState<Secret | null>(null);

  Secret.useApiGet(setItem, name, namespace);

  return (
    <PageGrid>
      <MainInfoSection
        resource={item}
        extraInfo={
          item &&
          _.map(item.data, (value, key) => ({
            name: key,
            value: <SecretField value={value} />,
          }))
        }
      />
    </PageGrid>
  );
}
