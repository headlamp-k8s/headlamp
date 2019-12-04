import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/api';
import { MainInfoSection } from '../common/Resource';

export default function WorkloadDetails(props) {
  const { namespace, name } = useParams();
  const { workloadKind } = props;
  const [item, setItem] = React.useState(null);

  useConnectApi(
    getApiConnection(item)
  );

  function getApiConnection() {
    let resourceApi = null;
    switch(workloadKind) {
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
      default:
        break;
    }

    // @todo: Handle error
    return resourceApi.get.bind(null, namespace, name, setItem);
  }

  return (
    <MainInfoSection
      resource={item}
    />
  );
}
