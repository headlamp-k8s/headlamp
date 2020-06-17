import React from 'react';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeRoleBinding } from '../../lib/k8s/cluster';
import { timeAgo, useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

interface RoleBindingDict {
  [kind: string]: KubeRoleBinding[];
}

export default function RoleBindingList() {
  const [roleBindingsData, dispatch] = React.useReducer(setRoleBindings, {});
  const filterFunc = useFilterFunc();

  function setRoleBindings(roleBindings: RoleBindingDict, newRoleBindings: KubeRoleBinding[]) {
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
    let joint: KubeRoleBinding[] = [];
    for (const items of Object.values(roleBindingsData)) {
      joint = joint.concat(items);
    }
    return joint;
  }

  useConnectApi(
    api.roleBinding.list.bind(null, null, dispatch),
    api.clusterRoleBinding.list.bind(null, dispatch),
  );

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
              <Link
                routeName={item.metadata.namespace ? 'roleBinding' : 'clusterRoleBinding'}
                params={{
                  namespace: item.metadata.namespace || '',
                  name: item.metadata.name
                }}
              >
                {item.metadata.name}
              </Link>
          },
          {
            label: 'Namespace',
            getter: (item) => item.metadata.namespace || 'All namespaces'
          },
          {
            label: 'Age',
            getter: (item) => timeAgo(item.metadata.creationTimestamp)
          },
        ]}
        data={getJointItems()}
      />
    </SectionBox>
  );
}
