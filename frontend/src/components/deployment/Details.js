import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { ContainersSection, MainInfoSection, MetadataDictGrid, PageGrid, ReplicasSection } from '../common/Resource';

export default function Deployment() {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState(null);

  useConnectApi(
    api.deployment.get.bind(null, namespace, name, setItem),
  );

  return (
    <PageGrid
      sections={[
        <MainInfoSection
          resource={item}
          extraInfo={item && [
            {
              name: 'Strategy Type',
              value: item.spec.strategy.type,
            },
            {
              name: 'Selector',
              value: <MetadataDictGrid dict={item.spec.selector.matchLabels} />,
            },
          ]}
        />
        ,
        <ReplicasSection resource={item} />,
      ]}
    />
  );
}

