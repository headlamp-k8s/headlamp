import React from 'react';
import { useTranslation } from 'react-i18next';
import helpers from '../../helpers';
import { useCluster } from '../../lib/k8s';
import Namespace from '../../lib/k8s/namespace';
import { Link, SimpleTable } from '../common';
import { StatusLabel } from '../common/Label';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function NamespacesList() {
  const { t } = useTranslation(['glossary', 'frequent']);
  const cluster = useCluster();
  const [allowedNamespaces, setAllowedNamespaces] = React.useState<{ namespace: string }[]>([]);
  let renderResource = null;

  React.useEffect(() => {
    if (cluster) {
      const namespaces = helpers.loadClusterSettings(cluster)?.allowedNamespaces || [];
      setAllowedNamespaces(namespaces.map(namespace => ({ namespace })));
    }
  }, [cluster]);

  function makeStatusLabel(namespace: Namespace) {
    const status = namespace.status.phase;
    return <StatusLabel status={status === 'Active' ? 'success' : 'error'}>{status}</StatusLabel>;
  }

  if (allowedNamespaces.length > 0) {
    renderResource = (
      <SimpleTable
        columns={[
          {
            label: t('frequent|Name'),
            getter: ({ namespace }) => (
              <Link
                routeName={'namespace'}
                params={{
                  name: namespace,
                }}
              >
                {namespace}
              </Link>
            ),
          },
          {
            label: t('frequent|Status'),
            getter: () => 'Unknown',
          },
          {
            label: t('frequent|Age'),
            getter: () => 'Unknown',
          },
        ]}
        data={allowedNamespaces}
      />
    );
  } else {
    renderResource = (
      <ResourceTable
        resourceClass={Namespace}
        columns={[
          'name',
          {
            label: t('frequent|Status'),
            getter: makeStatusLabel,
            sort: (namespace: Namespace) => namespace.status.phase,
          },
          'age',
        ]}
      />
    );
  }

  return (
    <SectionBox
      title={<SectionFilterHeader title={t('Namespaces')} noNamespaceFilter headerStyle="main" />}
    >
      {renderResource}
    </SectionBox>
  );
}
