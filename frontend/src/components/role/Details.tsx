import React from 'react';
import { useParams } from 'react-router-dom';
import ClusterRole from '../../lib/k8s/clusterRole';
import Role from '../../lib/k8s/role';
import Loader from '../common/Loader';
import { MainInfoSection, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function RoleDetails() {
  const { namespace = undefined, name } = useParams();
  const [item, setItem] = React.useState<Role | null>(null);

  let cls = Role;
  if (!namespace) {
    cls = ClusterRole;
  }

  cls.useApiGet(setItem, name!, namespace);

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
