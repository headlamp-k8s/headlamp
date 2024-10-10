import React from 'react';
import { useTranslation } from 'react-i18next';
import ClusterRoleBinding from '../../lib/k8s/clusterRoleBinding';
import RoleBinding from '../../lib/k8s/roleBinding';
import { combineClusterListErrors, flattenClusterListItems, getClusterGroup } from '../../lib/util';
import { Link } from '../common';
import LabelListItem from '../common/LabelListItem';
import ResourceListView from '../common/Resource/ResourceListView';

//@todo: multi, is this needed for anything?
// interface RoleBindingDict {
//   [kind: string]: RoleBinding[] | null;
// }

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
  const [roleBindings, roleBindingsError] = RoleBinding.useListPerCluster();
  const [clusterRoleBindings, clusterRoleBindingsError] = ClusterRoleBinding.useListPerCluster();
  const clusters = getClusterGroup();

  const bindings = React.useMemo(() => {
    return flattenClusterListItems(roleBindings, clusterRoleBindings);
  }, [roleBindings, clusterRoleBindings]);

  const bindingErrors = React.useMemo(() => {
    return combineClusterListErrors(roleBindingsError, clusterRoleBindingsError);
  }, [roleBindingsError, clusterRoleBindingsError]);

  const { t } = useTranslation(['glossary', 'translation']);

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

  //@todo: multi, this is used below.
  // const isMultiCluster = clusters.length > 1;

  return (
    <ResourceListView
      title={t('glossary|Role Bindings')}
      errorMessage={getErrorMessage()}
      //@todo: multi add clusterErrors to ResourceListView
      // clusterErrors={isMultiCluster ? bindingErrors : null}
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
        'cluster',
        'age',
      ]}
      data={getJointItems()}
      id="headlamp-rolebindings"
    />
  );
}
