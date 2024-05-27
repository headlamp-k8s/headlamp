import React from 'react';
import { useTranslation } from 'react-i18next';
import CRD from '../../lib/k8s/crd';
import { Link, useThrottle } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';

export default function CustomResourceDefinitionList() {
  const { t } = useTranslation(['glossary', 'frequent']);
  const [items, error] = CRD.useList();
  const throttledItems = useThrottle(items, 1000);

  const categories = React.useMemo(() => {
    if (!items || items?.length === 0) {
      return [];
    }

    const categories = new Set<string>();
    items.forEach((crd: CRD) => {
      const crdCategories = crd.getCategories() || [];
      crdCategories.forEach(category => categories.add(category));
    });

    return Array.from(categories).sort();
  }, [items]);

  return (
    <ResourceListView
      title={t('glossary|Custom Resources')}
      headerProps={{
        noNamespaceFilter: false,
      }}
      data={throttledItems}
      errorMessage={CRD.getErrorMessage(error)}
      columns={[
        {
          label: t('glossary|Resource'),
          getValue: (crd: CRD) => crd.spec.names.kind,
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
        {
          label: t('translation|Categories'),
          getValue: crd => crd.getCategories()?.join(', '),
          filterVariant: 'multi-select',
          filterSelectOptions: categories,
        },
        'age',
      ]}
    />
  );
}
