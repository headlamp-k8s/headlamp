import React from 'react';
import { useTranslation } from 'react-i18next';
import { useClusterGroup } from '../../lib/k8s';
import ClusterRole from '../../lib/k8s/clusterRole';
import Role from '../../lib/k8s/role';
import { combineClusterListErrors } from '../../lib/util';
import { useNamespaces } from '../../redux/filterSlice';
import Link from '../common/Link';
import ResourceListView from '../common/Resource/ResourceListView';
import { ColumnType } from '../common/Resource/ResourceTable';

export default function RoleList() {
  const { t } = useTranslation('glossary');
  const { items: roles, clusterErrors: rolesErrors } = Role.useList({ namespace: useNamespaces() });
  const { items: clusterRoles, clusterErrors: clusterRolesErrors } = ClusterRole.useList();

  const clusters = useClusterGroup();
  const isMultiCluster = clusters.length > 1;

  const allRoles = React.useMemo(() => {
    if (roles === null && clusterRoles === null) {
      return null;
    }

    return roles ? roles.concat(clusterRoles || []) : clusterRoles;
  }, [roles, clusterRoles]);

  const allErrors = React.useMemo(() => {
    return combineClusterListErrors(rolesErrors || null, clusterRolesErrors || null);
  }, [rolesErrors, clusterRolesErrors]);

  function getErrorMessage() {
    if (Object.values(allErrors || {}).length === clusters.length && clusters.length > 1) {
      return Role.getErrorMessage(Object.values(allErrors!)[0]);
    }

    return null;
  }

  return (
    <ResourceListView
      title={t('Roles')}
      errorMessage={getErrorMessage()}
      clusterErrors={isMultiCluster ? allErrors : null}
      columns={[
        'type',
        {
          label: t('translation|Name'),
          getValue: item => item.metadata.name,
          gridTemplate: 'auto',
          render: item => (
            <Link
              routeName={item.metadata.namespace ? 'role' : 'clusterrole'}
              params={{
                namespace: item.metadata.namespace || '',
                name: item.metadata.name,
                cluster: item.cluster,
              }}
            >
              {item.metadata.name}
            </Link>
          ),
        },
        'namespace',
        ...(isMultiCluster ? (['cluster'] as ColumnType[]) : ([] as ColumnType[])),
        'age',
      ]}
      data={allRoles}
      id="headlamp-roles"
    />
  );
}
