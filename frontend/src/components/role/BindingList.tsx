import React from 'react';
import { useTranslation } from 'react-i18next';
import ClusterRoleBinding from '../../lib/k8s/clusterRoleBinding';
import RoleBinding from '../../lib/k8s/roleBinding';
import {
  combineClusterListErrors,
  flattenClusterListItems,
  getClusterGroup,
  useFilterFunc,
} from '../../lib/util';
import { Link } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function RoleBindingList() {
  const [roleBindings, roleBindingsError] = RoleBinding.useListPerCluster();
  const [clusterRoleBindings, clusterRoleBindingsError] = ClusterRoleBinding.useListPerCluster();
  const { t } = useTranslation(['glossary', 'frequent']);
  const filterFunc = useFilterFunc(['.jsonData.kind']);
  const clusters = getClusterGroup();
  const isMultiCluster = clusters.length > 1;

  const bindings = React.useMemo(() => {
    return flattenClusterListItems(roleBindings, clusterRoleBindings);
  }, [roleBindings, clusterRoleBindings]);

  const bindingErrors = React.useMemo(() => {
    return combineClusterListErrors(roleBindingsError, clusterRoleBindingsError);
  }, [roleBindingsError, clusterRoleBindingsError]);

  function getJointItems() {
    if (!bindings) {
      return null;
    }

    let joint: RoleBinding[] = [];
    for (const items of Object.values(bindings)) {
      joint = joint.concat(items);
    }

    return joint.length > 0 ? joint : null;
  }

  function getErrorMessage() {
    if (Object.values(bindingErrors || {}).length === clusters.length && clusters.length > 1) {
      return RoleBinding.getErrorMessage(Object.values(bindingErrors!)[0]);
    }

    return null;
  }

  return (
    <SectionBox title={<SectionFilterHeader title={t('Role Bindings')} />}>
      <ResourceTable
        filterFunction={filterFunc}
        errorMessage={getErrorMessage()}
        clusterErrors={isMultiCluster ? bindingErrors : null}
        columns={[
          'type',
          'name',
          {
            label: t('glossary|Namespace'),
            getter: item =>
              item.getNamespace() ? (
                <Link routeName="namespace" params={{ name: item.getNamespace() }}>
                  {item.getNamespace()}
                </Link>
              ) : (
                t('frequent|All namespaces')
              ),
            sort: true,
          },
          'cluster',
          'age',
        ]}
        data={getJointItems()}
      />
    </SectionBox>
  );
}
