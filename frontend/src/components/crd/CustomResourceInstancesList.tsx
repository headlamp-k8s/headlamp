import { Alert, AlertTitle } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KubeObject } from '../../lib/k8s/cluster';
import CRD from '../../lib/k8s/crd';
import { Link, Loader, SectionBox, ShowHideLabel } from '../common/';
import Empty from '../common/EmptyContent';
import { ResourceListView } from '../common/Resource';

function CrInstancesView({ crds }: { crds: CRD[]; key: string }) {
  const { t } = useTranslation(['glossary', 'translation']);

  const crdInfo = useMemo(() => crds.map(crd => crd.makeCRClass()), [crds]);
  const queries = crdInfo.map(cr => cr.useList());
  const [isWarningClosed, setIsWarningClosed] = useState(false);

  const { crInstancesList, getCRDForCR, isLoading, crdsFailedToLoad, allFailed } = useMemo(() => {
    const isLoading = queries.some(it => it.isLoading || it.isFetching);

    // Collect the names of CRD that failed to load lists
    const crdsFailedToLoad: string[] = [];
    queries.forEach((it, i) => {
      if (it.isError) {
        crdsFailedToLoad.push(crds[i].metadata.name);
      }
    });

    // Create a map to be able to link to CRD by CR kind
    const crKindToCRDMap = queries.reduce((acc, { items }, index) => {
      if (items?.[0]) {
        acc[items[0].kind] = crds[index];
      }
      return acc;
    }, {} as Record<string, CRD>);
    const getCRDForCR = (cr: KubeObject) => crKindToCRDMap[cr.kind];

    return {
      crInstancesList: queries.flatMap(it => it.items ?? []),
      getCRDForCR,
      isLoading,
      crdsFailedToLoad,
      allFailed: crdsFailedToLoad.length === queries.length,
    };
  }, queries);

  if (isLoading) {
    return <Loader title={t('translation|Loading custom resource instances')} />;
  }

  if (crInstancesList.length === 0) {
    return <Empty>{t('translation|No custom resources instances found.')}</Empty>;
  }

  return (
    <SectionBox backLink>
      {crdsFailedToLoad.length > 0 && !allFailed && !isWarningClosed && (
        <Alert
          severity="warning"
          variant="outlined"
          onClose={() => setIsWarningClosed(true)}
          sx={theme => ({ margin: theme.spacing(2, 2, 0, 2) })}
        >
          <AlertTitle>{t('translation|Failed to load custom resource instances')}</AlertTitle>
          <ShowHideLabel>{crdsFailedToLoad.join(', ')}</ShowHideLabel>
        </Alert>
      )}
      <ResourceListView
        title="Custom Resource Instances"
        headerProps={{
          noNamespaceFilter: false,
        }}
        errorMessage={
          allFailed ? t('translation|Failed to load custom resource instances') : undefined
        }
        data={crInstancesList}
        columns={[
          {
            label: 'Instance name',
            getValue: cr => {
              return cr.metadata.name;
            },
            render: cr => {
              return (
                <Link
                  routeName="customresource"
                  params={{
                    crName: cr.metadata.name,
                    crd: getCRDForCR(cr).metadata.name,
                    namespace: cr.metadata.namespace ?? '-',
                  }}
                >
                  {cr.metadata.name}
                </Link>
              );
            },
          },
          {
            label: 'CRD',
            getValue: cr => {
              return cr.kind;
            },
            render: cr => {
              return (
                <Link
                  routeName="crd"
                  params={{
                    name: getCRDForCR(cr).metadata.name,
                  }}
                >
                  {cr.kind}
                </Link>
              );
            },
          },
          {
            label: 'Categories',
            getValue: cr => {
              const categories = getCRDForCR(cr).jsonData!.status.acceptedNames.categories;
              return categories !== undefined ? categories.toString().split(',').join(', ') : '';
            },
          },
          'namespace',
          'age',
        ]}
      />
    </SectionBox>
  );
}

export function CrInstanceList() {
  const { t } = useTranslation(['glossary', 'translation']);
  const { items: crds, error: crdsError, isLoading: isLoadingCRDs } = CRD.useList();

  if (crdsError) {
    return (
      <Empty color="error">
        {t('translation|Error getting custom resource definitions: {{ errorMessage }}', {
          errorMessage: crdsError,
        })}
      </Empty>
    );
  }

  if (isLoadingCRDs || !crds) {
    return <Loader title={t('translation|Loading custom resource definitions')} />;
  }

  return <CrInstancesView key={crds.map(it => it.metadata.name).join(',')} crds={crds} />;
}
