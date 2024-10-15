import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import DaemonSet from '../../../../lib/k8s/daemonSet';
import Deployment from '../../../../lib/k8s/deployment';
import Role from '../../../../lib/k8s/role';
import RoleBinding from '../../../../lib/k8s/roleBinding';
import ServiceAccount from '../../../../lib/k8s/serviceAccount';
import { GraphEdge, GraphSource } from '../../graph/graphModel';
import { getKindGroupColor, KubeIcon } from '../../kubeIcon/KubeIcon';
import { makeKubeObjectNode, makeKubeToKubeEdge } from '../GraphSources';

const rolesSource: GraphSource = {
  id: 'roles',
  label: 'Roles',
  icon: <KubeIcon kind="Role" />,
  useData() {
    const { data: rolesList } = Role.useList();

    return useMemo(
      () => ({
        nodes: rolesList?.items?.map(makeKubeObjectNode) ?? [],
      }),
      [rolesList]
    );
  },
};

const roleBindingsSource: GraphSource = {
  id: 'roleBindings',
  label: 'Role Bindings',
  icon: <KubeIcon kind="RoleBinding" />,
  useData() {
    const { data: roleBindingsList } = RoleBinding.useList();
    const { data: roleList } = Role.useList();
    const { data: serviceAccounts } = ServiceAccount.useList();

    return useMemo(() => {
      const edges: GraphEdge[] = [];

      roleBindingsList?.items?.forEach(roleBinding => {
        const role = roleList?.items?.find(role => role.metadata.name === roleBinding.roleRef.name);
        if (role) {
          edges.push(makeKubeToKubeEdge(role, roleBinding));
        }

        // subject
        roleBinding.subjects.forEach((subject: any) => {
          if (subject.kind === 'ServiceAccount') {
            const sa = serviceAccounts?.items?.find(sa => sa.metadata.name === subject.name);
            if (sa) {
              edges.push(makeKubeToKubeEdge(sa, roleBinding));
            }
          }
        });
      });

      return {
        nodes: roleBindingsList?.items?.map(makeKubeObjectNode) ?? [],
        edges,
      };
    }, [roleBindingsList]);
  },
};

const serviceAccountsSource: GraphSource = {
  id: 'serviceAccounts',
  label: 'Service Accounts',
  icon: <KubeIcon kind="ServiceAccount" />,
  useData() {
    const { data: serviceAccountsList } = ServiceAccount.useList();
    const [deployments] = Deployment.useList();
    const [daemonSets] = DaemonSet.useList();

    return useMemo(() => {
      const edges: GraphEdge[] = [];

      serviceAccountsList?.items?.forEach(sa => {
        const matchingDeployments = deployments?.filter(
          d =>
            (d.spec?.template?.spec?.serviceAccountName ?? 'default') === sa.metadata.name &&
            d.metadata.namespace === sa.metadata.namespace
        );

        matchingDeployments?.forEach(d => {
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
        nodes: serviceAccountsList?.items?.map(makeKubeObjectNode) ?? [],
      };
    }, [serviceAccountsList]);
  },
};

export const SecuritySource: GraphSource = {
  id: 'security',
  label: 'Security',
  isEnabledByDefault: false,
  icon: <Icon icon="mdi:lock" width="100%" height="100%" color={getKindGroupColor('security')} />,
  sources: [serviceAccountsSource, rolesSource, roleBindingsSource],
};
