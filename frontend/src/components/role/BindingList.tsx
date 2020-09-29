import React from 'react';
import ClusterRoleBinding from '../../lib/k8s/clusterRoleBinding';
import RoleBinding from '../../lib/k8s/roleBinding';
import { useErrorState, useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

interface RoleBindingDict {
  [kind: string]: RoleBinding[] | null;
}

export default function RoleBindingList() {
  const [bindings, setBindings] = React.useState<RoleBindingDict | null>(null);
  const [roleBindingError, onRoleBindingError] = useErrorState(setupRoleBindings);
  const [clusterRoleBindingError, onClusterRoleBindingError] =
    useErrorState(setupClusterRoleBindings);
  const filterFunc = useFilterFunc();

  function setRoleBindings(newBindings: RoleBinding[] | null, kind: string) {
    const currentBindings: RoleBindingDict = bindings || {};
    const data = {...currentBindings};

    data[kind] = newBindings;

    setBindings(data);
  }

  function setupRoleBindings(newBindgins: RoleBinding[] | null) {
    setRoleBindings(newBindgins, 'RoleBinding');
  }

  function setupClusterRoleBindings(newBindgins: RoleBinding[] | null) {
    setRoleBindings(newBindgins, 'ClusterRoleBinding');
  }

  function getJointItems() {
    if (!bindings) {
      return null;
    }

    let joint: RoleBinding[] = [];
    let hasItems = false;
    for (const items of Object.values(bindings as object)) {
      if (items !== null) {
        joint = joint.concat(items);
        hasItems = true;
      }
    }

    return hasItems ? joint : null;
  }

  function getErrorMessage() {
    if (getJointItems() === null) {
      return RoleBinding.getErrorMessage(roleBindingError || clusterRoleBindingError);
    }

    return null;
  }

  RoleBinding.useApiList(setupRoleBindings, onRoleBindingError);
  ClusterRoleBinding.useApiList(setupClusterRoleBindings, onClusterRoleBindingError);

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
        errorMessage={getErrorMessage()}
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
