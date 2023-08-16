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
          getter: crd => (
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
          getter: crd => (
            <Link
              routeName="crd"
              params={{
                name: crd.metadata.name,
              }}
            >
              {crd.metadata.name}
            </Link>
          ),
          sort: (c1: CRD, c2: CRD) => {
            if (c1.metadata.name < c2.metadata.name) {
              return -1;
            } else if (c1.metadata.name > c2.metadata.name) {
              return 1;
            }
            return 0;
          },
        },
        {
          label: t('translation|Group'),
          getter: crd => crd.spec.group,
          sort: true,
        },
        {
          label: t('Scope'),
          getter: crd => crd.spec.scope,
          sort: true,
        },
        'age',
      ]}
    />
  );
}
