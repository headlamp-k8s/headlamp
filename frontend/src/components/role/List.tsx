import React from 'react';
import { useTranslation } from 'react-i18next';
import ClusterRole from '../../lib/k8s/clusterRole';
import Role from '../../lib/k8s/role';
import { useErrorState, useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import ResourceListView from '../common/Resource/ResourceListView';

interface RolesDict {
  [kind: string]: Role[] | null;
}

export default function RoleList() {
  const [roles, setRoles] = React.useState<RolesDict | null>(null);
  const [roleError, setRolesError] = useErrorState(setupRoles);
  const [clusterRoleError, setClusterRolesError] = useErrorState(setupClusterRoles);
  const { t } = useTranslation('glossary');
  const filterFunc = useFilterFunc(['.jsonData.kind']);

  function setupRolesWithKind(newRoles: Role[] | null, kind: string) {
    setRoles(oldRoles => ({ ...(oldRoles || {}), [kind]: newRoles }));
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
    <ResourceListView
      title={t('Roles')}
      filterFunction={filterFunc}
      errorMessage={getErrorMessage()}
      columns={[
        'type',
        {
          label: t('translation|Name'),
          getter: item => (
            <Link
              routeName={item.metadata.namespace ? 'role' : 'clusterrole'}
              params={{
                namespace: item.metadata.namespace || '',
                name: item.metadata.name,
              }}
            >
              {item.metadata.name}
            </Link>
          ),
          sort: (r1: Role, r2: Role) => {
            if (r1.metadata.name < r2.metadata.name) {
              return -1;
            } else if (r1.metadata.name > r2.metadata.name) {
              return 1;
            }
            return 0;
          },
        },
        'namespace',
        'age',
      ]}
      data={getJointItems()}
      id="headlamp-roles"
    />
  );
}
