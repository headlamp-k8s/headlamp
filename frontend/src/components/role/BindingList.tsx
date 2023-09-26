import React from 'react';
import { useTranslation } from 'react-i18next';
import ClusterRoleBinding from '../../lib/k8s/clusterRoleBinding';
import RoleBinding, { KubeRoleBinding } from '../../lib/k8s/roleBinding';
import { useErrorState, useFilterFunc } from '../../lib/util';
import { Link } from '../common';
import LabelListItem from '../common/LabelListItem';
import ResourceListView from '../common/Resource/ResourceListView';

interface RoleBindingDict {
  [kind: string]: RoleBinding[] | null;
}

function RoleLink(props: { role: string; namespace?: string }) {
  const { role, namespace } = props;

  if (namespace) {
    return (
      <Link routeName="role" params={{ name: role, namespace }} tooltip>
        {role}
      </Link>
    );
  }

  return (
    <Link routeName="clusterrole" params={{ name: role }} tooltip>
      {role}
    </Link>
  );
}

export default function RoleBindingList() {
  const [bindings, setBindings] = React.useState<RoleBindingDict | null>(null);
  const [roleBindingError, onRoleBindingError] = useErrorState(setupRoleBindings);
  const [clusterRoleBindingError, onClusterRoleBindingError] =
    useErrorState(setupClusterRoleBindings);
  const { t } = useTranslation(['glossary', 'translation']);
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

  function sortBindings(kind: string, r1: RoleBinding, r2: RoleBinding) {
    const groups1 = r1?.subjects
      ?.filter(subject => subject.kind === kind)
      .map(subject => subject.name);
    const groups2 = r2?.subjects
      ?.filter(subject => subject.kind === kind)
      .map(subject => subject.name);
    if (groups1 && groups2) {
      return groups1.join('').localeCompare(groups2.join(''));
    } else if (groups1) {
      return 1;
    } else if (groups2) {
      return -1;
    } else {
      return 0;
    }
  }

  RoleBinding.useApiList(setupRoleBindings, onRoleBindingError);
  ClusterRoleBinding.useApiList(setupClusterRoleBindings, onClusterRoleBindingError);

  return (
    <ResourceListView
      title={t('glossary|Role Bindings')}
      filterFunction={filterFunc}
      errorMessage={getErrorMessage()}
      columns={[
        'type',
        'name',
        {
          id: 'namespace',
          label: t('glossary|Namespace'),
          getter: item =>
            item.getNamespace() ? (
              <Link routeName="namespace" params={{ name: item.getNamespace() }}>
                {item.getNamespace()}
              </Link>
            ) : (
              t('translation|All namespaces')
            ),
          sort: true,
        },
        {
          id: 'role',
          label: t('glossary|Role'),
          getter: item => <RoleLink role={item.roleRef.name} namespace={item.getNamespace()} />,
          sort: true,
        },
        {
          id: 'users',
          label: t('translation|Users'),
          getter: (item: KubeRoleBinding) => (
            <LabelListItem
              labels={
                item?.subjects
                  ?.filter(subject => subject.kind === 'User')
                  .map(subject => subject.name) || []
              }
            />
          ),
          sort: (r1, r2) => sortBindings('User', r1, r2),
        },
        {
          id: 'groups',
          label: t('glossary|Groups'),
          getter: (item: KubeRoleBinding) => (
            <LabelListItem
              labels={
                item?.subjects
                  ?.filter(subject => subject.kind === 'Group')
                  .map(subject => subject.name) || []
              }
            />
          ),
          sort: (r1, r2) => sortBindings('Group', r1, r2),
        },
        {
          id: 'serviceaccounts',
          label: t('glossary|Service Accounts'),
          getter: (item: KubeRoleBinding) => (
            <LabelListItem
              labels={
                item?.subjects
                  ?.filter(subject => subject.kind === 'ServiceAccount')
                  .map(subject => subject.name) || []
              }
            />
          ),
          sort: (r1, r2) => sortBindings('ServiceAccount', r1, r2),
        },
        'age',
      ]}
      data={getJointItems()}
      id="headlamp-rolebindings"
    />
  );
}
