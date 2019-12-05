import React from 'react';
import { useParams } from "react-router-dom";
import api, { useConnectApi } from '../../lib/api';
import { MainInfoSection } from '../common/Resource';

export default function ServiceAccountDetails(props) {
  let { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  console.log(item)

  useConnectApi(
    api.serviceAccount.get.bind(null, namespace, name, setItem),
  );

  return (
    <MainInfoSection
      resource={item}
      extraInfo={item && [
        {
          name: 'Secrets',
          value: item.secrets.map(({name}) => name).join(', ')
        }
      ]}
    />
  );
}
