import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeStatefulSet, StringDict } from '../../lib/k8s/cluster';
import { MainInfoSection, MetadataDictGrid } from '../common/Resource';

export default function StatefulSet() {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState<KubeStatefulSet | null>(null);

  useConnectApi(
    api.statefulSet.get.bind(null, namespace, name, setItem),
  );

  return (
    <MainInfoSection
      resource={item}
      extraInfo={item && [
        {
          name: 'Update Strategy',
          value: item.spec.updateStrategy.type,
        },
        {
          name: 'Selector',
          value: <MetadataDictGrid dict={item.spec.selector.matchLabels as StringDict} />,
        },
      ]}
    />
  );
}
