import React from 'react';
import { useParams } from 'react-router-dom';
import { StringDict } from '../../lib/k8s/cluster';
import StatefulSet from '../../lib/k8s/statefulSet';
import { MainInfoSection, MetadataDictGrid } from '../common/Resource';

export default function StatefulSetDetails() {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState<StatefulSet | null>(null);

  StatefulSet.useApiGet(setItem, name, namespace);

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
