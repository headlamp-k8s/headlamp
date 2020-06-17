import React from 'react';
import { useParams } from 'react-router-dom';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeRole } from '../../lib/k8s/cluster';
import Loader from '../common/Loader';
import { MainInfoSection, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function RoleDetails() {
  const { namespace = null, name } = useParams();
  const [item, setItem] = React.useState<KubeRole | null>(null);

  useConnectApi(
    (namespace ?
      api.role.get.bind(null, namespace, name, setItem)
      :
      api.clusterRole.get.bind(null, name, setItem))
  );

  return (
    !item ? <Loader /> :
    <PageGrid>
      <MainInfoSection

        resource={item}
      />
      <SectionBox title="Rules">
        <SimpleTable
          columns={[
            {
              label: 'API Groups',
              getter: ({apiGroups}) => apiGroups.join(', ')
            },
            {
              label: 'Resources',
              getter: ({resources}) => resources.join(', ')
            },
            {
              label: 'Non Resources',
              getter: ({nonResources = []}) => nonResources.join(', ')
            },
            {
              label: 'Verbs',
              getter: ({verbs}) => verbs.join(', ')
            }
          ]}
          data={item.rules}
        />
      </SectionBox>
    </PageGrid>
  );
}
