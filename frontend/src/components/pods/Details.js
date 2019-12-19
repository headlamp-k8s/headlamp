import React from 'react';
import { useParams } from "react-router-dom";
import api, { useConnectApi } from '../../lib/api';
import { MainInfoSection } from '../common/Resource';

export default function PodDetails(props) {
  let { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.pod.get.bind(null, namespace, name, setItem),
  );

  return (
    <MainInfoSection
      resource={item}
      extraInfo={item && [
        {
          name: 'State',
          value: item.status.phase
        },
        {
          name: 'Host IP',
          value: item.status.hostIP,
        },
        {
          name: 'Pod IP',
          value: item.status.podIP,
        }
      ]}
    />
  );
}
