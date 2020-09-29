import React from 'react';
import CRD from '../../lib/k8s/crd';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { Link } from '../common';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function CustomResourceDefinitionList() {
  const [crds, error] = CRD.useList();
  const filterFunc = useFilterFunc();

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Custom Resource Definitions"
          noNamespaceFilter
        />
      }
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={CRD.getErrorMessage(error)}
        columns={[
          {
            label: 'Name',
            getter: (crd) =>
              <Link
                routeName="crd"
                params={{
                  name: crd.metadata.name,
                }}
              >
                {crd.spec.names.kind}
              </Link>
          },
          {
            label: 'Group',
            getter: (crd) => crd.spec.group
          },
          {
            label: 'Scope',
            getter: (crd) => crd.spec.scope
          },
          {
            label: 'Full name',
            getter: (crd) => crd.metadata.name
          },
          {
            label: 'Age',
            getter: (crd) => timeAgo(crd.metadata.creationTimestamp)
          },
        ]}
        data={crds}
      />
    </SectionBox>
  );
}
