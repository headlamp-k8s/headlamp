import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { ContainersSection, MainInfoSection, MetadataDictGrid, PageGrid, ReplicasSection } from '../common/Resource';

export default function WorkloadDetails(props) {
  const { namespace, name } = useParams();
  const { workloadKind } = props;
  const [item, setItem] = React.useState(null);

  useConnectApi(
    getApiConnection(item)
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
    return resourceApi.get.bind(null, namespace, name, setItem);
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
            value: <MetadataDictGrid dict={item.spec.selector.matchLabels} />,
          },
        ]}
      />
      <ReplicasSection resource={item} />
      <ContainersSection resource={item} />
    </PageGrid>
  );
}
