import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeWorkload } from '../../lib/k8s/cluster';
import { ContainersSection, MainInfoSection, MetadataDictGrid, PageGrid, ReplicasSection } from '../common/Resource';

interface WorkloadDetailsProps {
  workloadKind: string;
}

export default function WorkloadDetails(props: WorkloadDetailsProps) {
  const { namespace, name } = useParams();
  // @todo: Don't use this property for determining the time. Use the actual type instead.
  const { workloadKind } = props;
  const [item, setItem] = React.useState<KubeWorkload | null>(null);

  useConnectApi(
    getApiConnection()
  );

  function getApiConnection() {
    let resourceApi = null;
    switch (workloadKind) {
      case 'StatefulSet':
        resourceApi = api.statefulSet;
        break;
      case 'Deployment':
        resourceApi = api.deployment;
        break;
      case 'DaemonSet':
        resourceApi = api.daemonSet;
        break;
      case 'Job':
        resourceApi = api.job;
        break;
      case 'CronJob':
        resourceApi = api.cronJob;
        break;
      case 'ReplicaSet':
        resourceApi = api.replicaSet;
        break;
      default:
        break;
    }

    // @todo: Handle error
    return resourceApi!.get.bind(null, namespace, name, setItem);
  }

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
      <ReplicasSection resource={item} />
      <ContainersSection resource={item} />
    </PageGrid>
  );
}
