import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('glossary');
  const filterFunc = useFilterFunc(['.kind']);

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
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={getErrorMessage()}
        columns={[
          {
            label: t('Type'),
            getter: item => item.kind,
            sort: true,
          },
          {
            label: t('frequent|Name'),
            getter: item => <Link kubeObject={item} />,
            sort: (r1: RoleBinding, r2: RoleBinding) => {
              if (r1.metadata.name < r2.metadata.name) {
                return -1;
              } else if (r1.metadata.name > r2.metadata.name) {
                return 1;
              }
              return 0;
            },
          },
          {
            label: t('glossary|Namespace'),
            getter: item => item.getNamespace() || 'All namespaces',
            sort: true,
          },
          {
            label: t('frequent|Age'),
            getter: item => item.getAge(),
            sort: (r1: RoleBinding, r2: RoleBinding) =>
              new Date(r2.metadata.creationTimestamp).getTime() -
              new Date(r1.metadata.creationTimestamp).getTime(),
          },
        ]}
        data={getJointItems()}
        defaultSortingColumn={4}
      />
    </SectionBox>
  );
}
