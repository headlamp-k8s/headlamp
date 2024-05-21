import { useTranslation } from 'react-i18next';
import CRD from '../../lib/k8s/crd';
import { Link } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';

export default function CustomResourceDefinitionList() {
  const { t } = useTranslation(['glossary', 'frequent']);

  return (
    <ResourceListView
      title={t('glossary|Custom Resources')}
      headerProps={{
        noNamespaceFilter: true,
      }}
      resourceClass={CRD}
      columns={[
        {
          label: t('glossary|Resource'),
          getValue: crd => crd.spec.names.kind,
          render: crd => (
            <Link
              routeName="customresources"
              params={{
                crd: crd.metadata.name,
              }}
            >
              {crd.spec.names.kind}
            </Link>
          ),
        },
        {
          label: t('glossary|Definition'),
          getValue: crd => crd.metadata.name,
          render: crd => (
            <Link
              routeName="crd"
              params={{
                name: crd.metadata.name,
              }}
            >
              {crd.metadata.name}
            </Link>
          ),
        },
        {
          label: t('translation|Group'),
          getValue: crd => crd.spec.group,
        },
        {
          label: t('Scope'),
          getValue: crd => crd.spec.scope,
        },
        'age',
      ]}
    />
  );
}
