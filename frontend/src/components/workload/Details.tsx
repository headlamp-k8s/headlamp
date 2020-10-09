import React from 'react';
import { useParams } from 'react-router-dom';
import { KubeObject, Workload } from '../../lib/k8s/cluster';
import { ContainersSection, MainInfoSection, MetadataDictGrid, PageGrid, ReplicasSection } from '../common/Resource';

interface WorkloadDetailsProps {
  workloadKind: KubeObject;
}

export default function WorkloadDetails(props: WorkloadDetailsProps) {
  const { namespace, name } = useParams();
  const { workloadKind } = props;
  const [item, setItem] = React.useState<Workload | null>(null);

  workloadKind.useApiGet(setItem, name, namespace);

  return (
    <PageGrid>
      <MainInfoSection

        resource={item}
        extraInfo={item && [
          {
            name: 'Strategy Type',
            value: item.spec.strategy && item.spec.strategy.type,
            hide: !item.spec.strategy
          },
          {
            name: 'Selector',
            value: item.spec.selector &&
              <MetadataDictGrid
                dict={item.spec.selector.matchLabels as {[key: string]: string}}
              />,
          },
        ]}
      />
      <ReplicasSection resource={item?.jsonData} />
      <ContainersSection resource={item?.jsonData} />
    </PageGrid>
  );
}
