import React from 'react';
import { useTranslation } from 'react-i18next';
import ClusterRoleBinding from '../../lib/k8s/clusterRoleBinding';
import RoleBinding from '../../lib/k8s/roleBinding';
import { combineClusterListErrors, getClusterGroup } from '../../lib/util';
import { useNamespaces } from '../../redux/filterSlice';
import { Link } from '../common';
import LabelListItem from '../common/LabelListItem';
import ResourceListView from '../common/Resource/ResourceListView';

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
  const { t } = useTranslation(['glossary', 'translation']);
  const { items: roles, clusterErrors: rolesErrors } = RoleBinding.useList({
    namespace: useNamespaces(),
  });
  const { items: clusterRoles, clusterErrors: clusterRolesErrors } = ClusterRoleBinding.useList();
  const clusters = getClusterGroup();

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
      return RoleBinding.getErrorMessage(Object.values(allErrors!)[0]);
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

  return (
    <ResourceListView
      title={t('glossary|Role Bindings')}
      errorMessage={getErrorMessage()}
      clusterErrors={isMultiCluster ? allErrors : null}
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
        'cluster',
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
      data={allRoles}
      id="headlamp-rolebindings"
    />
  );
}
