import React from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/k8s/api';
import ClusterRoleBinding from '../../lib/k8s/clusterRoleBinding';
import RoleBinding from '../../lib/k8s/roleBinding';
import { getRoute } from '../../lib/router';
import DeleteButton from '../common/DeleteButton';
import Loader from '../common/Loader';
import { MainInfoSection, PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function RoleBindingDetails() {
  const { namespace = undefined, name } = useParams();
  const [item, setItem] = React.useState<RoleBinding | null>(null);

  let cls = RoleBinding;
  if (!namespace) {
    cls = ClusterRoleBinding;
  }

  cls.useApiGet(setItem, name, namespace);

  function handleDelete() {
    if (namespace) {
      api.roleBinding.delete(namespace, name);
    } else {
      api.clusterRoleBinding.delete(name);
    }
  }

  return (
    !item ? <Loader /> :
    <PageGrid>
      <MainInfoSection

        resource={item}
        extraInfo={[
          {
            name: 'Reference Kind',
            value: item.roleRef.kind,
          },
          {
            name: 'Reference Name',
            value: item.roleRef.name,
          },
          {
            name: 'Ref. API Group',
            value: item.roleRef.apiGroup,
          }
        ]}
        actions={item && [
          <DeleteButton
            item={item}
            deletionCallback={handleDelete}
            options={{startUrl: getRoute('roleBindings').path}}
          />
        ]}
      />
      <SectionBox title="Binding Info">
        <SimpleTable
          data={item.subjects}
          columns={[
            {
              label: 'Kind',
              getter: item => item.kind,
            },
            {
              label: 'Name',
              getter: item => item.name,
            },
            {
              label: 'Namespace',
              getter: item => item.namespace,
            },
          ]}
        />
      </SectionBox>
    </PageGrid>
  );
}
