import React from 'react';
import ClusterRoleBinding from '../../lib/k8s/clusterRoleBinding';
import RoleBinding from '../../lib/k8s/roleBinding';
import { useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

interface RoleBindingDict {
  [kind: string]: RoleBinding[];
}

export default function RoleBindingList() {
  const [roleBindingsData, dispatch] = React.useReducer(setRoleBindings, {});
  const filterFunc = useFilterFunc();

  function setRoleBindings(roleBindings: RoleBindingDict, newRoleBindings: RoleBinding[]) {
    const data = {...roleBindings};

    newRoleBindings.forEach((item) => {
      if (!(item.kind in data)) {
        data[item.kind] = [];
      }

      data[item.kind].push(item);
    });

    return data;
  }

  function getJointItems() {
    let joint: RoleBinding[] = [];
    for (const items of Object.values(roleBindingsData)) {
      joint = joint.concat(items);
    }
    return joint;
  }

  RoleBinding.useApiList(dispatch);
  ClusterRoleBinding.useApiList(dispatch);

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Role Bindings"
        />
      }
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        columns={[
          {
            label: 'Type',
            getter: (item) => item.kind
          },
          {
            label: 'Name',
            getter: (item) =>
              <Link kubeObject={item} />
          },
          {
            label: 'Namespace',
            getter: (item) => item.getNamespace() || 'All namespaces'
          },
          {
            label: 'Age',
            getter: (item) => item.getAge()
          },
        ]}
        data={getJointItems()}
      />
    </SectionBox>
  );
}
