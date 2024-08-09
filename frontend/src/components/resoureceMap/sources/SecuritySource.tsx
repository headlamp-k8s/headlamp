import { GraphEdge, GraphSource } from '../GraphModel';

const rolesSource: GraphSource = {
  id: 'roles',
  label: 'Roles',
  nodes: ({ resources }) =>
    resources.roles.map(role => ({
      type: 'kubeObject',
      id: role.metadata.uid,
      data: {
        resource: role,
      },
    })),
};

const roleBindingsSource: GraphSource = {
  id: 'roleBindings',
  label: 'Role Bindings',
  nodes: ({ resources }) =>
    resources.roleBindings.map(roleBinding => ({
      type: 'kubeObject',
      id: roleBinding.metadata.uid,
      data: {
        resource: roleBinding,
      },
    })),
  edges: ({ resources }) => {
    const edges: GraphEdge[] = [];

    resources.roleBindings.forEach(roleBinding => {
      const role = resources.roles.find(role => role.metadata.name === roleBinding.roleRef.name);
      if (role) {
        edges.push({
          id: `${role.metadata.uid}-${roleBinding.metadata.uid}`,
          source: role.metadata.uid,
          target: roleBinding.metadata.uid,
        });
      }

      // subject
      roleBinding.subjects.forEach((subject: any) => {
        if (subject.kind === 'ServiceAccount') {
          const sa = resources.serviceAccounts.find(sa => sa.metadata.name === subject.name);
          if (sa) {
            edges.push({
              id: `${sa.metadata.uid}-${roleBinding.metadata.uid}`,
              source: sa.metadata.uid,
              target: roleBinding.metadata.uid,
            });
          }
        }
      });
    });

    return edges;
  },
};

const serviceAccountsSource: GraphSource = {
  id: 'serviceAccounts',
  label: 'Service Accounts',
  nodes: ({ resources }) =>
    resources.serviceAccounts
      .map(sa => ({
        type: 'kubeObject',
        id: sa.metadata.uid,
        data: {
          resource: sa,
        },
      }))
      .filter(it => it.data.resource.metadata.name !== 'default'),
  edges: ({ resources }) =>
    resources.serviceAccounts.flatMap(sa =>
      resources.pods
        .filter((pod: any) => pod.spec.serviceAccountName === sa.metadata.name)
        .map(pod => ({
          id: `${sa.metadata.uid}-${pod.metadata.uid}`,
          source: sa.metadata.uid,
          target: pod.metadata.uid,
        }))
    ),
};

export const SecuritySource: GraphSource = {
  id: 'security',
  label: 'Security',
  sources: [serviceAccountsSource, rolesSource, roleBindingsSource],
};
