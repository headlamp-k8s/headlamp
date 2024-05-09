import React from 'react';
import { useTranslation } from 'react-i18next';
import ClusterRoleBinding from '../../lib/k8s/clusterRoleBinding';
import RoleBinding from '../../lib/k8s/roleBinding';
import { useErrorState } from '../../lib/util';
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

  function sortBindings(kind: string) {
    return function (r1: RoleBinding, r2: RoleBinding) {
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
    };
  }

  RoleBinding.useApiList(setupRoleBindings, onRoleBindingError);
  ClusterRoleBinding.useApiList(setupClusterRoleBindings, onClusterRoleBindingError);

  return (
    <ResourceListView
      title={t('glossary|Role Bindings')}
      errorMessage={getErrorMessage()}
      columns={[
        'type',
        'name',
        {
          id: 'namespace',
          label: t('glossary|Namespace'),
          getValue: item => item.getNamespace() ?? t('translation|All namespaces'),
          render: item =>
            item.getNamespace() ? (
              <Link routeName="namespace" params={{ name: item.getNamespace() }}>
                {item.getNamespace()}
              </Link>
            ) : (
              t('translation|All namespaces')
            ),
        },
        {
          id: 'role',
          label: t('glossary|Role'),
          getValue: item => item.roleRef.name,
          render: item => <RoleLink role={item.roleRef.name} namespace={item.getNamespace()} />,
        },
        {
          id: 'users',
          label: t('translation|Users'),
          getValue: item =>
            item?.subjects
              ?.filter(s => s.kind === 'User')
              ?.map(s => s.name)
              ?.join(' '),
          render: item => (
            <LabelListItem
              labels={
                item?.subjects
                  ?.filter(subject => subject.kind === 'User')
                  .map(subject => subject.name) || []
              }
            />
          ),
          sort: sortBindings('User'),
        },
        {
          id: 'groups',
          label: t('glossary|Groups'),
          getValue: item =>
            item?.subjects
              ?.filter(subject => subject.kind === 'Group')
              ?.map(subject => subject.name)
              ?.join(' '),
          render: item => (
            <LabelListItem
              labels={
                item?.subjects
                  ?.filter(subject => subject.kind === 'Group')
                  .map(subject => subject.name) || []
              }
            />
          ),
          sort: sortBindings('Group'),
        },
        {
          id: 'serviceaccounts',
          label: t('glossary|Service Accounts'),
          getValue: item =>
            item?.subjects
              ?.filter(subject => subject.kind === 'ServiceAccount')
              ?.map(subject => subject.name)
              ?.join(' '),
          render: item => (
            <LabelListItem
              labels={
                item?.subjects
                  ?.filter(subject => subject.kind === 'ServiceAccount')
                  .map(subject => subject.name) || []
              }
            />
          ),
          sort: sortBindings('Service Accounts'),
        },
        'age',
      ]}
      data={getJointItems()}
      id="headlamp-rolebindings"
    />
  );
}
