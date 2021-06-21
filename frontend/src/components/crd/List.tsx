import React from 'react';
import { useTranslation } from 'react-i18next';
import CRD from '../../lib/k8s/crd';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { Link } from '../common';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function CustomResourceDefinitionList() {
  const [crds, error] = CRD.useList();
  const filterFunc = useFilterFunc();
  const { t } = useTranslation('glossary');

  return (
    <SectionBox
      title={<SectionFilterHeader title={t('crd|Custom Resource Definitions')} noNamespaceFilter />}
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={CRD.getErrorMessage(error)}
        columns={[
          {
            label: t('frequent|Name'),
            getter: crd => (
              <Link
                routeName="crd"
                params={{
                  name: crd.metadata.name,
                }}
              >
                {crd.spec.names.kind}
              </Link>
            ),
          },
          {
            label: t('frequent|Group'),
            getter: crd => crd.spec.group,
          },
          {
            label: t('Scope'),
            getter: crd => crd.spec.scope,
          },
          {
            label: t('frequent|Full name'),
            getter: crd => crd.metadata.name,
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
            label: t('frequent|Age'),
            getter: crd => timeAgo(crd.metadata.creationTimestamp),
            sort: (c1: CRD, c2: CRD) =>
              new Date(c2.metadata.creationTimestamp).getTime() -
              new Date(c1.metadata.creationTimestamp).getTime(),
          },
        ]}
        data={crds}
        defaultSortingColumn={5}
      />
    </SectionBox>
  );
}
