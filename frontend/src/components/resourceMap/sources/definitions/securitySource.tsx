import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import DaemonSet from '../../../../lib/k8s/daemonSet';
import Deployment from '../../../../lib/k8s/deployment';
import Role from '../../../../lib/k8s/role';
import RoleBinding from '../../../../lib/k8s/roleBinding';
import ServiceAccount from '../../../../lib/k8s/serviceAccount';
import { useNamespaces } from '../../../../redux/filterSlice';
import { GraphEdge, GraphSource } from '../../graph/graphModel';
import { getKindGroupColor, KubeIcon } from '../../kubeIcon/KubeIcon';
import { makeKubeObjectNode, makeKubeToKubeEdge } from '../GraphSources';

const rolesSource: GraphSource = {
  id: 'roles',
  label: 'Roles',
  icon: <KubeIcon kind="Role" />,
  useData() {
    const [roles] = Role.useList({ namespace: useNamespaces() });

    return useMemo(
      () =>
        roles
          ? {
              nodes: roles.map(makeKubeObjectNode) ?? [],
            }
          : null,
      [roles]
    );
  },
};

const roleBindingsSource: GraphSource = {
  id: 'roleBindings',
  label: 'Role Bindings',
  icon: <KubeIcon kind="RoleBinding" />,
  useData() {
    const [roleBindings] = RoleBinding.useList({ namespace: useNamespaces() });
    const [roles] = Role.useList({ namespace: useNamespaces() });
    const [serviceAccounts] = ServiceAccount.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      if (!roleBindings || !roles || !serviceAccounts) return null;

      const edges: GraphEdge[] = [];

      roleBindings.forEach(roleBinding => {
        const role = roles.find(role => role.metadata.name === roleBinding.roleRef.name);
        if (role) {
          edges.push(makeKubeToKubeEdge(role, roleBinding));
        }

        // subject
        roleBinding.subjects.forEach(subject => {
          if (subject.kind === 'ServiceAccount') {
            const sa = serviceAccounts.find(sa => sa.metadata.name === subject.name);
            if (sa) {
              edges.push(makeKubeToKubeEdge(sa, roleBinding));
            }
          }
        });
      });

      return {
        nodes: roleBindings.map(makeKubeObjectNode) ?? [],
        edges,
      };
    }, [roleBindings, roles, serviceAccounts]);
  },
};

const serviceAccountsSource: GraphSource = {
  id: 'serviceAccounts',
  label: 'Service Accounts',
  icon: <KubeIcon kind="ServiceAccount" />,
  useData() {
    const [serviceAccounts] = ServiceAccount.useList({ namespace: useNamespaces() });
    const [deployments] = Deployment.useList({ namespace: useNamespaces() });
    const [daemonSets] = DaemonSet.useList({ namespace: useNamespaces() });

    return useMemo(() => {
      if (!serviceAccounts || !deployments || !daemonSets) return null;

      const edges: GraphEdge[] = [];

      serviceAccounts.forEach(sa => {
        const matchingDeployments = deployments?.filter(
          d =>
            (d.spec?.template?.spec?.serviceAccountName ?? 'default') === sa.metadata.name &&
            d.metadata.namespace === sa.metadata.namespace
        );

        matchingDeployments.forEach(d => {
          edges.push(makeKubeToKubeEdge(sa, d));
        });

        daemonSets
          ?.filter(
            d =>
              (d.spec?.template?.spec?.serviceAccountName ?? 'default') === sa.metadata.name &&
              d.metadata.namespace === sa.metadata.namespace
          )
          .forEach(d => edges.push(makeKubeToKubeEdge(sa, d)));
      });

      return {
        edges,
        nodes: serviceAccounts.map(makeKubeObjectNode) ?? [],
      };
    }, [serviceAccounts, deployments, daemonSets]);
  },
};

export const securitySource: GraphSource = {
  id: 'security',
  label: 'Security',
  isEnabledByDefault: false,
  icon: <Icon icon="mdi:lock" width="100%" height="100%" color={getKindGroupColor('security')} />,
  sources: [serviceAccountsSource, rolesSource, roleBindingsSource],
};
