import React from 'react';
import { useTranslation } from 'react-i18next';
import ClusterRole from '../../lib/k8s/clusterRole';
import Role from '../../lib/k8s/role';
import {
  combineClusterListErrors,
  flattenClusterListItems,
  getClusterGroup,
  useFilterFunc,
} from '../../lib/util';
import Link from '../common/Link';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function RoleList() {
  const [roles, rolesErrors] = Role.useListPerCluster();
  const [clusterRoles, clusterRolesErrors] = ClusterRole.useListPerCluster();
  const { t } = useTranslation('glossary');
  const filterFunc = useFilterFunc(['.jsonData.kind']);
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
    <SectionBox title={<SectionFilterHeader title={t('Roles')} />}>
      <ResourceTable
        filterFunction={filterFunc}
        errorMessage={getErrorMessage()}
        clusterErrors={isMultiCluster ? allErrors : null}
        columns={[
          'type',
          {
            label: t('frequent|Name'),
            getter: item => (
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
          'cluster',
          'age',
        ]}
        data={allRoles}
      />
    </SectionBox>
  );
}
