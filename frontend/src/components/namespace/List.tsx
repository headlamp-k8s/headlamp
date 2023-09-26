import React from 'react';
import { useTranslation } from 'react-i18next';
import helpers from '../../helpers';
import { useCluster } from '../../lib/k8s';
import Namespace from '../../lib/k8s/namespace';
import { Link } from '../common';
import { StatusLabel } from '../common/Label';
import ResourceListView from '../common/Resource/ResourceListView';
import {
  ResourceTableFromResourceClassProps,
  ResourceTableProps,
} from '../common/Resource/ResourceTable';

export default function NamespacesList() {
  const { t } = useTranslation(['glossary', 'translation']);
  const cluster = useCluster();
  // Use the metadata.name field to match the expected format of the ResourceTable component.
  const [allowedNamespaces, setAllowedNamespaces] = React.useState<
    { metadata: { name: string } }[]
  >([]);

  React.useEffect(() => {
    if (cluster) {
      const namespaces = helpers.loadClusterSettings(cluster)?.allowedNamespaces || [];
      setAllowedNamespaces(
        namespaces.map(namespace => ({
          metadata: {
            name: namespace,
          },
        }))
      );
    }
  }, [cluster]);

  function makeStatusLabel(namespace: Namespace) {
    const status = namespace.status.phase;
    return <StatusLabel status={status === 'Active' ? 'success' : 'error'}>{status}</StatusLabel>;
  }

  const resourceTableProps: ResourceTableFromResourceClassProps | ResourceTableProps =
    React.useMemo(() => {
      if (allowedNamespaces.length > 0) {
        return {
          columns: [
            {
              id: 'name',
              label: t('translation|Name'),
              getter: ({ metadata }) => (
                <Link
                  routeName={'namespace'}
                  params={{
                    name: metadata.name,
                  }}
                >
                  {metadata.name}
                </Link>
              ),
            },
            {
              id: 'status',
              label: t('translation|Status'),
              getter: () => 'Unknown',
            },
            {
              id: 'age',
              label: t('translation|Age'),
              getter: () => 'Unknown',
            },
          ],
          data: allowedNamespaces,
        };
      }
      return {
        resourceClass: Namespace,
        columns: [
          'name',
          {
            id: 'status',
            label: t('translation|Status'),
            getter: makeStatusLabel,
            sort: (namespace: Namespace) => namespace.status.phase,
          },
          'age',
        ],
      };
    }, [allowedNamespaces]);

  return (
    <ResourceListView
      title={t('Namespaces')}
      headerProps={{
        noNamespaceFilter: true,
      }}
      {...resourceTableProps}
    />
  );
}
