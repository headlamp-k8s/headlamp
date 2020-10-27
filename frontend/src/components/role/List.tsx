import React from 'react';
import ClusterRole from '../../lib/k8s/clusterRole';
import Role from '../../lib/k8s/role';
import { timeAgo, useErrorState, useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

interface RolesDict {
  [kind: string]: Role[] | null;
}

export default function RoleList() {
  const [roles, setRoles] = React.useState<RolesDict | null>(null);
  const [roleError, setRolesError] = useErrorState(setupRoles);
  const [clusterRoleError, setClusterRolesError] = useErrorState(setupClusterRoles);
  const filterFunc = useFilterFunc();

  function setupRolesWithKind(newRoles: Role[] | null, kind: string) {
    const currentRoles: RolesDict = roles || {};
    const data = {...currentRoles};

    data[kind] = newRoles;
    setRoles(data);
  }

  function setupRoles(roles: Role[] | null) {
    setupRolesWithKind(roles, 'Role');
  }

  function setupClusterRoles(roles: ClusterRole[] | null) {
    setupRolesWithKind(roles, 'ClusterRole');
  }

  function getJointItems() {
    if (roles === null) {
      return null;
    }

    let joint: Role[] = [];
    let hasItems = false;

    for (const items of Object.values(roles)) {
      if (items !== null) {
        joint = joint.concat(items);
        hasItems = true;
      }
    }

    return hasItems ? joint : null;
  }

  function getErrorMessage() {
    if (getJointItems() === null) {
      return Role.getErrorMessage(roleError || clusterRoleError);
    }

    return null;
  }

  Role.useApiList(setupRoles, setRolesError);
  ClusterRole.useApiList(setupClusterRoles, setClusterRolesError);

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
        errorMessage={getErrorMessage()}
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
              </Link>,
            sort: (r1: Role, r2: Role) => {
              if (r1.metadata.name < r2.metadata.name) {
                return -1;
              } else if (r1.metadata.name > r2.metadata.name) {
                return 1;
              }
              return 0;
            }
          },
          {
            label: 'Namespace',
            getter: (item) => item.metadata.namespace
          },
          {
            label: 'Age',
            getter: (item) => timeAgo(item.metadata.creationTimestamp),
            sort: (r1: Role, r2: Role) =>
              new Date(r2.metadata.creationTimestamp).getTime() -
              new Date(r1.metadata.creationTimestamp).getTime()
          },
        ]}
        data={getJointItems()}
        defaultSortingColumn={4}
      />
    </SectionBox>
  );
}
