import React from 'react';
import { useTranslation } from 'react-i18next';
import ClusterRoleBinding from '../../lib/k8s/clusterRoleBinding';
import RoleBinding from '../../lib/k8s/roleBinding';
import { useErrorState, useFilterFunc } from '../../lib/util';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

interface RoleBindingDict {
  [kind: string]: RoleBinding[] | null;
}

export default function RoleBindingList() {
  const [bindings, setBindings] = React.useState<RoleBindingDict | null>(null);
  const [roleBindingError, onRoleBindingError] = useErrorState(setupRoleBindings);
  const [clusterRoleBindingError, onClusterRoleBindingError] =
    useErrorState(setupClusterRoleBindings);
  const { t } = useTranslation(['glossary', 'frequent']);
  const filterFunc = useFilterFunc(['.jsonData.kind']);

  function setRoleBindings(newBindings: RoleBinding[] | null, kind: string) {
    setBindings(currentBindings => ({ ...currentBindings, [kind]: newBindings }));
  }

  function setupRoleBindings(newBindings: RoleBinding[] | null) {
    setRoleBindings(newBindings, 'RoleBinding');
  }

  function setupClusterRoleBindings(newBindings: RoleBinding[] | null) {
    setRoleBindings(newBindings, 'ClusterRoleBinding');
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
    <SectionBox title={<SectionFilterHeader title={t('Role Bindings')} />}>
      <ResourceTable
        filterFunction={filterFunc}
        errorMessage={getErrorMessage()}
        columns={[
          'type',
          'name',
          {
            label: t('glossary|Namespace'),
            getter: item => item.getNamespace() || t('frequent|All namespaces'),
            sort: true,
          },
          'age',
        ]}
        data={getJointItems()}
      />
    </SectionBox>
  );
}
