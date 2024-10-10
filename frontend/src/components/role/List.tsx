import React from 'react';
import { useTranslation } from 'react-i18next';
import ClusterRole from '../../lib/k8s/clusterRole';
import Role from '../../lib/k8s/role';
import { combineClusterListErrors, flattenClusterListItems, getClusterGroup } from '../../lib/util';
import Link from '../common/Link';
import ResourceListView from '../common/Resource/ResourceListView';
import { ColumnType } from '../common/Resource/ResourceTable';

export default function RoleList() {
  const { t } = useTranslation('glossary');
  const [roles, rolesErrors] = Role.useListPerCluster();
  const [clusterRoles, clusterRolesErrors] = ClusterRole.useListPerCluster();

  const clusters = getClusterGroup();
  const isMultiCluster = clusters.length > 1;

  const allRoles = React.useMemo(() => {
    return flattenClusterListItems(roles, clusterRoles);
  }, [roles, clusterRoles]);

  const allErrors = React.useMemo(() => {
    return combineClusterListErrors(rolesErrors, clusterRolesErrors);
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
      //@todo: multi, clusterErrors needs to be added to ResourceListView
      // clusterErrors={isMultiCluster ? allErrors : null}
      columns={[
        'type',
        {
          label: t('translation|Name'),
          getValue: item => item.metadata.namespace,
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
