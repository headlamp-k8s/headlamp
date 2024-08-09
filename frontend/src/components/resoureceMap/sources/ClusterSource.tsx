import { GraphSource } from '../GraphModel';

export const NamespaceSource: GraphSource = {
  id: 'namespace',
  label: 'Namespaces',
  nodes: ({ resources }) =>
    resources.namespaces.map(namespace => ({
      id: namespace.metadata.name,
      type: 'customGroup',
      data: {
        resource: namespace,
      },
    })),
};

export const ClusterSource: GraphSource = {
  id: 'cluster',
  label: 'Cluster',
  sources: [NamespaceSource],
};
