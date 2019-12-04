import _ from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { MainInfoSection, SecretField } from '../common/Resource';

export default function SecretDetails(props) {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.secret.get.bind(null, namespace, name, setItem),
  );

  return (
    <MainInfoSection
      resource={item}
      mainInfo={item && _.map(item.data, (value, key) => (
        {
          name: key,
          valueComponent: <SecretField label={key} value={value} />
        }
      ))}
    />
  );
}
