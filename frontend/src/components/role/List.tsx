import React from 'react';
import ClusterRole from '../../lib/k8s/clusterRole';
import Role from '../../lib/k8s/role';
import { timeAgo, useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

interface RolesDict {
  [kind: string]: Role[];
}

export default function RoleList() {
  const [rolesData, dispatch] = React.useReducer(setRoles, {});
  const filterFunc = useFilterFunc();

  function setRoles(roles: RolesDict, newRoles: Role[]) {
    const data = {...roles};

    newRoles.forEach((item) => {
      if (!(item.kind in data)) {
        data[item.kind] = [];
      }
      data[item.kind].push(item);
    });

    return data;
  }

  function getJointItems() {
    let joint: Role[] = [];
    for (const items of Object.values(rolesData)) {
      joint = joint.concat(items);
    }
    return joint;
  }

  Role.useApiList(dispatch);
  ClusterRole.useApiList(dispatch);

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Roles"
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
                routeName={item.metadata.namespace ? 'role' : 'clusterrole'}
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
            getter: (item) => item.metadata.namespace
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
