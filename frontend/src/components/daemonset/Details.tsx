import React from 'react';
import { useParams } from 'react-router-dom';
import DaemonSet from '../../lib/k8s/daemonSet';
import { ContainersSection, MainInfoSection, MetadataDictGrid, PageGrid } from '../common/Resource';

export default function DaemonSetDetails() {
  const { namespace, name } = useParams();
  const [item, setItem] = React.useState<DaemonSet | null>(null);

  DaemonSet.useApiGet(setItem, name, namespace);

  return (
    <PageGrid>
      <MainInfoSection
        resource={item}
        extraInfo={item && [
          {
            name: 'Update Strategy',
            value: item?.spec.updateStrategy.type,
          },
          {
            name: 'Selector',
            value: <MetadataDictGrid dict={item.spec.selector.matchLabels || {}} />,
          },
        ]}
      />
      <ContainersSection
        resource={item}
      />
    </PageGrid>
  );
}
